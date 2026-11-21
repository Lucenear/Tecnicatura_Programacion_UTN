import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/categorias"
import { Categoria, CategoriaCreate } from "../types/categoria"
import { CategoriaList } from "../components/categorias/CategoriaList"
import { CategoriaModal } from "../components/categorias/CategoriaModal"
import { LoadingState } from "../components/LoadingState"
import { EmptyState } from "../components/EmptyState"
import { ErrorState } from "../components/ErrorState"
import { useAuthStore } from "../store/authStore"

export function CategoriesPage() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const isAdmin = Boolean(user?.roles.includes("admin"))

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    data: categorias = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  })

  const createMut = useMutation({
    mutationFn: createCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
      setIsModalOpen(false)
      setSelectedCategoria(null)
      setServerError(null)
    },
    onError: (err: Error) => {
      setServerError(err.message)
    },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaCreate }) =>
      updateCategoria(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
      setIsModalOpen(false)
      setSelectedCategoria(null)
      setServerError(null)
    },
    onError: (err: Error) => {
      setServerError(err.message)
    },
  })

  const deleteMut = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
    },
    onError: (err: Error) => {
      alert(err.message)
    },
  })

  const handleOpenCreate = () => {
    setSelectedCategoria(null)
    setServerError(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (categoria: Categoria) => {
    setSelectedCategoria(categoria)
    setServerError(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCategoria(null)
    setServerError(null)
  }

  const handleSubmit = async (values: CategoriaCreate) => {
    if (selectedCategoria) {
      await updateMut.mutateAsync({ id: selectedCategoria.id, data: values })
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
            Categorias
          </h1>
          <p className="text-sm text-slate-500">
            Administracion del catalogo de categorias
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 shadow-sm transition"
          >
            + Añadir categoria
          </button>
        )}
      </div>

      {isLoading && <LoadingState message="Cargando categorias..." />}

      {isError && (
        <ErrorState
          message={(error as Error)?.message || "Error al cargar las categorias"}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && categorias.length === 0 && (
        <EmptyState
          title="No hay categorias cargadas"
          description="Crea una categoria para comenzar a organizar tus productos."
        />
      )}

      {!isLoading && !isError && categorias.length > 0 && (
        <CategoriaList
          data={categorias}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          isAdmin={isAdmin}
        />
      )}

      {isAdmin && (
        <CategoriaModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={selectedCategoria}
          serverError={serverError}
        />
      )}
    </div>
  )
}
