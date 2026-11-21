import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, getErrorMessage } from "@/shared/api/api"
import { useNotificationStore } from "@/store/notificationStore"
import { Ingredient, IngredientCreate, IngredientUpdate } from "../types/ingredient"

export function useIngredients() {
  const queryClient = useQueryClient()
  const { showNotification } = useNotificationStore()

  const {
    data: ingredients = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["ingredients"],
    queryFn: async (): Promise<Ingredient[]> => {
      const res = await api.get<Ingredient[]>("/ingredientes")
      return res.data
    },
  })

  const createMut = useMutation({
    mutationFn: async (data: IngredientCreate): Promise<Ingredient> => {
      const res = await api.post<Ingredient>("/ingredientes", data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] })
      showNotification("Ingrediente creado con exito", "success")
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
      data: IngredientUpdate
    }): Promise<Ingredient> => {
      const res = await api.put<Ingredient>(`/ingredientes/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] })
      showNotification("Ingrediente actualizado con exito", "success")
    },
    onError: (err) => {
      showNotification(getErrorMessage(err), "error")
    },
  })

  const deleteMut = useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`/ingredientes/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] })
      showNotification("Ingrediente eliminado con exito", "success")
    },
    onError: (err) => {
      showNotification(getErrorMessage(err), "error")
    },
  })

  return {
    ingredients,
    ingredientes: ingredients,
    isLoading,
    isError,
    error,
    refetch,
    createIngredient: createMut.mutateAsync,
    updateIngredient: updateMut.mutateAsync,
    deleteIngredient: deleteMut.mutate,
    isCreating: createMut.isPending,
    isUpdating: updateMut.isPending,
    isDeleting: deleteMut.isPending,
  }
}
