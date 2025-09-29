declare module "sockjs-client" {
  import { EventEmitter } from "events";

  class SockJS extends EventEmitter {
    constructor(url: string, _reserved?: any, options?: any);
    close(code?: number, reason?: string): void;
    send(data: string): void;
    onopen: (e: any) => void;
    onmessage: (e: { data: string }) => void;
    onclose: (e: any) => void;
  }

  export = SockJS;
}
