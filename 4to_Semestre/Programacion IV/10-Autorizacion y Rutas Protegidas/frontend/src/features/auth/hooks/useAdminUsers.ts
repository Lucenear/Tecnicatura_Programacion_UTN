import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, getErrorMessage } from "@/shared/api/api"
import { useNotificationStore } from "@/store/notificationStore"
import { UsuarioAuth } from "../types/auth.types"

export function useAdminUsers() {
  const queryClient = useQueryClient()
  const { showNotification } = useNotificationStore()

  const {
    data: usuarios = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.get<UsuarioAuth[]>("/auth/admin/usuarios")
      return res.data
    },
  })

  const activarMut = useMutation({
    mutationFn: async (id: number) => {
      await api.post(`/auth/admin/usuarios/${id}/activar`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      showNotification("Usuario activado con exito", "success")
    },
    onError: (err) => {
      showNotification(getErrorMessage(err), "error")
    },
  })

  const desactivarMut = useMutation({
    mutationFn: async (id: number) => {
      await api.post(`/auth/admin/usuarios/${id}/desactivar`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      showNotification("Usuario desactivado con exito", "success")
    },
    onError: (err) => {
      showNotification(getErrorMessage(err), "error")
    },
  })

  const toggleUsuarioEstado = (usuario: UsuarioAuth) => {
    if (usuario.deleted_at) {
      activarMut.mutate(usuario.id)
    } else {
      if (window.confirm(`Esta seguro de desactivar al usuario ${usuario.email}?`)) {
        desactivarMut.mutate(usuario.id)
      }
    }
  }

  return {
    usuarios,
    isLoading,
    isError,
    error,
    refetch,
    toggleUsuarioEstado,
    isPending: activarMut.isPending || desactivarMut.isPending,
  }
}
