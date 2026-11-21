import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, getErrorMessage } from "@/shared/api/api"
import { useNotificationStore } from "@/store/notificationStore"
import { Categoria, CategoriaCreate, CategoriaUpdate } from "../types/categoria"

export function useCategories() {
  const queryClient = useQueryClient()
  const { showNotification } = useNotificationStore()

  const {
    data: categorias = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: async (): Promise<Categoria[]> => {
      const res = await api.get<Categoria[]>("/categorias")
      return res.data
    },
  })

  const createMut = useMutation({
    mutationFn: async (data: CategoriaCreate): Promise<Categoria> => {
      const res = await api.post<Categoria>("/categorias", data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
      showNotification("Categoria creada con exito", "success")
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
      data: CategoriaUpdate
    }): Promise<Categoria> => {
      const res = await api.put<Categoria>(`/categorias/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
      showNotification("Categoria actualizada con exito", "success")
    },
    onError: (err) => {
      showNotification(getErrorMessage(err), "error")
    },
  })

  const deleteMut = useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`/categorias/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
      showNotification("Categoria eliminada con exito", "success")
    },
    onError: (err) => {
      showNotification(getErrorMessage(err), "error")
    },
  })

  return {
    categorias,
    isLoading,
    isError,
    error,
    refetch,
    createCategoria: createMut.mutateAsync,
    updateCategoria: updateMut.mutateAsync,
    deleteCategoria: deleteMut.mutate,
    isCreating: createMut.isPending,
    isUpdating: updateMut.isPending,
    isDeleting: deleteMut.isPending,
  }
}
