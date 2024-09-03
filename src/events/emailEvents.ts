import { EventEmitter } from 'events';

const mailEventEmitter = new EventEmitter();

// Event to trigger when a new email arrives
mailEventEmitter.on('newMail', (subject, body) => {
  console.log(`New Mail Received - Subject: ${subject}`);
  // Emit an event to start the algorithm processing
  mailEventEmitter.emit('startAlgorithm', { subject, body });
});

export default mailEventEmitter;
