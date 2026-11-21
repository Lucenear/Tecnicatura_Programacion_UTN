import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../services/productos"
import { getCategorias } from "../services/categorias"
import { Producto, ProductoCreate } from "../types/producto"
import { ProductList } from "../components/productos/ProductList"
import { ProductModal } from "../components/productos/ProductModal"
import { LoadingState } from "../components/LoadingState"
import { EmptyState } from "../components/EmptyState"
import { ErrorState } from "../components/ErrorState"

export function ProductsPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    data: productos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
  })

  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  })

  const createMut = useMutation({
    mutationFn: createProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
      setIsModalOpen(false)
      setSelectedProducto(null)
      setServerError(null)
    },
    onError: (err: Error) => {
      setServerError(err.message)
    },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductoCreate }) =>
      updateProducto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
      setIsModalOpen(false)
      setSelectedProducto(null)
      setServerError(null)
    },
    onError: (err: Error) => {
      setServerError(err.message)
    },
  })

  const deleteMut = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
    },
    onError: (err: Error) => {
      alert(err.message)
    },
  })

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
    if (selectedProducto) {
      await updateMut.mutateAsync({ id: selectedProducto.id, data: values })
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
            Productos
          </h1>
          <p className="text-sm text-slate-500">
            Administracion del catalogo de productos
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 shadow-sm transition"
        >
          + Añadir producto
        </button>
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
        />
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedProducto}
        categorias={categorias}
        serverError={serverError}
      />
    </div>
  )
}
