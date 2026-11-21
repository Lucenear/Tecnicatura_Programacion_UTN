import { useState } from "react"
import { useIngredients } from "../hooks/useIngredients"
import { useAuth } from "@/features/auth"
import { Ingredient, IngredientCreate } from "../types/ingredient"
import { IngredientList } from "../components/IngredientList"
import { IngredientModal } from "../components/IngredientModal"
import { LoadingState } from "@/shared/components/LoadingState"
import { EmptyState } from "@/shared/components/EmptyState"
import { ErrorState } from "@/shared/components/ErrorState"

export function IngredientsPage() {
  const { isAdmin } = useAuth()
  const {
    ingredients,
    isLoading,
    isError,
    error,
    refetch,
    createIngredient,
    updateIngredient,
    deleteIngredient,
  } = useIngredients()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const handleOpenCreate = () => {
    setSelectedIngredient(null)
    setServerError(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient)
    setServerError(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedIngredient(null)
    setServerError(null)
  }

  const handleSubmit = async (values: IngredientCreate) => {
    try {
      if (selectedIngredient) {
        await updateIngredient({ id: selectedIngredient.id, data: values })
      } else {
        await createIngredient(values)
      }
      setIsModalOpen(false)
      setSelectedIngredient(null)
      setServerError(null)
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message)
      }
    }
  }

  const handleDelete = (id: number) => {
    deleteIngredient(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Ingredientes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Administracion del inventario de materias primas
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md shadow-sm transition"
          >
            + Añadir ingrediente
          </button>
        )}
      </div>

      {isLoading && <LoadingState message="Cargando ingredientes..." />}

      {isError && (
        <ErrorState
          message={(error as Error)?.message || "Error al cargar los ingredientes"}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && ingredients.length === 0 && (
        <EmptyState
          title="No hay ingredientes cargados"
          description="Añade ingredientes para gestionar tus recetas y costos."
        />
      )}

      {!isLoading && !isError && ingredients.length > 0 && (
        <IngredientList
          data={ingredients}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          isAdmin={isAdmin}
        />
      )}

      {isAdmin && (
        <IngredientModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={selectedIngredient}
          serverError={serverError}
        />
      )}
    </div>
  )
}
