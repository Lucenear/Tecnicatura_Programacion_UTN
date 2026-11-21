import type { Categoria } from "../types/categoria";
import { CategoriaCard } from "./CategoriaCard";

type CategoriaListProps = {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
};

export function CategoriaList({
  categorias,
  onEdit,
  onDelete,
}: CategoriaListProps) {
  if (categorias.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
        No hay categorias registradas. Haz clic en el boton superior para añadir una nueva categoria.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div className="col-span-1">Numero</div>
        <div className="col-span-3">Nombre</div>
        <div className="col-span-6">Descripcion</div>
        <div className="col-span-2 text-right">Acciones</div>
      </div>
      <div className="divide-y divide-gray-100">
        {categorias.map((categoria) => (
          <CategoriaCard
            key={categoria.id}
            categoria={categoria}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
