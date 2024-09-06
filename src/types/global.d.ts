import WebSocket from 'ws';

declare global {
  var io: WebSocket.Server;
}

 declare module 'unrar-js' {
  export class Extractor {
    static extract(buffer: Buffer): any; 
  }
}
