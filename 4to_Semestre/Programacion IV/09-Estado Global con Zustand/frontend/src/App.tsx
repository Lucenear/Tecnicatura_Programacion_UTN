import { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "./store/authStore"
import { Navbar } from "./components/Navbar"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { CategoriesPage } from "./pages/CategoriesPage"
import { ProductsPage } from "./pages/ProductsPage"
import { AdminUsersPage } from "./pages/AdminUsersPage"
import { UnauthorizedPage } from "./pages/UnauthorizedPage"
import { LoadingState } from "./components/LoadingState"

export default function App() {
  const { checkSession, isLoading } = useAuthStore()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingState message="Cargando aplicacion..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/categories" replace />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categorias" element={<CategoriesPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/productos" element={<ProductsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/usuarios" element={<AdminUsersPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/categories" replace />} />
        </Routes>
      </main>
    </div>
  )
}
