import http from 'http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { configureSockets } from './sockets/index.js';
import { registerSocketServer } from './services/socketBus.js';

const start = async () => {
  await connectDb();
  const app = createApp();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: env.clientUrl, credentials: true }
  });

  registerSocketServer(io);
  configureSockets(io);

  server.listen(env.port, () => {
    console.log(`QueueLess API listening on ${env.port}`);
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
