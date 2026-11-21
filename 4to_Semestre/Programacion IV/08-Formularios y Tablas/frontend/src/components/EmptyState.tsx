interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = "No se encontraron elementos",
  description = "No hay registros disponibles para mostrar.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg border border-slate-200">
      <div className="w-12 h-12 mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        <span className="text-2xl font-bold">!</span>
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  )
}
