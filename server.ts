import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import emailRoutes from './src/routes/emailRoutes';
// import websocket from './src/config/websocket';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/email', emailRoutes);

app.get('/',(req:Request,res:Response)=>{
  res.send("welcome !!!")

})


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
