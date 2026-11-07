interface ProductoFormProps {
  titulo: string
}

export function ProductoForm({ titulo }: ProductoFormProps) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h2 className="text-xl font-bold text-slate-800">{titulo}</h2>
        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded font-medium">
          Maquetado sin hooks
        </span>
      </div>
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Nombre del producto
          </label>
          <input
            type="text"
            placeholder="Ej: Queso Tybo"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            readOnly
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Descripcion
          </label>
          <input
            type="text"
            placeholder="Ej: Horma de 1 kg envasada al vacio"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            readOnly
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Precio
          </label>
          <input
            type="number"
            placeholder="Ej: 8500.00"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            readOnly
          />
        </div>
        <div className="md:col-span-3 flex justify-end gap-3 pt-2">
          <button
            type="button"
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Limpiar
          </button>
          <button
            type="button"
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Añadir Producto
          </button>
        </div>
      </form>
    </section>
  )
}
