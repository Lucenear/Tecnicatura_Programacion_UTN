import { useEffect } from "react";
import type { FormEvent } from "react";
import type { Categoria, CategoriaFormData } from "../types/categoria";
import { useForm } from "../hooks/useForm";

type CategoriaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoriaFormData) => void;
  categoriaParaEditar: Categoria | null;
};

export function CategoriaModal({
  isOpen,
  onClose,
  onSubmit,
  categoriaParaEditar,
}: CategoriaModalProps) {
  const { formData, handleChange, resetForm, setFormData } = useForm<CategoriaFormData>({
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    if (categoriaParaEditar) {
      setFormData({
        nombre: categoriaParaEditar.nombre,
        descripcion: categoriaParaEditar.descripcion,
      });
    } else {
      resetForm({
        nombre: "",
        descripcion: "",
      });
    }
  }, [categoriaParaEditar, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">
            {categoriaParaEditar ? "Editar Categoria" : "Nueva Categoria"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre de la categoria
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Ingresa el nombre"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripcion
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
                required
                placeholder="Ingresa la descripcion"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
