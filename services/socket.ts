import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

const WS_URL = "https://meowback-production.up.railway.app";
let socket: Socket | null = null;

export const createSocket = async (): Promise<Socket | null> => {
  if (socket && socket.connected) {
    console.log("⚠️ Socket déjà connecté :", socket.id);
    return socket;
  }
  const accessToken = await AsyncStorage.getItem("accessToken");
  const refreshToken = await AsyncStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) {
    console.log("❌ Tokens manquants, socket non créé");
    return null;
  }

  console.log("🔐 accessToken:", accessToken.slice(0, 20) + "...");
  console.log("🔄 refreshToken:", refreshToken.slice(0, 20) + "...");

  socket = io(WS_URL, {
    transports: ["websocket"],
    path: "/socket.io",
    autoConnect: true,
    query: {
      accessToken,
      refreshToken,
    },
  });

  socket.on("new-access-token", async (newToken) => {
    console.log("🆕 Nouveau accessToken reçu via WebSocket");
    await AsyncStorage.setItem("accessToken", newToken);
  });

  //socket?.on("connect", () => {
  //if (!socket) return;
  //const fullUrl = `wss://${socket?.io.opts.hostname}${socket?.io.opts.path}`;
  //console.log("✅ WebSocket connecté !");
  //console.log("socketId:", socket.id);
  //console.log("🔗 URL de connexion :", fullUrl);
  //});

  return socket;
};
export const getSocket = () => socket;

export const waitForSocketConnection = (
  socket: Socket,
  timeout = 3000
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (socket.connected) return resolve(true);

    const timer = setTimeout(() => {
      reject(new Error("❌ Timeout : socket non connecté"));
    }, timeout);

    socket.once("connect", () => {
      clearTimeout(timer);
      resolve(true);
    });
  });
};
