export interface NavbarProps {
  onNuevoProducto: () => void
}

export const Navbar = ({ onNuevoProducto }: NavbarProps) => {
  return (
    <header className="bg-emerald-700 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold tracking-tight">Food Store</span>
          <span className="text-emerald-200 text-sm hidden sm:inline">
            Gestion de Catalogo
          </span>
        </div>
        <button
          onClick={onNuevoProducto}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-4 rounded shadow transition-colors cursor-pointer"
        >
          + Añadir Producto
        </button>
      </div>
    </header>
  )
}
