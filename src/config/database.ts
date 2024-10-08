import { MongoClient, Db,ServerApiVersion, Collection  } from 'mongodb';
import dotenv from 'dotenv';
import { ParsedMail } from 'mailparser';

dotenv.config();

const uri = process.env.MONGO_DB || '';
let db: Db;

export const connectDB = async () => {
  if (db) return db;

  const client = new MongoClient(uri,{  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }});

  await client.connect();
  db = client.db(process.env.DB_NAME);
  console.log('Connected to MongoDB');
  return db;
};


export const getEmailsCollection = async (): Promise<Collection> => {
  const db = await connectDB();
  return db.collection('emails');
};

export const saveEmail = async (emailData: any): Promise<void> => {
  const emailsCollection = await getEmailsCollection();
  await emailsCollection.insertOne(emailData);
  console.log('Email saved to database:', emailData._id);
};
export const saveEmailToDatabase = async (parsedEmail: ParsedMail): Promise<void> => {
  const db = await connectDB();
  const emailsCollection = db.collection('emails');

  const emailData = {
    subject: parsedEmail.subject || '(No Subject)',
    from: parsedEmail.from?.text || '',
    to: parsedEmail.to || '',
    date: parsedEmail.date || new Date(),
    html: parsedEmail.html || '',
    text: parsedEmail.text || '',
    attachments: parsedEmail.attachments.map((attachment:any) => ({
      filename: attachment.filename,
      contentType: attachment.contentType,
      size: attachment.size,
      content: attachment.content, 
    })),
  };

  await emailsCollection.insertOne(emailData);
  console.log('Email saved to database:', emailData.subject);
};