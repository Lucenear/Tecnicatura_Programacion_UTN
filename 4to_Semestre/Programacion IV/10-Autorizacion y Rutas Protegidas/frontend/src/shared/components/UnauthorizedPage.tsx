import { Link } from "react-router-dom"
import { ShieldAlert } from "lucide-react"

export function UnauthorizedPage() {
  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center shadow-sm">
      <div className="inline-flex p-3 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Acceso no autorizado
      </h1>
      <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm">
        No tienes los permisos requeridos para ingresar a esta seccion. Contacta al administrador si consideras que es un error.
      </p>
      <Link
        to="/categories"
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md transition"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
