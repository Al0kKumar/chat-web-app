import axios from 'axios';

const API = axios.create({
  baseURL: 'https://chat-app-e527.onrender.com/api/v1', 
  withCredentials: true,
});

export default API;
