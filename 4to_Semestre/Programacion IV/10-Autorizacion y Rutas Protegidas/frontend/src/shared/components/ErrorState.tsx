interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = "Ocurrio un error al cargar la informacion.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg flex items-center justify-between text-red-800 dark:text-red-300">
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-sm">{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-xs font-medium px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/60 dark:hover:bg-red-800 text-red-800 dark:text-red-200 rounded transition"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}
