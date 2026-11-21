import { Routes, Route, Navigate } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { CategoriasPage } from "./pages/CategoriasPage"
import { ProductsPage } from "./pages/ProductsPage"
import { IngredientesPage } from "./pages/IngredientesPage"

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-1">
        <Routes>
          <Route path="/" element={<CategoriasPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/categories" element={<CategoriasPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/ingredientes" element={<IngredientesPage />} />
          <Route path="/ingredients" element={<IngredientesPage />} />
          <Route path="*" element={<Navigate to="/categorias" replace />} />
        </Routes>
      </main>
    </div>
  )
}
