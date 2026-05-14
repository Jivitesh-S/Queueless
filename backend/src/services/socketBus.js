let ioInstance = null;

export const registerSocketServer = (io) => {
  ioInstance = io;
};

export const emitQueueUpdate = (queueId, payload) => {
  if (!ioInstance) return;
  ioInstance.to(`queue:${queueId}`).emit('queue:update', payload);
  ioInstance.to('admins').emit('admin:queue:update', payload);
  ioInstance.to(`display:${queueId}`).emit('display:update', payload);
};
