import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import emailRoutes from './src/routes/emailRoutes';
import './src/events/emailEvents'
import MailReceiver from './src/services/emailReceiver';
import { connectDB } from './src/config/database';
// import websocket from './src/config/websocket';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/email', emailRoutes);

app.get('/',(req:Request,res:Response)=>{
  res.send("welcome !!!")

})


const MaileReceiverFun = async()=>{
  const mailReceiver = new MailReceiver();
  const mailReceived =  await mailReceiver.startMailListener()
  
  console.log('mailReceived',mailReceived)
  return true
}






const PORT = process.env.PORT || 3000;


app.listen(PORT, async() => {
  await connectDB()
  await MaileReceiverFun()
  console.log(`Server is running on port ${PORT}`);
});
