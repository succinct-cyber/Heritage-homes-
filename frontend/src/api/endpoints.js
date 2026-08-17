import apiClient from "./client";

// ---- Properties / Catalog ----
export const fetchProperties = (params = {}) =>
  apiClient.get("/properties/", { params }).then((r) => r.data);

export const fetchFeaturedProperties = () =>
  apiClient.get("/properties/featured/").then((r) => r.data);

export const fetchPropertyBySlug = (slug) =>
  apiClient.get(`/properties/${slug}/`).then((r) => r.data);

export const fetchSimilarProperties = (slug) =>
  apiClient.get(`/properties/${slug}/similar/`).then((r) => r.data);

// ---- Categories ----
export const fetchCategories = () =>
  apiClient.get("/properties/categories/").then((r) => r.data);

// ---- Team ----
export const fetchTeam = () =>
  apiClient.get("/team/").then((r) => r.data);

// ---- Inquiries ----
export const submitInquiry = (payload) =>
  apiClient.post("/inquiries/", payload).then((r) => r.data);

// ---- Newsletter ----
export const subscribeNewsletter = (email) =>
  apiClient.post("/newsletter/", { email }).then((r) => r.data);

// ---- Auth ----
export const login = (email, password) =>
  apiClient.post("/auth/login/", { username: email, password }).then((r) => r.data);

export const register = (fullName, email, password) =>
  apiClient
    .post("/auth/register/", { full_name: fullName, email, password })
    .then((r) => r.data);

export const fetchMe = () => apiClient.get("/auth/me/").then((r) => r.data);
