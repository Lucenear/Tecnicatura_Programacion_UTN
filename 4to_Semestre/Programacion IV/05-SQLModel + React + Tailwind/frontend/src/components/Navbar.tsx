interface NavbarProps {
  titulo: string
  subtitulo: string
}

export function Navbar({ titulo, subtitulo }: NavbarProps) {
  return (
    <header className="bg-emerald-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold tracking-tight">{titulo}</span>
          <span className="text-xs bg-emerald-800 text-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
            {subtitulo}
          </span>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <span className="hover:text-emerald-200 transition-colors cursor-pointer">Catalogo</span>
          <span className="hover:text-emerald-200 transition-colors cursor-pointer">Nuevo Producto</span>
          <span className="hover:text-emerald-200 transition-colors cursor-pointer">Contacto</span>
        </nav>
      </div>
    </header>
  )
}
