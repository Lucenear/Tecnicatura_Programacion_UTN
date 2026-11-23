import { useState, useEffect, type FormEvent } from 'react'
import { Producto, UnidadMedida, ProductoFormData } from '../types'

export interface ProductoModalProps {
  abierto: boolean
  productoEditar: Producto | null
  unidades: UnidadMedida[]
  errorModal: string | null
  onGuardar: (data: ProductoFormData) => void
  onCerrar: () => void
}

export const ProductoModal = ({
  abierto,
  productoEditar,
  unidades,
  errorModal,
  onGuardar,
  onCerrar,
}: ProductoModalProps) => {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precioBase, setPrecioBase] = useState('0')
  const [unidadVentaId, setUnidadVentaId] = useState<number>(0)
  const [stockCantidad, setStockCantidad] = useState('0')
  const [disponible, setDisponible] = useState(true)
  const [errorLocal, setErrorLocal] = useState<string | null>(null)

  useEffect(() => {
    if (productoEditar) {
      setNombre(productoEditar.nombre)
      setDescripcion(productoEditar.descripcion || '')
      setPrecioBase(productoEditar.precio_base.toString())
      setUnidadVentaId(productoEditar.unidad_venta_id)
      setStockCantidad(productoEditar.stock_cantidad.toString())
      setDisponible(productoEditar.disponible)
    } else {
      setNombre('')
      setDescripcion('')
      setPrecioBase('0')
      setUnidadVentaId(unidades.length > 0 ? unidades[0].id : 0)
      setStockCantidad('0')
      setDisponible(true)
    }
    setErrorLocal(null)
  }, [productoEditar, abierto, unidades])

  if (!abierto) {
    return null
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setErrorLocal(null)

    if (nombre.trim().length < 3) {
      setErrorLocal('El nombre debe tener al menos 3 caracteres')
      return
    }

    const precioNum = parseFloat(precioBase)
    if (isNaN(precioNum) || precioNum < 0) {
      setErrorLocal('El precio base debe ser un numero mayor o igual a 0')
      return
    }

    const stockNum = parseFloat(stockCantidad)
    if (isNaN(stockNum) || stockNum < 0) {
      setErrorLocal('El stock debe ser un numero mayor o igual a 0')
      return
    }

    const unidadSeleccionada = unidades.find((u) => u.id === Number(unidadVentaId))
    if (!unidadSeleccionada) {
      setErrorLocal('Debe seleccionar una unidad de venta valida')
      return
    }

    if (unidadSeleccionada.tipo === 'contable' && stockNum % 1 !== 0) {
      setErrorLocal('El stock para una unidad contable debe ser un numero entero')
      return
    }

    onGuardar({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio_base: precioNum,
      unidad_venta_id: Number(unidadVentaId),
      stock_cantidad: stockNum,
      disponible,
    })
  }

  const mensajeError = errorModal || errorLocal

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {productoEditar ? 'Editar Producto' : 'Añadir Producto'}
          </h2>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mensajeError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded text-sm">
              {mensajeError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ej. Empanada criolla"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripcion
            </label>
            <textarea
              rows={2}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Opcional"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Base
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={precioBase}
                onChange={(e) => setPrecioBase(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidad de Venta
              </label>
              <select
                value={unidadVentaId}
                onChange={(e) => setUnidadVentaId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} ({u.simbolo}) - {u.tipo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={stockCantidad}
                onChange={(e) => setStockCantidad(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={disponible}
                  onChange={(e) => setDisponible(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-sm font-medium text-gray-700">
                  Disponible para venta
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm font-medium transition-colors cursor-pointer"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
