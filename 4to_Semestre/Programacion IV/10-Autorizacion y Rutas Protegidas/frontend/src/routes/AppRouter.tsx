import { Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute } from "./ProtectedRoute"
import { Navbar } from "@/shared/components/Navbar"
import { UnauthorizedPage } from "@/shared/components/UnauthorizedPage"
import { LoginPage, RegisterPage, AdminUsersPage } from "@/features/auth"
import { CategoriesPage } from "@/features/categories"
import { ProductsPage } from "@/features/products"
import { IngredientsPage } from "@/features/ingredients"

export function AppRouter() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col transition-colors">
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
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/ingredientes" element={<IngredientsPage />} />
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
