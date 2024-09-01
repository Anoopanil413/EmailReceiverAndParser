import WebSocket, { Server } from 'ws';

const wss = new Server({ port: process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8080 });

wss.on('connection', (ws: WebSocket) => {
  console.log('New client connected');
  ws.on('message', (message: WebSocket.Data) => {
    console.log(`Received: ${message}`);
  });
  ws.on('close', () => console.log('Client disconnected'));
});

export default wss;
