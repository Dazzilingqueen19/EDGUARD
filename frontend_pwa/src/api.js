import axios from 'axios';
const BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';
const API_KEY = import.meta.env.VITE_API_KEY || 'devkey';

export async function fetchLogs(){
  const res = await axios.get(`${BASE}/api/logs`, { headers: { 'X-API-KEY': API_KEY }});
  return res.data;
}

export async function postChat(text){
  return axios.post(`${BASE}/api/chat`, { text }, { headers: { 'X-API-KEY': API_KEY }});
}
