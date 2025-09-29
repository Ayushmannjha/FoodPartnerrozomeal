// src/services/stompClient.ts
import { Client } from "@stomp/stompjs";

let stompClient: Client | null = null;

export const connectStomp = (onConnect?: () => void) => {
  stompClient = new Client({
    brokerURL: "ws://api.rozomeal.com/ws", // pure WebSocket
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("✅ STOMP connected");
      if (onConnect) onConnect();
    },
    debug: (str) => console.log("STOMP DEBUG:", str),
  });

  stompClient.activate();
};

export const getStompClient = () => stompClient;
