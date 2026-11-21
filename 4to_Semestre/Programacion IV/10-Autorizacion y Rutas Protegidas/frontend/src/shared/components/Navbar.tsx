import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth"
import { useThemeStore } from "@/store/themeStore"
import { Sun, Moon } from "lucide-react"

export function Navbar() {
  const navigate = useNavigate()
  const { user, logout, isAdmin } = useAuth()
  const { darkMode, toggleTheme } = useThemeStore()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "px-3 py-2 rounded-md text-sm font-medium bg-slate-900 text-white dark:bg-slate-700 dark:text-white"
      : "px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink
            to={user ? "/categories" : "/login"}
            className="font-bold text-xl tracking-tight text-slate-900 dark:text-white"
          >
            Food Store
          </NavLink>
          {user && (
            <nav className="flex items-center space-x-2">
              <NavLink to="/categories" className={linkClass}>
                Categorias
              </NavLink>
              <NavLink to="/products" className={linkClass}>
                Productos
              </NavLink>
              <NavLink to="/ingredients" className={linkClass}>
                Ingredientes
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin/users" className={linkClass}>
                  Usuarios
                </NavLink>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            aria-label="Cambiar tema"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right text-xs">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {user.nombre} {user.apellido}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  {user.roles.join(", ")}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:text-red-300 dark:bg-red-950/50 dark:hover:bg-red-900/50 rounded-md transition"
              >
                Cerrar sesion
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <NavLink to="/login" className={linkClass}>
                Iniciar sesion
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Registrarse
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
