import { useState } from "react"
import { useProducts } from "../hooks/useProducts"
import { useCategories } from "@/features/categories"
import { useAuth } from "@/features/auth"
import { Producto, ProductoCreate } from "../types/producto"
import { ProductList } from "../components/ProductList"
import { ProductModal } from "../components/ProductModal"
import { LoadingState } from "@/shared/components/LoadingState"
import { EmptyState } from "@/shared/components/EmptyState"
import { ErrorState } from "@/shared/components/ErrorState"

export function ProductsPage() {
  const { isAdmin } = useAuth()
  const {
    productos,
    isLoading,
    isError,
    error,
    refetch,
    createProducto,
    updateProducto,
    deleteProducto,
  } = useProducts()
  const { categorias } = useCategories()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const handleOpenCreate = () => {
    setSelectedProducto(null)
    setServerError(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (producto: Producto) => {
    setSelectedProducto(producto)
    setServerError(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProducto(null)
    setServerError(null)
  }

  const handleSubmit = async (values: ProductoCreate) => {
    try {
      if (selectedProducto) {
        await updateProducto({ id: selectedProducto.id, data: values })
      } else {
        await createProducto(values)
      }
      setIsModalOpen(false)
      setSelectedProducto(null)
      setServerError(null)
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message)
      }
    }
  }

  const handleDelete = (id: number) => {
    deleteProducto(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Productos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Administracion del catalogo de productos
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md shadow-sm transition"
          >
            + Añadir producto
          </button>
        )}
      </div>

      {isLoading && <LoadingState message="Cargando productos..." />}

      {isError && (
        <ErrorState
          message={(error as Error)?.message || "Error al cargar los productos"}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && productos.length === 0 && (
        <EmptyState
          title="No hay productos cargados"
          description="Crea un producto para comenzar a vender en tu tienda."
        />
      )}

      {!isLoading && !isError && productos.length > 0 && (
        <ProductList
          data={productos}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          isAdmin={isAdmin}
          categorias={categorias}
        />
      )}

      {isAdmin && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={selectedProducto}
          categorias={categorias}
          serverError={serverError}
        />
      )}
    </div>
  )
}
