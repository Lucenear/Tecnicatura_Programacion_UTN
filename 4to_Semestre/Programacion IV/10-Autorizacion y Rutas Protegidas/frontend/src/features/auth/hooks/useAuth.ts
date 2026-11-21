import { useAuthStore } from "../store/authStore"

export function useAuth() {
  const {
    user,
    checking,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    checkSession,
    clearSession,
  } = useAuthStore()

  const isAuthenticated = Boolean(user)
  const isAdmin = Boolean(user?.roles.includes("admin"))

  return {
    user,
    checking,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    checkAuth,
    checkSession,
    clearSession,
  }
}
