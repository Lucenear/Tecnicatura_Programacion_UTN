import { useAdminUsers } from "../hooks/useAdminUsers"
import { useAuth } from "../hooks/useAuth"
import { LoadingState } from "@/shared/components/LoadingState"
import { ErrorState } from "@/shared/components/ErrorState"
import { UsuarioAuth } from "../types/auth.types"

export function AdminUsersPage() {
  const { user } = useAuth()
  const {
    usuarios,
    isLoading,
    isError,
    error,
    refetch,
    toggleUsuarioEstado,
    isPending,
  } = useAdminUsers()

  const handleToggle = (u: UsuarioAuth) => {
    if (!u.deleted_at && user && u.id === user.id) {
      alert("No puedes desactivar tu propia cuenta en sesion")
      return
    }
    toggleUsuarioEstado(u)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Administracion de usuarios
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gestion de cuentas, roles y estados de acceso al sistema
        </p>
      </div>

      {isLoading && <LoadingState message="Cargando usuarios..." />}

      {isError && (
        <ErrorState
          message={(error as Error)?.message || "Error al cargar los usuarios"}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Celular</th>
                  <th className="px-6 py-3">Roles</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {usuarios.map((u) => {
                  const estaActivo = !u.deleted_at
                  const esPropioUsuario = Boolean(user && u.id === user.id)
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{u.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        {u.nombre} {u.apellido}
                      </td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{u.celular || "-"}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {u.roles.map((rol) => (
                            <span
                              key={rol}
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                rol === "admin"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                              }`}
                            >
                              {rol}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {estaActivo ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                            Desactivado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggle(u)}
                          disabled={isPending || (estaActivo && esPropioUsuario)}
                          title={estaActivo && esPropioUsuario ? "No puedes desactivar tu propia cuenta" : ""}
                          className={`px-3 py-1 text-xs font-medium rounded transition disabled:opacity-50 disabled:cursor-not-allowed ${
                            estaActivo
                              ? "text-red-700 bg-red-50 hover:bg-red-100 dark:text-red-300 dark:bg-red-950/40 dark:hover:bg-red-900/50"
                              : "text-green-700 bg-green-50 hover:bg-green-100 dark:text-green-300 dark:bg-green-950/40 dark:hover:bg-green-900/50"
                          }`}
                        >
                          {estaActivo ? "Desactivar" : "Activar"}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
