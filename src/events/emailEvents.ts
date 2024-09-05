import mailEventEmitter from './eventEmmiterINstance';


// Event to trigger when a new email arrives
mailEventEmitter.on('newMail', (subject:any, body:any) => {
  console.log(`New Mail Received - Subject: ${subject}`);
  // Emit an event to start the algorithm processing
  mailEventEmitter.emit('startAlgorithm', { subject, body });
});

export default mailEventEmitter;
