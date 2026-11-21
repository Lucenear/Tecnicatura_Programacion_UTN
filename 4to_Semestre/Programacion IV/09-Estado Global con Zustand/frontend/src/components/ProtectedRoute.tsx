import { ReactNode } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { LoadingState } from "./LoadingState"

interface ProtectedRouteProps {
  allowedRoles?: string[]
  children?: ReactNode
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return <LoadingState message="Verificando sesion..." />
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
