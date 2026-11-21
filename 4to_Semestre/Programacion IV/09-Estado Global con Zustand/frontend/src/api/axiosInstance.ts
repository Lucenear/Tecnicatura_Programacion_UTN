import axios from "axios"
import { useAuthStore } from "../store/authStore"

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || ""
      const isAuthRoute = url.includes("/auth/token") || url.includes("/auth/me")
      if (!isAuthRoute) {
        useAuthStore.getState().clearSession()
      }
    }
    return Promise.reject(error)
  }
)
