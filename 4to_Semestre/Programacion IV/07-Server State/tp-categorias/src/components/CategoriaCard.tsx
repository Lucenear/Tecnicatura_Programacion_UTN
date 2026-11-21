import type { Categoria } from "../types/categoria";

interface CategoriaCardProps {
  categoria: Categoria;
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
}

export default function CategoriaCard({
  categoria,
  onEdit,
  onDelete,
}: CategoriaCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow transition-shadow">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          {categoria.nombre}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          {categoria.descripcion}
        </p>
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
        <button
          onClick={() => onEdit(categoria)}
          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded transition-colors"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(categoria.id)}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
