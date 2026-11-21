import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-slate-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-wide hover:text-slate-200">
          Catalogo Web
        </Link>
        <div className="flex gap-6">
          <Link
            to="/categorias"
            className="hover:text-blue-300 transition-colors"
          >
            Categorias
          </Link>
          <Link
            to="/productos"
            className="hover:text-blue-300 transition-colors"
          >
            Productos
          </Link>
        </div>
      </div>
    </nav>
  );
}
