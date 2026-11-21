import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ThemeState {
  darkMode: boolean
  toggleTheme: () => void
}

const syncThemeClass = (isDark: boolean) => {
  if (typeof document !== "undefined") {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleTheme: () =>
        set((state) => {
          const next = !state.darkMode
          syncThemeClass(next)
          return { darkMode: next }
        }),
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          syncThemeClass(state.darkMode)
        }
      },
    }
  )
)
