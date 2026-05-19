import axios from 'axios';

const TOKEN_STORAGE_KEY = 'token';

export const api = axios.create({
  baseURL: 'http://192.168.71.130:3001',
});
console.log(import.meta.env.VITE_API_URL)

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { TOKEN_STORAGE_KEY };
