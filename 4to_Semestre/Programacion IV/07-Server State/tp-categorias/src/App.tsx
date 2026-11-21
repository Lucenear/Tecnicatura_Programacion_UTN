import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CategoriasPage from "./pages/CategoriasPage";
import ProductsPage from "./pages/ProductsPage";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<CategoriasPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/productos" element={<ProductsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
