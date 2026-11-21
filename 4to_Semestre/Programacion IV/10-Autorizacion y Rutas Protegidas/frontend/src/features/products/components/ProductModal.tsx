import { useForm } from "@tanstack/react-form"
import { Modal } from "@/shared/components/Modal"
import { Producto, ProductoCreate } from "../types/producto"
import { Categoria } from "@/features/categories"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: ProductoCreate) => Promise<void>
  initialData?: Producto | null
  categorias?: Categoria[]
  serverError?: string | null
}

function ProductForm({
  initialData,
  categorias = [],
  onSubmit,
  onClose,
  serverError,
}: {
  initialData?: Producto | null
  categorias?: Categoria[]
  onSubmit: (values: ProductoCreate) => Promise<void>
  onClose: () => void
  serverError?: string | null
}) {
  const form = useForm({
    defaultValues: {
      nombre: initialData ? initialData.nombre : "",
      descripcion: initialData ? initialData.descripcion : "",
      precio_base: initialData ? initialData.precio_base : 0,
      disponible: initialData ? initialData.disponible : true,
      categoria_id: initialData?.categoria_id ?? null,
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        nombre: value.nombre,
        descripcion: value.descripcion,
        precio_base: Number(value.precio_base),
        disponible: Boolean(value.disponible),
        categoria_id: value.categoria_id ? Number(value.categoria_id) : null,
      })
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      {serverError && (
        <div className="p-3 text-sm text-red-700 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-md">
          {serverError}
        </div>
      )}

      <form.Field
        name="nombre"
        validators={{
          onChange: ({ value }) =>
            !value || !value.trim() ? "El nombre es obligatorio" : undefined,
        }}
      >
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Nombre
            </label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              placeholder="Ej: Hamburguesa Doble"
            />
            {field.state.meta.errors && field.state.meta.errors.length > 0 ? (
              <p className="mt-1 text-xs text-red-600">
                {field.state.meta.errors.join(", ")}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field name="descripcion">
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Descripcion
            </label>
            <textarea
              id={field.name}
              name={field.name}
              rows={2}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              placeholder="Descripcion del producto"
            />
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="precio_base"
          validators={{
            onChange: ({ value }) =>
              Number(value) < 0 ? "El precio no puede ser negativo" : undefined,
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Precio base
              </label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                step="0.01"
                min="0"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              />
              {field.state.meta.errors && field.state.meta.errors.length > 0 ? (
                <p className="mt-1 text-xs text-red-600">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field name="categoria_id">
          {(field) => (
            <div>
              <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Categoria
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value ? Number(e.target.value) : null)
                }
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              >
                <option value="">Sin categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="disponible">
        {(field) => (
          <div className="flex items-center space-x-2 pt-2">
            <input
              id={field.name}
              name={field.name}
              type="checkbox"
              checked={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.checked)}
              className="h-4 w-4 text-slate-900 border-slate-300 rounded focus:ring-slate-500"
            />
            <label htmlFor={field.name} className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Disponible para venta
            </label>
          </div>
        )}
      </form.Field>

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          Cancelar
        </button>
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
            >
              {isSubmitting ? "Guardando..." : initialData ? "Actualizar" : "Añadir"}
            </button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}

export function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categorias = [],
  serverError,
}: ProductModalProps) {
  const title = initialData ? "Editar producto" : "Nuevo producto"

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {isOpen && (
        <ProductForm
          key={initialData ? initialData.id : "new"}
          initialData={initialData}
          categorias={categorias}
          onSubmit={onSubmit}
          onClose={onClose}
          serverError={serverError}
        />
      )}
    </Modal>
  )
}
