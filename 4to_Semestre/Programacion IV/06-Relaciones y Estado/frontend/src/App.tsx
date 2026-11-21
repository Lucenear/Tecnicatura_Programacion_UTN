import { useState, useEffect } from "react";
import type { Categoria, CategoriaFormData } from "./types/categoria";
import { Navbar } from "./components/Navbar";
import { CategoriaList } from "./components/CategoriaList";
import { CategoriaModal } from "./components/CategoriaModal";

export default function App() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("http://localhost:8000/categorias");
      if (!res.ok) {
        throw new Error("Error al obtener las categorias");
      }
      const data: Categoria[] = await res.json();
      setCategorias(data);
    } catch {
      setError("No se pudo conectar con el servidor backend");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleCreate = async (data: CategoriaFormData) => {
    try {
      const res = await fetch("http://localhost:8000/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Error al crear la categoria");
      }
      const nuevaCategoria: Categoria = await res.json();
      setCategorias((prev) => [...prev, nuevaCategoria]);
      setIsModalOpen(false);
    } catch {
      alert("Hubo un error al crear la categoria");
    }
  };

  const handleUpdate = async (id: number, data: CategoriaFormData) => {
    try {
      const res = await fetch(`http://localhost:8000/categorias/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Error al actualizar la categoria");
      }
      const categoriaActualizada: Categoria = await res.json();
      setCategorias((prev) =>
        prev.map((cat) => (cat.id === id ? categoriaActualizada : cat))
      );
      setIsModalOpen(false);
      setCategoriaSeleccionada(null);
    } catch {
      alert("Hubo un error al actualizar la categoria");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmacion = window.confirm("Esta seguro de eliminar esta categoria?");
    if (!confirmacion) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/categorias/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Error al eliminar la categoria");
      }
      setCategorias((prev) => prev.filter((cat) => cat.id !== id));
    } catch {
      alert("Hubo un error al eliminar la categoria");
    }
  };

  const handleOpenCreate = () => {
    setCategoriaSeleccionada(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoriaSeleccionada(null);
  };

  const handleModalSubmit = (data: CategoriaFormData) => {
    if (categoriaSeleccionada) {
      handleUpdate(categoriaSeleccionada.id, data);
    } else {
      handleCreate(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
          >
            + Añadir Categoria
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={fetchCategorias}
              className="text-red-700 underline font-semibold ml-4"
            >
              Reintentar
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
            Cargando categorias...
          </div>
        ) : (
          <CategoriaList
            categorias={categorias}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        )}

        <CategoriaModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
          categoriaParaEditar={categoriaSeleccionada}
        />
      </main>
    </div>
  );
}
