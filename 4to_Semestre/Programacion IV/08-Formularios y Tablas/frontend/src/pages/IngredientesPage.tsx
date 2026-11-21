import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getIngredientes,
  createIngrediente,
  updateIngrediente,
  deleteIngrediente,
} from "../services/ingredientes"
import { Ingrediente, IngredienteCreate } from "../types/ingrediente"
import { IngredienteList } from "../components/ingredientes/IngredienteList"
import { IngredienteModal } from "../components/ingredientes/IngredienteModal"
import { LoadingState } from "../components/LoadingState"
import { EmptyState } from "../components/EmptyState"
import { ErrorState } from "../components/ErrorState"

export function IngredientesPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIngrediente, setSelectedIngrediente] = useState<Ingrediente | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    data: ingredientes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["ingredientes"],
    queryFn: getIngredientes,
  })

  const createMut = useMutation({
    mutationFn: createIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] })
      setIsModalOpen(false)
      setSelectedIngrediente(null)
      setServerError(null)
    },
    onError: (err: Error) => {
      setServerError(err.message)
    },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredienteCreate }) =>
      updateIngrediente(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] })
      setIsModalOpen(false)
      setSelectedIngrediente(null)
      setServerError(null)
    },
    onError: (err: Error) => {
      setServerError(err.message)
    },
  })

  const deleteMut = useMutation({
    mutationFn: deleteIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] })
    },
    onError: (err: Error) => {
      alert(err.message)
    },
  })

  const handleOpenCreate = () => {
    setSelectedIngrediente(null)
    setServerError(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (ingrediente: Ingrediente) => {
    setSelectedIngrediente(ingrediente)
    setServerError(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedIngrediente(null)
    setServerError(null)
  }

  const handleSubmit = async (values: IngredienteCreate) => {
    if (selectedIngrediente) {
      await updateMut.mutateAsync({ id: selectedIngrediente.id, data: values })
    } else {
      await createMut.mutateAsync(values)
    }
  }

  const handleDelete = (id: number) => {
    deleteMut.mutate(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Ingredientes
          </h1>
          <p className="text-sm text-slate-500">
            Administracion de la lista de ingredientes
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 shadow-sm transition"
        >
          + Añadir ingrediente
        </button>
      </div>

      {isLoading && <LoadingState message="Cargando ingredientes..." />}

      {isError && (
        <ErrorState
          message={(error as Error)?.message || "Error al cargar los ingredientes"}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && ingredientes.length === 0 && (
        <EmptyState
          title="No hay ingredientes cargados"
          description="Crea un ingrediente para personalizar tus recetas."
        />
      )}

      {!isLoading && !isError && ingredientes.length > 0 && (
        <IngredienteList
          data={ingredientes}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      <IngredienteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedIngrediente}
        serverError={serverError}
      />
    </div>
  )
}
