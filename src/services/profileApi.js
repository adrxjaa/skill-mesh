import api from "./api";

export const getMyProfile = () => api.get("/profile/me").then((r) => r.data);

export const updateMyProfile = (fields) =>
  api.patch("/profile/me", fields).then((r) => r.data);

export const getUserProfile = (id) =>
  api.get(`/profile/${id}`).then((r) => r.data);

export const getReviews = (id) =>
  api.get(`/profile/${id}/reviews`).then((r) => r.data);

export const submitReview = (id, { rating, text }) =>
  api.post(`/profile/${id}/review`, { rating, text }).then((r) => r.data);

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.url; // "/uploads/<filename>"
};
