import { io } from 'socket.io-client';

export const createSocket = () =>
  io(import.meta.env.VITE_SOCKET_URL || 'https://queuelessb.onrender.com', {
    autoConnect: true,
    transports: ['websocket']
  });

