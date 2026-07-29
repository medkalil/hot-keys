import axios from 'axios';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const operatorsAPI = {
  create: (callsign: string, passcode: string) =>
    client.post('/api/operators', { callsign, passcode }),
  
  get: (id: string) =>
    client.get(`/api/operators/${id}`),
  
  verify: (id: string, passcode: string) =>
    client.post(`/api/operators/${id}/verify`, { passcode }),
};

export const gamesAPI = {
  submit: (data: {
    operator_id: string;
    level: number;
    wpm: number;
    accuracy: number;
    score: number;
    word_id: number;
  }) =>
    client.post('/api/games', data),
  
  getHistory: (operator_id: string, limit = 50, offset = 0) =>
    client.get(`/api/games/operator/${operator_id}`, {
      params: { limit, offset },
    }),
  
  getStats: (operator_id: string) =>
    client.get(`/api/games/operator/${operator_id}/stats`),
};

export const leaderboardAPI = {
  get: (page = 1, limit = 50) =>
    client.get('/api/leaderboard', {
      params: { page, limit },
    }),
  
  getRank: (operator_id: string) =>
    client.get(`/api/leaderboard/rank/${operator_id}`),
};

export const levelsAPI = {
  get: (level: number, operator_id: string) =>
    client.get(`/api/levels/${level}`, { params: { operator_id } }),
  
  getLevelInfo: (level: number, operator_id: string) =>
    client.get(`/api/levels/${level}/info`, { params: { operator_id } }),
};

export default client;
