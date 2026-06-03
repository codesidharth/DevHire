import axios from 'axios';

const API = axios.create({
  // Your live Hugging Face API base URL configuration string here
  baseURL: 'https://your-huggingface-space-url.hf.space/api/v1',
});

// 🎯 DYNAMIC INTERCEPTOR: Injects token into every single network transit block
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;