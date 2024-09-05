import { Request, Response } from 'express';
// import transporter from '../config/email';
import {processImage} from '../algorithms/imageProcessing';
import mailEventEmitter from '../events/eventEmmiterINstance';

mailEventEmitter.on('startAlgorithm', (mailData:any) => {
  const { subject, body } = mailData;
  console.log('Algorithm triggered with mail data:', subject, body);

  // Perform your algorithm logic here
  // After processing, save the result to the database and notify frontend
});


export async function handleIncomingEmail(req: Request, res: Response) {
  const { image }: { image: any } = req.body;
  if (!image) return res.status(400).send('No image attached');

  // Process the image
  const output = processImage(image);

  // Send the output to the frontend via WebSocket or another service
  // Code to trigger WebSocket event

  res.send('Image processed and result sent to frontend');
}
