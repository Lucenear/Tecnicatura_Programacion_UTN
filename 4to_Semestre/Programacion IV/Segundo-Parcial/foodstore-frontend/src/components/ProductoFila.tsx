import { Producto } from '../types'

export interface ProductoFilaProps {
  producto: Producto
  onEditar: (producto: Producto) => void
  onCambiarDisponibilidad: (producto: Producto) => void
  onAnular: (id: number) => void
}

export const ProductoFila = ({
  producto,
  onEditar,
  onCambiarDisponibilidad,
  onAnular,
}: ProductoFilaProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-lg font-semibold text-gray-900">
            {producto.nombre}
          </h3>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
              producto.disponible
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {producto.disponible ? 'Disponible' : 'Venta pausada'}
          </span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
              producto.hay_stock
                ? 'bg-blue-100 text-blue-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {producto.hay_stock ? 'Hay stock' : 'Sin stock'}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {producto.descripcion || 'Sin descripcion'}
        </p>
        <div className="mt-3 flex items-center gap-6 text-sm">
          <div>
            <span className="text-gray-500">Precio: </span>
            <span className="font-semibold text-gray-900">
              $ {producto.precio_base.toFixed(2)} / {producto.unidad_venta.simbolo}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Stock: </span>
            <span className="font-semibold text-gray-900">
              {producto.stock_cantidad} {producto.unidad_venta.simbolo}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-center">
        <button
          onClick={() => onEditar(producto)}
          className="px-3 py-1.5 text-sm font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded border border-sky-200 transition-colors cursor-pointer"
        >
          Editar
        </button>
        <button
          onClick={() => onCambiarDisponibilidad(producto)}
          className="px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200 transition-colors cursor-pointer"
        >
          Disponibilidad
        </button>
        <button
          onClick={() => onAnular(producto.id)}
          className="px-3 py-1.5 text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors cursor-pointer"
        >
          Anular
        </button>
      </div>
    </div>
  )
}
