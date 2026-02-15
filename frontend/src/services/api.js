import axios from 'axios';

const fallbackApiUrl =
  typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:4000/api`
    : 'http://localhost:4000/api';

const configuredApiUrl = import.meta.env.VITE_API_URL;
const normalizedApiUrl =
  typeof window !== 'undefined' && configuredApiUrl
    ? configuredApiUrl.replace(/https?:\/\/(127\.0\.0\.1|localhost)(?=:\d+\/)/, `${window.location.protocol}//${window.location.hostname}`)
    : configuredApiUrl;

const api = axios.create({
  baseURL: normalizedApiUrl || fallbackApiUrl,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
