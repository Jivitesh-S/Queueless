export const configureSockets = (io) => {
  io.on('connection', (socket) => {
    socket.on('queue:join', (queueId) => socket.join(`queue:${queueId}`));
    socket.on('display:join', (queueId) => socket.join(`display:${queueId}`));
    socket.on('admin:join', () => socket.join('admins'));
    socket.on('queue:leave', (queueId) => socket.leave(`queue:${queueId}`));
  });
};
