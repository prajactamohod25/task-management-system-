import axios from 'axios';

const API_BASE_URL = 'https://task-management-backend-e73f.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getTasks = () => api.get('/tasks').then((response) => response.data);

export const createTask = (task) => api.post('/tasks', task).then((response) => response.data);

export const moveTask = (id, status) =>
  api.put(`/tasks/${id}/move`, { status }).then((response) => response.data);

export const getApiErrorMessage = (error) =>
  error?.response?.data?.error ||
  error?.response?.data?.message ||
  error?.message ||
  'Something went wrong';
