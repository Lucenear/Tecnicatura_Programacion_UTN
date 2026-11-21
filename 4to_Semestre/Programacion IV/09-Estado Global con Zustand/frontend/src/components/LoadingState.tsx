interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = "Cargando datos..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 bg-white rounded-lg border border-slate-200">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      <p className="text-sm text-slate-500 font-medium">{message}</p>
    </div>
  )
}
