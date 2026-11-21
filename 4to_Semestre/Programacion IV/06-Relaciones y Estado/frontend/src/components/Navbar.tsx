export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Gestion de Categorias
            </span>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              FastAPI + React
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Programacion IV
          </div>
        </div>
      </div>
    </nav>
  );
}
