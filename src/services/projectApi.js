import api from "./api";

export const getMyProjects = () => api.get("/projects").then((r) => r.data);

export const getMyInvites = () => api.get("/projects/invites").then((r) => r.data);

export const createProject = ({ title, description }) =>
  api.post("/projects", { title, description }).then((r) => r.data);

export const inviteToProject = (projectId, { targetUserId, sourcePost }) =>
  api
    .post(`/projects/${projectId}/invite`, { targetUserId, sourcePost })
    .then((r) => r.data);

export const respondToInvite = (projectId, action) =>
  api.post(`/projects/${projectId}/respond`, { action }).then((r) => r.data);

export const respondToRequest = (projectId, userId, action) =>
  api.post(`/projects/${projectId}/requests/${userId}/respond`, { action }).then((r) => r.data);
