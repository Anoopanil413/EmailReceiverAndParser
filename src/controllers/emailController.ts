import { Request, Response } from 'express';
// import transporter from '../config/email';
import {processImage} from '../algorithms/imageProcessing';

export async function handleIncomingEmail(req: Request, res: Response) {
  const { image }: { image: any } = req.body;
  if (!image) return res.status(400).send('No image attached');

  // Process the image
  const output = processImage(image);

  // Send the output to the frontend via WebSocket or another service
  // Code to trigger WebSocket event

  res.send('Image processed and result sent to frontend');
}
