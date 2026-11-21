interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = "Cargando datos..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-slate-800 dark:border-t-slate-200 rounded-full animate-spin" />
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{message}</p>
    </div>
  )
}
