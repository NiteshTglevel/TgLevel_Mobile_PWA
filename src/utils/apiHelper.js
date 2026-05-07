import axios from 'axios';

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://13.201.61.128:5000/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://tglevel-app.duckdns.org/api";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Bearer Token automatically lagane ke liye interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);