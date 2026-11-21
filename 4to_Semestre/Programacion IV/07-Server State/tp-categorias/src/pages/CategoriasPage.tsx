import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/categoria";
import type { Categoria, CategoriaInput } from "../types/categoria";
import CategoriaList from "../components/CategoriaList";
import CategoriaModal from "../components/CategoriaModal";

export default function CategoriasPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);

  const {
    data: categorias = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  });

  const createMutation = useMutation({
    mutationFn: createCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      cerrarModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaInput }) =>
      updateCategoria(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      cerrarModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  const abrirModalCrear = () => {
    setCategoriaSeleccionada(null);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setCategoriaSeleccionada(null);
    setIsModalOpen(false);
  };

  const handleGuardar = (data: CategoriaInput) => {
    if (categoriaSeleccionada) {
      updateMutation.mutate({ id: categoriaSeleccionada.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEliminar = (id: number) => {
    const confirmar = window.confirm("Desea eliminar esta categoria?");
    if (confirmar) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Gestion de Categorias
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Administracion del listado general
          </p>
        </div>
        <button
          onClick={abrirModalCrear}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow-sm transition-colors"
        >
          Añadir Categoria
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-12 text-slate-500 font-medium">
          Cargando categorias...
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          Error al cargar las categorias: {error instanceof Error ? error.message : "Error inesperado"}
        </div>
      )}

      {!isLoading && !isError && (
        <CategoriaList
          categorias={categorias}
          onEdit={abrirModalEditar}
          onDelete={handleEliminar}
        />
      )}

      <CategoriaModal
        isOpen={isModalOpen}
        onClose={cerrarModal}
        onSubmit={handleGuardar}
        initialData={categoriaSeleccionada}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
