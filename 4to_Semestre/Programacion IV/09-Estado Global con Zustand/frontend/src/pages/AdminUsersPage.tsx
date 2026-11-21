import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../api/axiosInstance"
import { UsuarioAuth } from "../types/auth.types"
import { LoadingState } from "../components/LoadingState"
import { ErrorState } from "../components/ErrorState"
import { getErrorMessage } from "../services/api"

export function AdminUsersPage() {
  const queryClient = useQueryClient()

  const {
    data: usuarios = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await axiosInstance.get<UsuarioAuth[]>("/auth/admin/usuarios")
      return res.data
    },
  })

  const activarMut = useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.post(`/auth/admin/usuarios/${id}/activar`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
    },
    onError: (err) => {
      alert(getErrorMessage(err))
    },
  })

  const desactivarMut = useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.post(`/auth/admin/usuarios/${id}/desactivar`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
    },
    onError: (err) => {
      alert(getErrorMessage(err))
    },
  })

  const handleToggleEstado = (usuario: UsuarioAuth) => {
    if (usuario.deleted_at) {
      activarMut.mutate(usuario.id)
    } else {
      if (window.confirm(`Esta seguro de desactivar al usuario ${usuario.email}?`)) {
        desactivarMut.mutate(usuario.id)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Administracion de usuarios
        </h1>
        <p className="text-sm text-slate-500">
          Gestion de cuentas, roles y estados de acceso al sistema
        </p>
      </div>

      {isLoading && <LoadingState message="Cargando usuarios..." />}

      {isError && (
        <ErrorState
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
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
              <tbody className="divide-y divide-slate-200">
                {usuarios.map((u) => {
                  const estaActivo = !u.deleted_at
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{u.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {u.nombre} {u.apellido}
                      </td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4 text-slate-500">{u.celular || "-"}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {u.roles.map((rol) => (
                            <span
                              key={rol}
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                rol === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {rol}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {estaActivo ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Desactivado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleEstado(u)}
                          disabled={activarMut.isPending || desactivarMut.isPending}
                          className={`px-3 py-1 text-xs font-medium rounded transition ${
                            estaActivo
                              ? "text-red-700 bg-red-50 hover:bg-red-100"
                              : "text-green-700 bg-green-50 hover:bg-green-100"
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
