import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:3000/api';

export const api = axios.create({
  baseURL: API_URL.endsWith('/api') ? API_URL : `${API_URL.replace(/\/$/, '')}/api`,
  withCredentials: true,
});
