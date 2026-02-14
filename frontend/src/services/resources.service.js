import api from './api';

export const resourcesService = {
  list: (params) => api.get('/resources', { params }),
  create: (payload) => api.post('/resources', payload),
  getById: (id) => api.get(`/resources/${id}`),
  update: (id, payload) => api.put(`/resources/${id}`, payload),
  remove: (id) => api.delete(`/resources/${id}`),
  toggleStar: (id) => api.patch(`/resources/${id}/star`),
  uploadFile: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/resources/${id}/file`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  downloadFile: (id) => api.get(`/resources/${id}/file`, { responseType: 'blob' })
};
