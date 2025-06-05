import axios from 'axios';
import { getToken } from './utils/storage';
import { BASE_URL } from './src/constants'; 


const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 5000,
});

// 👉 Her istekten önce token eklemek için interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
