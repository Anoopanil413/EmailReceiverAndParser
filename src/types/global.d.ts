import WebSocket from 'ws';

declare global {
  var io: WebSocket.Server;
}

