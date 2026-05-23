import axios from 'axios';

const TOKEN_STORAGE_KEY = 'token';
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';
const PUBLIC_ROUTES = ['/login', '/login/register', '/login/forgot-password', '/login/reset-password'];

export const api = axios.create({
  baseURL: API_URL.endsWith('/api') ? API_URL : `${API_URL.replace(/\/$/, '')}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const isPublicRoute = PUBLIC_ROUTES.some((route) => config.url === route);

  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { TOKEN_STORAGE_KEY };
