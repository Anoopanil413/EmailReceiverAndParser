import Imap from 'imap';
import { EventEmitter } from 'events';
import { inspect } from 'util';

export class MailReceiver extends EventEmitter {
  private imap: Imap;

  constructor() {
    super();
    this.imap = new Imap({
      user: process.env.IMAP_USER || "",
      password: process.env.IMAP_PASSWORD || "",
      host: process.env.IMAP_HOST,
      port: parseInt(process.env.IMAP_PORT || '993', 10),
      tls: true,
      tlsOptions: { rejectUnauthorized: false } // Ignore self-signed certificate
    });
  }

  connect() {
    this.imap.connect();
  }

  openInbox(callback: (err: Error | null, box?: Imap.Box) => void) {
    this.imap.openBox('INBOX', true, callback);
  }

  async startMailListener() {
    this.imap.once('ready', () => {
      this.openInbox((err, box) => {
        if (err) throw err;

        this.imap.on('mail', () => {
          const f = this.imap.seq.fetch(`${box!.messages.total}:*`, {
            bodies: ['HEADER.FIELDS (FROM)','TEXT']
          });

          f.on('message', (msg, seqno) => {
            let prefix = `(#${seqno}) `;
            let body = '';
            msg.on('body', (stream, info) => {
              stream.on('data', (chunk) => {
                body += chunk.toString('utf8');
              });
              stream.once('end', () => {
                if (info.which === 'TEXT') {
                  console.log(prefix + 'Body [%s] Finished', inspect(info.which));
                  console.log('bodybodybodybody',body)
                  this.emit('newMail', 'Subject Placeholder', body);
                }
              });
            });
          });

          f.once('error', (err) => {
            console.log('Fetch error: ' + err);
          });

          f.once('end', () => {
            console.log('Done fetching all messages!');
          });
        });
      });
    });

    this.imap.once('error', (err:any) => {
      console.log('IMAP error: ' + err);
    });

    this.imap.once('end', () => {
      console.log('Connection ended');
    });

    this.connect();
    return true
  }
}

export default MailReceiver;
