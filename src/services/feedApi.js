import api from './api';

/** Fetch feed posts with optional filters */
export const getPosts = (params = {}) =>
  api.get('/posts', { params }).then((r) => r.data);

/** Create a new post */
export const createPost = (data) =>
  api.post('/posts', data).then((r) => r.data);

/** Delete a post by ID */
export const deletePostApi = (postId) =>
  api.delete(`/posts/${postId}`).then((r) => r.data);

/** Toggle like on a post */
export const toggleLikeApi = (postId) =>
  api.post(`/posts/${postId}/like`).then((r) => r.data);

/** Add a comment to a post */
export const addCommentApi = (postId, text) =>
  api.post(`/posts/${postId}/comment`, { text }).then((r) => r.data);

/** Get comments for a post */
export const getCommentsApi = (postId) =>
  api.get(`/posts/${postId}/comments`).then((r) => r.data);

/** Express interest in a project (request to join) */
export const requestJoinProject = (projectId, sourcePost = null) =>
  api.post(`/projects/${projectId}/request-join`, { sourcePost }).then((r) => r.data);
