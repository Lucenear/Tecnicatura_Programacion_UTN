import { ReactNode } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/features/auth"
import { LoadingState } from "@/shared/components/LoadingState"

interface ProtectedRouteProps {
  allowedRoles?: string[]
  children?: ReactNode
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, checking, isLoading } = useAuthStore()
  const isCheckingSession = checking || isLoading

  if (isCheckingSession) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingState message="Verificando sesion..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const tieneRol = user.roles.some((r) => allowedRoles.includes(r))
    if (!tieneRol) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return children ? <>{children}</> : <Outlet />
}
