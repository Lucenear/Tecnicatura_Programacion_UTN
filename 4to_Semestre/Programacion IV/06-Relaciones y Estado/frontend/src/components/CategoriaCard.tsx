import type { Categoria } from "../types/categoria";

type CategoriaCardProps = {
  categoria: Categoria;
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
};

export function CategoriaCard({
  categoria,
  onEdit,
  onDelete,
}: CategoriaCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="md:col-span-1 text-sm text-gray-500 font-medium">
        <span className="md:hidden font-semibold text-gray-700 mr-2">Numero:</span>
        {categoria.id}
      </div>
      <div className="md:col-span-3 text-sm font-semibold text-gray-900">
        <span className="md:hidden font-semibold text-gray-700 mr-2">Nombre:</span>
        {categoria.nombre}
      </div>
      <div className="md:col-span-6 text-sm text-gray-600">
        <span className="md:hidden font-semibold text-gray-700 mr-2">Descripcion:</span>
        {categoria.descripcion}
      </div>
      <div className="md:col-span-2 flex md:justify-end space-x-3 text-sm pt-2 md:pt-0">
        <button
          onClick={() => onEdit(categoria)}
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(categoria.id)}
          className="text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
