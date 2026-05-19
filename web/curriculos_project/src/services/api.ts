import axios from 'axios';

const TOKEN_STORAGE_KEY = 'token';
const API_URL = import.meta.env.VITE_API_URL ?? 'http://192.168.71.130:3001/api';

export const api = axios.create({
  baseURL: API_URL.endsWith('/api') ? API_URL : `${API_URL.replace(/\/$/, '')}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { TOKEN_STORAGE_KEY };
