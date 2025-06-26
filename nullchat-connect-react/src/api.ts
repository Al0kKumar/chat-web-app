import axios from 'axios';

const API = axios.create({
  baseURL: 'https://chat-app-e527.onrender.com', 
  withCredentials: true,
});

export default API;
