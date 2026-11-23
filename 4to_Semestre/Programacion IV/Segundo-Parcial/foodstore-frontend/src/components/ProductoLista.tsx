import { Producto } from '../types'
import { ProductoFila } from './ProductoFila'

export interface ProductoListaProps {
  productos: Producto[]
  onEditar: (producto: Producto) => void
  onCambiarDisponibilidad: (producto: Producto) => void
  onAnular: (id: number) => void
}

export const ProductoLista = ({
  productos,
  onEditar,
  onCambiarDisponibilidad,
  onAnular,
}: ProductoListaProps) => {
  if (productos.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-500 text-base">
          No hay productos disponibles en el catalogo.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {productos.map((producto) => (
        <ProductoFila
          key={producto.id}
          producto={producto}
          onEditar={onEditar}
          onCambiarDisponibilidad={onCambiarDisponibilidad}
          onAnular={onAnular}
        />
      ))}
    </div>
  )
}
