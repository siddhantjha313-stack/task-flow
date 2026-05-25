const API_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "taskflow_token";

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

export async function apiRequest(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    const message = payload.message || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.errors = payload.errors || [];
    throw error;
  }

  return payload.data;
}

export const authApi = {
  signup: (body) => apiRequest("/auth/signup", { method: "POST", body }),
  login: (body) => apiRequest("/auth/login", { method: "POST", body }),
  me: () => apiRequest("/auth/me"),
  updateMe: (body) => apiRequest("/auth/me", { method: "PATCH", body })
};

export const projectApi = {
  dashboard: () => apiRequest("/projects/dashboard"),
  list: (params = {}) => apiRequest(`/projects${toQuery(params)}`),
  get: (id) => apiRequest(`/projects/${id}`),
  create: (body) => apiRequest("/projects", { method: "POST", body }),
  update: (id, body) => apiRequest(`/projects/${id}`, { method: "PATCH", body }),
  delete: (id) => apiRequest(`/projects/${id}`, { method: "DELETE" })
};

export const taskApi = {
  list: (params = {}) => apiRequest(`/tasks${toQuery(params)}`),
  get: (id) => apiRequest(`/tasks/${id}`),
  create: (body) => apiRequest("/tasks", { method: "POST", body }),
  update: (id, body) => apiRequest(`/tasks/${id}`, { method: "PATCH", body }),
  delete: (id) => apiRequest(`/tasks/${id}`, { method: "DELETE" }),
  comment: (id, message) => apiRequest(`/tasks/${id}/comments`, { method: "POST", body: { message } })
};

export const userApi = {
  list: () => apiRequest("/users"),
  invite: (body) => apiRequest("/users/invite", { method: "POST", body }),
  update: (id, body) => apiRequest(`/users/${id}`, { method: "PATCH", body }),
  delete: (id) => apiRequest(`/users/${id}`, { method: "DELETE" })
};

export const activityApi = {
  list: (limit = 30) => apiRequest(`/activity?limit=${limit}`)
};

const toQuery = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      query.set(key, value);
    }
  });

  const text = query.toString();
  return text ? `?${text}` : "";
};
