// frontend/src/features/chat/api/socket.ts
import { io, Socket } from "socket.io-client";
const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

// Initialise la connexion Socket.IO
const socket: Socket = io(SOCKET_SERVER_URL, {
  // Options de configuration si nécessaire
  // Par exemple, pour l'authentification future
  // auth: {
  //   token: localStorage.getItem('authToken'),
  // },
});

// Événements de base pour le débogage
socket.on("connect", () => {
  console.log("Socket.IO client connecté au serveur !");
});

socket.on("disconnect", (reason) => {
  console.log(`Socket.IO client déconnecté: ${reason}`);
});

socket.on("connect_error", (error) => {
  console.error("Erreur de connexion Socket.IO:", error.message);
});

export default socket;
