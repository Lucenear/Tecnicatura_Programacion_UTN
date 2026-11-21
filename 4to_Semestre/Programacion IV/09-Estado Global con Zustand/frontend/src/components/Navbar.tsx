import { NavLink, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

export function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "px-3 py-2 rounded-md text-sm font-medium bg-slate-900 text-white"
      : "px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-200"

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const isAdmin = Boolean(user?.roles.includes("admin"))

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink to={user ? "/categories" : "/login"} className="font-bold text-xl tracking-tight text-slate-900">
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
              {isAdmin && (
                <NavLink to="/admin/users" className={linkClass}>
                  Usuarios
                </NavLink>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right text-xs">
                <p className="font-semibold text-slate-900">
                  {user.nombre} {user.apellido}
                </p>
                <p className="text-slate-500">
                  {user.roles.join(", ")}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition"
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
