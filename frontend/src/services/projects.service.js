import api from './api';

export const projectsService = {
  list: () => api.get('/projects'),
  create: (payload) => api.post('/projects', payload),
  getById: (id) => api.get(`/projects/${id}`),
  update: (id, payload) => api.put(`/projects/${id}`, payload),
  remove: (id) => api.delete(`/projects/${id}`)
};
