import { MongoClient, Db,ServerApiVersion  } from 'mongodb';
import dotenv from 'dotenv';

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
