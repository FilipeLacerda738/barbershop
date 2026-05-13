import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333/api',
});

if(import.meta.env.DEV){
  api.interceptors.request.use((request) => {
    console.log(`[REQ] ${request.method.toUpperCase()} ${request.url}`);
    return request;
  });


  api.interceptors.response.use((response) => {
    console.log(`[RES] ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`[ERR] ${error.config?.url} | Status: ${error.response?.status}`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);
}