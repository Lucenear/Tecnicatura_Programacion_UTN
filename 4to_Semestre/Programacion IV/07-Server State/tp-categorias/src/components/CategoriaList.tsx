import type { Categoria } from "../types/categoria";
import CategoriaCard from "./CategoriaCard";

interface CategoriaListProps {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
}

export default function CategoriaList({
  categorias,
  onEdit,
  onDelete,
}: CategoriaListProps) {
  if (categorias.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300 text-slate-500">
        No hay categorias añadidas actualmente.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categorias.map((cat) => (
        <CategoriaCard
          key={cat.id}
          categoria={cat}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
