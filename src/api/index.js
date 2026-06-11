import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

export const partsApi = {
  getAll: () => api.get('/parts'),
  create: (data) => api.post('/parts', data),
  update: (id, data) => api.put(`/parts/${id}`, data),
  delete: (id) => api.delete(`/parts/${id}`),
};

export const billsApi = {
  getAll: () => api.get('/bills'),
  nextNumber: () => api.get('/bills/next-number'),
  save: (data) => api.post('/bills', data),
};

export const incomeApi = {
  getByDate: (date) => api.get('/income', { params: date ? { date } : {} }),
  create: (data) => api.post('/income', data),
  delete: (id) => api.delete(`/income/${id}`),
};

export const expensesApi = {
  getByDate: (date) => api.get('/expenses', { params: date ? { date } : {} }),
  create: (data) => api.post('/expenses', data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

export const summaryApi = {
  today: () => api.get('/summary/today'),
  byDate: (date) => api.get('/summary', { params: { date } }),
};
