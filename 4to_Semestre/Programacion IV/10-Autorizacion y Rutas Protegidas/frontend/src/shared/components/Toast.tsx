import { useEffect } from "react"
import { useNotificationStore } from "@/store/notificationStore"
import { CheckCircle, AlertCircle, Info, X } from "lucide-react"

export function Toast() {
  const { message, visible, type, hideNotification } = useNotificationStore()

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => {
      hideNotification()
    }, 3000)
    return () => clearTimeout(timer)
  }, [visible, hideNotification])

  if (!visible || !message) return null

  const getVariantStyles = () => {
    switch (type) {
      case "success":
        return "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800"
      case "error":
        return "bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800"
      default:
        return "bg-slate-50 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
    }
  }

  const renderIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
      default:
        return <Info className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0" />
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div
        className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${getVariantStyles()}`}
      >
        {renderIcon()}
        <div className="flex-1 text-sm font-medium">{message}</div>
        <button
          type="button"
          onClick={hideNotification}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
