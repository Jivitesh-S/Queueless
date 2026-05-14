import { create } from 'zustand';
import { api } from '../utils/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('ql_user') || 'null'),
  token: localStorage.getItem('ql_token'),
  loading: false,
  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('ql_token', data.token);
      localStorage.setItem('ql_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  signup: async (payload) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/signup', payload);
      localStorage.setItem('ql_token', data.token);
      localStorage.setItem('ql_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('ql_token');
    localStorage.removeItem('ql_user');
    set({ user: null, token: null });
  }
}));
