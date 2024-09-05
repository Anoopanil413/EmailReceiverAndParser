// mailReceiver.ts

import Imap from 'imap';
import { EventEmitter } from 'events';
import { simpleParser, ParsedMail, Attachment } from 'mailparser';
import { inspect } from 'util';
import mailEventEmitter from '../events/eventEmmiterINstance';

class MailReceiver  {
  private imap: Imap;

  constructor() {
    this.imap = new Imap({
      user: process.env.IMAP_USER || "",
      password: process.env.IMAP_PASSWORD || "",
      host: process.env.IMAP_HOST,
      port: parseInt(process.env.IMAP_PORT || '993', 10),
      tls: true,
      tlsOptions: { rejectUnauthorized: false }, // Handle self-signed certificates
    });
  }

  connect() {
    this.imap.connect();
  }

  async startMailListener() {
    this.imap.once('ready', () => {
      this.openInbox((err, box) => {
        if (err) throw err;

        this.imap.on('mail', () => {
          const fetch = this.imap.seq.fetch(`${box?.messages.total}:*`, {
            bodies: '',
            struct: true,
          });

          fetch.on('message', (msg, seqno) => {
            let prefix = `(#${seqno}) `;
            let buffer: Buffer[] = [];

            msg.on('body', (stream, info) => {
              stream.on('data', (chunk) => {
                buffer.push(chunk);
              });
            });

            msg.once('end', async () => {
              const parsedEmail = await simpleParser(Buffer.concat(buffer));
              // console.log('parsedEmailparsedEmailparsedEmailparsedEmailparsedEmail',parsedEmail)
              console.log("parsedEmail")
              mailEventEmitter.emit('newMail', parsedEmail);
            });
          });

          fetch.once('error', (err) => {
            console.log('Fetch error: ' + err);
          });

          fetch.once('end', () => {
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
    return true;
  }

  openInbox(callback: (err: Error | null, box?: Imap.Box) => void) {
    this.imap.openBox('INBOX', true, callback);
  }
}

export default MailReceiver;
