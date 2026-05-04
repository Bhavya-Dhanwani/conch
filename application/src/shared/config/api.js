import axios from "axios";

const configuredBackendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "";

const isLocalBackendUrl = (value = "") => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(value);

const getBrowserBackendBaseUrl = () => {
  if (typeof window === "undefined") return configuredBackendUrl || "http://localhost:8080";

  const isLocalPage = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  if (configuredBackendUrl && (!isLocalBackendUrl(configuredBackendUrl) || isLocalPage)) {
    return configuredBackendUrl.replace(/\/$/, "");
  }

  return window.location.origin;
};

export const backendBaseUrl = getBrowserBackendBaseUrl();

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
