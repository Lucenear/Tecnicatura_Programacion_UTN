import { api } from "./api"
import { useAuthStore } from "@/features/auth"
import { useNotificationStore } from "@/store/notificationStore"

export function setupInterceptors() {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status
      const url = error.config?.url || ""
      const isAuthRoute = url.includes("/auth/token") || url.includes("/auth/me")

      if (status === 401 && !isAuthRoute) {
        useAuthStore.getState().clearSession()
      } else if (status === 403) {
        useNotificationStore.getState().showNotification("Acceso denegado", "error")
      }

      return Promise.reject(error)
    }
  )
}

setupInterceptors()

export default setupInterceptors
