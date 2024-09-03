import WebSocket from 'ws';

declare global {
  namespace NodeJS {
    interface Global {
      io: WebSocket.Server;
    }
  }
}
