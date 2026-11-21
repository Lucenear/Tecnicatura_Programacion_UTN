import { NavLink } from "react-router-dom"

export function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "px-3 py-2 rounded-md text-sm font-medium bg-slate-900 text-white"
      : "px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-200"

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight text-slate-900">Food Store</span>
        </div>
        <nav className="flex items-center space-x-2">
          <NavLink to="/categorias" className={linkClass}>
            Categorias
          </NavLink>
          <NavLink to="/productos" className={linkClass}>
            Productos
          </NavLink>
          <NavLink to="/ingredientes" className={linkClass}>
            Ingredientes
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
