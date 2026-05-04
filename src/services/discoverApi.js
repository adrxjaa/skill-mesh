import api from './api';

export const getTopMatches = (n = 3) =>
  api.get(`/discover/top?n=${n}`).then(r => r.data);

export const searchPeople = (q, n = 10) =>
  api.get(`/discover/search?q=${encodeURIComponent(q)}&n=${n}`).then(r => r.data);

export const embedSelf = () =>
  api.post('/discover/embed-self').then(r => r.data);

export const getSuggestedTags = () =>
  api.get('/discover/suggest-tags').then(r => r.data);
