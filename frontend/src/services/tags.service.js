import api from './api';

export const tagsService = {
  list: () => api.get('/tags'),
  search: (q) => api.get('/tags/search', { params: { q } })
};
