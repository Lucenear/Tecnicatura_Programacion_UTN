import { Producto } from '../types/producto'

interface ProductoCardProps {
  producto: Producto
}

export function ProductoCard({ producto }: ProductoCardProps) {
  return (
    <article className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-slate-900 leading-snug">
            {producto.nombre}
          </h3>
          <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-200 shrink-0">
            ID #{producto.id}
          </span>
        </div>
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {producto.descripcion}
        </p>
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Precio unitario</span>
          <span className="text-xl font-bold text-emerald-600">
            ${producto.precio.toFixed(2)}
          </span>
        </div>
        <button
          type="button"
          className="px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Ver detalle
        </button>
      </div>
    </article>
  )
}
