import { useForm } from "@tanstack/react-form"
import { Modal } from "@/shared/components/Modal"
import { Ingredient, IngredientCreate } from "../types/ingredient"

interface IngredientModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: IngredientCreate) => Promise<void>
  initialData?: Ingredient | null
  serverError?: string | null
}

function IngredientForm({
  initialData,
  onSubmit,
  onClose,
  serverError,
}: {
  initialData?: Ingredient | null
  onSubmit: (values: IngredientCreate) => Promise<void>
  onClose: () => void
  serverError?: string | null
}) {
  const form = useForm({
    defaultValues: {
      nombre: initialData ? initialData.nombre : "",
      costo: initialData ? initialData.costo : 0,
      stock: initialData ? initialData.stock : 0,
      unidad: initialData ? initialData.unidad : "u",
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        nombre: value.nombre,
        costo: Number(value.costo),
        stock: Number(value.stock),
        unidad: value.unidad,
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
              placeholder="Ej: Tomate"
            />
            {field.state.meta.errors && field.state.meta.errors.length > 0 ? (
              <p className="mt-1 text-xs text-red-600">
                {field.state.meta.errors.join(", ")}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-3 gap-3">
        <form.Field
          name="costo"
          validators={{
            onChange: ({ value }) =>
              Number(value) < 0 ? "El costo no puede ser negativo" : undefined,
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Costo
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

        <form.Field
          name="stock"
          validators={{
            onChange: ({ value }) =>
              Number(value) < 0 ? "El stock no puede ser negativo" : undefined,
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Stock
              </label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                min="0"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="unidad">
          {(field) => (
            <div>
              <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Unidad
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                placeholder="kg, u, gr"
              />
            </div>
          )}
        </form.Field>
      </div>

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

export function IngredientModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  serverError,
}: IngredientModalProps) {
  const title = initialData ? "Editar ingrediente" : "Nuevo ingrediente"

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {isOpen && (
        <IngredientForm
          key={initialData ? initialData.id : "new"}
          initialData={initialData}
          onSubmit={onSubmit}
          onClose={onClose}
          serverError={serverError}
        />
      )}
    </Modal>
  )
}
