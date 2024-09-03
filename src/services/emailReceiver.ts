import { ImapFlow } from 'imapflow'; 
import { EventEmitter } from 'events';
import { inspect } from 'util';

export class MailReceiver extends EventEmitter {
  private imap: any;

  constructor() {
    super();
    this.imap = new ImapFlow({
      host: process.env.IMAP_HOST,
      port: process.env.IMAP_PORT,
      secure: true,
      auth: {
        user: process.env.IMAP_USER,
        pass: process.env.IMAP_PASSWORD
      }
    });
  }

  async connect() {
    await this.imap.connect();
  }

  async openInbox() {
    const lock = await this.imap.getMailboxLock('INBOX');
    try {
      const messages = await this.imap.fetch('*', { envelope: true, source: true });

      for await (const msg of messages) {
        this.emit('newMail', msg.envelope.subject, msg.source.toString('utf8'));
      }
    } finally {
      lock.release();
    }
  }

  async startMailListener() {
    await this.connect();
    this.imap.on('mail', async () => {
      await this.openInbox();
    });
  }
}

export default MailReceiver;
