import { useState } from "react"
import { useNavigate, Link, Navigate } from "react-router-dom"
import { useForm } from "@tanstack/react-form"
import { useAuth } from "../hooks/useAuth"
import { useNotificationStore } from "@/store/notificationStore"

export function RegisterPage() {
  const navigate = useNavigate()
  const { user, register } = useAuth()
  const { showNotification } = useNotificationStore()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      celular: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setServerError(null)
        await register({
          nombre: value.nombre,
          apellido: value.apellido,
          email: value.email,
          celular: value.celular || undefined,
          password: value.password,
        })
        showNotification("Cuenta creada con exito. Ya puedes iniciar sesion.", "success")
        navigate("/login", { replace: true })
      } catch (err) {
        if (err instanceof Error) {
          setServerError(err.message)
        } else {
          setServerError("Error al registrar la cuenta")
        }
      }
    },
  })

  if (user) {
    return <Navigate to="/categories" replace />
  }

  return (
    <div className="max-w-lg mx-auto my-12 p-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Registro de usuario
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Crea tu cuenta para comenzar a operar
        </p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md">
          {serverError}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder="Juan"
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
            name="apellido"
            validators={{
              onChange: ({ value }) =>
                !value || !value.trim() ? "El apellido es obligatorio" : undefined,
            }}
          >
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Apellido
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                  placeholder="Perez"
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 ? (
                  <p className="mt-1 text-xs text-red-600">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>
        </div>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              !value || !value.trim()
                ? "El email es obligatorio"
                : !value.includes("@")
                ? "Ingrese un email valido"
                : undefined,
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                placeholder="usuario@ejemplo.com"
              />
              {field.state.meta.errors && field.state.meta.errors.length > 0 ? (
                <p className="mt-1 text-xs text-red-600">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field name="celular">
          {(field) => (
            <div>
              <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Celular (opcional)
              </label>
              <input
                id={field.name}
                name={field.name}
                type="tel"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                placeholder="1122334455"
              />
            </div>
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "La contraseña es obligatoria"
                : value.length < 8
                ? "La contraseña debe tener al menos 8 caracteres"
                : undefined,
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Contraseña
              </label>
              <input
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                placeholder="Minimo 8 caracteres"
              />
              {field.state.meta.errors && field.state.meta.errors.length > 0 ? (
                <p className="mt-1 text-xs text-red-600">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow-sm transition"
            >
              {isSubmitting ? "Registrando..." : "Crear cuenta"}
            </button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="font-medium text-slate-900 dark:text-white hover:underline">
          Inicia sesion
        </Link>
      </div>
    </div>
  )
}
