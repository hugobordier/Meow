// services/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const createSocket = () => {
  socket = io("https://meowback-production.up.railway.app", {
    autoConnect: true,
  });
  return socket;
};

export const getSocket = () => socket;
