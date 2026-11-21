import { useForm } from "@tanstack/react-form"
import { Modal } from "../Modal"
import { Categoria, CategoriaCreate } from "../../types/categoria"

interface CategoriaModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: CategoriaCreate) => Promise<void>
  initialData?: Categoria | null
  serverError?: string | null
}

function CategoriaForm({
  initialData,
  onSubmit,
  onClose,
  serverError,
}: {
  initialData?: Categoria | null
  onSubmit: (values: CategoriaCreate) => Promise<void>
  onClose: () => void
  serverError?: string | null
}) {
  const form = useForm({
    defaultValues: {
      nombre: initialData ? initialData.nombre : "",
      descripcion: initialData ? initialData.descripcion : "",
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
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
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {serverError}
        </div>
      )}

      <form.Field
        name="nombre"
        validators={{
          onChange: ({ value }) =>
            !value || !value.trim()
              ? "El nombre es obligatorio"
              : undefined,
        }}
      >
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              placeholder="Ej: Hamburguesas"
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
            <label htmlFor={field.name} className="block text-sm font-medium text-slate-700">
              Descripcion
            </label>
            <textarea
              id={field.name}
              name={field.name}
              rows={3}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              placeholder="Descripcion opcional"
            />
          </div>
        )}
      </form.Field>

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
        >
          Cancelar
        </button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Guardando..." : initialData ? "Actualizar" : "Añadir"}
            </button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}

export function CategoriaModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  serverError,
}: CategoriaModalProps) {
  const title = initialData ? "Editar categoria" : "Nueva categoria"

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {isOpen && (
        <CategoriaForm
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
