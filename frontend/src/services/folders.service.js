import api from './api';

export const foldersService = {
  listByProject: (projectId) => api.get(`/projects/${projectId}/folders`),
  create: (projectId, payload) => api.post(`/projects/${projectId}/folders`, payload),
  update: (id, payload) => api.put(`/folders/${id}`, payload),
  remove: (id) => api.delete(`/folders/${id}`)
};
