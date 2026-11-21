import { create } from "zustand"
import { api } from "@/shared/api/api"
import { UsuarioAuth, RegisterData } from "../types/auth.types"

interface AuthState {
  user: UsuarioAuth | null
  checking: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  checkSession: () => Promise<void>
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  checking: true,
  isLoading: true,
  login: async (email: string, password: string) => {
    const params = new URLSearchParams()
    params.append("username", email)
    params.append("password", password)

    await api.post("/auth/token", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    const res = await api.get<UsuarioAuth>("/auth/me")
    set({ user: res.data, checking: false, isLoading: false })
  },
  register: async (data: RegisterData) => {
    await api.post("/auth/register", data)
  },
  logout: async () => {
    try {
      await api.post("/auth/logout")
    } finally {
      set({ user: null, checking: false, isLoading: false })
    }
  },
  checkAuth: async () => {
    set({ checking: true, isLoading: true })
    try {
      const res = await api.get<UsuarioAuth>("/auth/me")
      set({ user: res.data, checking: false, isLoading: false })
    } catch {
      set({ user: null, checking: false, isLoading: false })
    }
  },
  checkSession: async () => {
    set({ checking: true, isLoading: true })
    try {
      const res = await api.get<UsuarioAuth>("/auth/me")
      set({ user: res.data, checking: false, isLoading: false })
    } catch {
      set({ user: null, checking: false, isLoading: false })
    }
  },
  clearSession: () => {
    set({ user: null, checking: false, isLoading: false })
  },
}))
