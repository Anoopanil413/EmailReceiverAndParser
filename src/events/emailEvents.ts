import { parseEmail } from '../algorithms/emailParse';
import mailEventEmitter from './eventEmmiterINstance';


mailEventEmitter.on('newMail', async(subject:any, body:any) => {
  console.log(`New Mail Received - Subject: ${subject}`);
  // Emit an event to start the algorithm processing
          await parseEmail(subject)
          console.log("zipp extraction ")
  // mailEventEmitter.emit('startAlgorithm', { subject, body });
});

// export default mailEventEmitter;
