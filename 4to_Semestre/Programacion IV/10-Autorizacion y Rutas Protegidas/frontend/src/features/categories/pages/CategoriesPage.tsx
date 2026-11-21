import { useState } from "react"
import { useCategories } from "../hooks/useCategories"
import { useAuth } from "@/features/auth"
import { Categoria, CategoriaCreate } from "../types/categoria"
import { CategoriaList } from "../components/CategoriaList"
import { CategoriaModal } from "../components/CategoriaModal"
import { LoadingState } from "@/shared/components/LoadingState"
import { EmptyState } from "@/shared/components/EmptyState"
import { ErrorState } from "@/shared/components/ErrorState"

export function CategoriesPage() {
  const { isAdmin } = useAuth()
  const {
    categorias,
    isLoading,
    isError,
    error,
    refetch,
    createCategoria,
    updateCategoria,
    deleteCategoria,
  } = useCategories()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

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
    try {
      if (selectedCategoria) {
        await updateCategoria({ id: selectedCategoria.id, data: values })
      } else {
        await createCategoria(values)
      }
      setIsModalOpen(false)
      setSelectedCategoria(null)
      setServerError(null)
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message)
      }
    }
  }

  const handleDelete = (id: number) => {
    deleteCategoria(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Categorias
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Administracion del catalogo de categorias
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md shadow-sm transition"
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
