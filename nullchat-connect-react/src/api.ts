import axios from 'axios';

const API = axios.create({
  baseURL: 'https://chat-web-app-6330.onrender.com/api/v1', 
  withCredentials: true,
});

export default API;
