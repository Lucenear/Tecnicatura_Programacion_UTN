import { Producto } from '../types/producto'
import { ProductoCard } from './ProductoCard'

interface ProductoListProps {
  productos: Producto[]
}

export function ProductoList({ productos }: ProductoListProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">
          Catalogo de Productos
        </h2>
        <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          Total: {productos.length} articulos
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  )
}
