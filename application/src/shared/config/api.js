import axios from "axios";

export const backendBaseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:8080";

export const createBackendApi = (options = {}) =>
  axios.create({
    baseURL: backendBaseUrl,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
