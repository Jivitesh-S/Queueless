import { useEffect, useMemo } from 'react';
import { createSocket } from '../utils/socket';

export const useQueueSocket = (queueId, onSnapshot, mode = 'queue') => {
  const socket = useMemo(() => createSocket(), []);

  useEffect(() => {
    if (!queueId) return undefined;
    const event = mode === 'display' ? 'display:join' : 'queue:join';
    const update = mode === 'display' ? 'display:update' : 'queue:update';
    socket.emit(event, queueId);
    socket.on(update, onSnapshot);
    return () => {
      socket.off(update, onSnapshot);
      socket.emit('queue:leave', queueId);
    };
  }, [mode, onSnapshot, queueId, socket]);
};
