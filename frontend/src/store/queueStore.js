import { create } from 'zustand';
import { api } from '../utils/api';

export const useQueueStore = create((set, get) => ({
  queues: [],
  departments: [],
  activeSnapshot: null,
  overview: null,
  analytics: null,
  loading: false,
  fetchQueues: async () => {
    set({ loading: true });
    const [{ data: queueData }, { data: overview }] = await Promise.all([
      api.get('/queues'),
      api.get('/analytics/overview')
    ]);
    set({ queues: queueData.queues, overview, loading: false });
  },
  fetchDepartments: async () => {
    const { data } = await api.get('/queues/departments');
    set({ departments: data.departments });
  },
  fetchSnapshot: async (queueId) => {
    const { data } = await api.get(`/queues/${queueId}`);
    set({ activeSnapshot: data });
  },
  applySnapshot: (snapshot) => {
    const queues = get().queues.map((queue) => (queue._id === snapshot.queue._id ? snapshot.queue : queue));
    set({ activeSnapshot: snapshot, queues });
  },
  createQueue: async (payload) => {
    const { data } = await api.post('/queues', payload);
    set({ queues: [data.queue, ...get().queues] });
  },
  joinQueue: async (payload) => {
    const { data } = await api.post('/tokens/join', payload);
    return data.token;
  },
  nextToken: async (queueId) => api.post(`/tokens/${queueId}/next`),
  setStatus: async (queueId, tokenId, status) => api.patch(`/tokens/${queueId}/${tokenId}/status`, { status }),
  recall: async (queueId, tokenId) => api.post(`/tokens/${queueId}/${tokenId}/recall`),
  notifyToken: async (queueId, tokenId, payload) => api.post(`/tokens/${queueId}/${tokenId}/notify`, payload),
  fetchAnalytics: async (queueId) => {
    const { data } = await api.get(`/analytics/queues/${queueId}`);
    set({ analytics: data });
  }
}));
