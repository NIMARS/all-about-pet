import axios from 'axios';
import { setAuthData, getToken, logout } from '../shared/auth/index';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let isRefreshing = false;
let pending = [];

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error;
    if (response?.status !== 401 || config._retry) {
      return Promise.reject(error);
    }

    // only 1 try to refrash for every connection :3
    if (isRefreshing) {
      return new Promise((resolve, reject) => pending.push({ resolve, reject }));
    }

    try {
      isRefreshing = true;
      config._retry = true;

      // call endpoint (refresh cookie in browser)
      await API.post('/auth/refresh'); // new accessToken in body

      pending.forEach(p => p.resolve());
      pending = [];

      // repeating
      return API(config);
    } catch (e) {
      pending.forEach(p => p.reject(e));
      pending = [];

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);

API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  refresh: () => API.post('/auth/refresh'),
  logout: () => API.post('/auth/logout'),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
};



export async function loginUser(data) {
  const res = await authAPI.login(data);
  const payload = res.data ?? {};

  const token = payload.accessToken || payload.token || payload.access_token || (payload.data && payload.data.accessToken);
  const user = payload.user || payload.data?.user || null;

  if (token) {
    try { localStorage.setItem('token', token) } catch { }
  }
  if (user) {
    try { localStorage.setItem('user', JSON.stringify(user)) } catch { }
  }

  try {
    const me = await authAPI.getProfile();
    if (me.data) localStorage.setItem('user', JSON.stringify(me.data));
  } catch { }

  return payload;
}

export async function registerUser({ email, password, name }) {
  const res = await authAPI.register({ email, password, name });

  const data = res?.data ?? {};
  const token = data.accessToken ?? data.token ?? data.data?.accessToken ?? null;
  const user = data.user ?? data.data?.user ?? null;

  if (token) {
    localStorage.setItem('token', token);
  }
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  return { data, token, user };
}


export const petsAPI = {
  getAll: () => API.get('/pets'),
  getById: (id) => API.get(`/pets/${id}`),
  create: (data) => API.post('/pets', data),
  update: (id, data) => API.put(`/pets/${id}`, data),
  delete: (id) => API.delete(`/pets/${id}`),
};

export const eventsAPI = {
  getAll: () => API.get('/events'),
  getById: (id) => API.get(`/events/${id}`),
  create: (data) => API.post('/events', data),
  update: (id, data) => API.put(`/events/${id}`, data),
  delete: (id) => API.delete(`/events/${id}`),
};

export const documentsAPI = {
  listByPet: (petId) => API.get(`/documents/${petId}`),
  upload: (petId, formData) => API.post(`/documents/${petId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => API.delete(`/documents/${id}`),
};


export default API; 