import { create } from "zustand"
import { persist } from "zustand/middleware"
import { axiosInstance } from "../api/axiosInstance"
import { UsuarioAuth } from "../types/auth.types"

interface AuthState {
  user: UsuarioAuth | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      login: async (email: string, password: string) => {
        const params = new URLSearchParams()
        params.append("username", email)
        params.append("password", password)

        await axiosInstance.post("/auth/token", params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })

        const res = await axiosInstance.get<UsuarioAuth>("/auth/me")
        set({ user: res.data })
      },
      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout")
        } finally {
          set({ user: null })
        }
      },
      checkSession: async () => {
        set({ isLoading: true })
        try {
          const res = await axiosInstance.get<UsuarioAuth>("/auth/me")
          set({ user: res.data, isLoading: false })
        } catch {
          set({ user: null, isLoading: false })
        }
      },
      clearSession: () => {
        set({ user: null })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
)
