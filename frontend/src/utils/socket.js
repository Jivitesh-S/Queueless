import { io } from 'socket.io-client';

export const createSocket = () =>
  io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    autoConnect: true,
    transports: ['websocket']
  });
