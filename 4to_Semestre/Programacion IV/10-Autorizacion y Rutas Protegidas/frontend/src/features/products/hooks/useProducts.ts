import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, getErrorMessage } from "@/shared/api/api"
import { useNotificationStore } from "@/store/notificationStore"
import { Producto, ProductoCreate, ProductoUpdate } from "../types/producto"

export function useProducts() {
  const queryClient = useQueryClient()
  const { showNotification } = useNotificationStore()

  const {
    data: productos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["productos"],
    queryFn: async (): Promise<Producto[]> => {
      const res = await api.get<Producto[]>("/productos")
      return res.data
    },
  })

  const createMut = useMutation({
    mutationFn: async (data: ProductoCreate): Promise<Producto> => {
      const res = await api.post<Producto>("/productos", data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
      showNotification("Producto creado con exito", "success")
    },
    onError: (err) => {
      showNotification(getErrorMessage(err), "error")
    },
  })

  const updateMut = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: ProductoUpdate
    }): Promise<Producto> => {
      const res = await api.put<Producto>(`/productos/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
      showNotification("Producto actualizado con exito", "success")
    },
    onError: (err) => {
      showNotification(getErrorMessage(err), "error")
    },
  })

  const deleteMut = useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`/productos/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
      showNotification("Producto eliminado con exito", "success")
    },
    onError: (err) => {
      showNotification(getErrorMessage(err), "error")
    },
  })

  return {
    productos,
    isLoading,
    isError,
    error,
    refetch,
    createProducto: createMut.mutateAsync,
    updateProducto: updateMut.mutateAsync,
    deleteProducto: deleteMut.mutate,
    isCreating: createMut.isPending,
    isUpdating: updateMut.isPending,
    isDeleting: deleteMut.isPending,
  }
}
