import { useState, useEffect } from 'react'
import { Producto, UnidadMedida, ProductoFormData } from './types'
import { Navbar } from './components/Navbar'
import { ProductoLista } from './components/ProductoLista'
import { ProductoModal } from './components/ProductoModal'

const API_BASE = 'http://localhost:8000/api/v1'

export function App() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [unidades, setUnidades] = useState<UnidadMedida[]>([])
  const [modalAbierto, setModalAbierto] = useState<boolean>(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null)
  const [cargando, setCargando] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [errorModal, setErrorModal] = useState<string | null>(null)

  const cargarProductos = async () => {
    try {
      setError(null)
      const res = await fetch(`${API_BASE}/productos`)
      if (!res.ok) {
        throw new Error('Error al cargar productos')
      }
      const data: Producto[] = await res.json()
      setProductos(data)
    } catch {
      setError('No se pudo conectar con el servidor')
    } finally {
      setCargando(false)
    }
  }

  const cargarUnidades = async () => {
    try {
      const res = await fetch(`${API_BASE}/unidades-medida`)
      if (res.ok) {
        const data: UnidadMedida[] = await res.json()
        setUnidades(data)
      }
    } catch {
      return
    }
  }

  useEffect(() => {
    cargarProductos()
    cargarUnidades()
  }, [])

  const handleAbrirAlta = () => {
    setProductoSeleccionado(null)
    setErrorModal(null)
    setModalAbierto(true)
  }

  const handleAbrirEdicion = (producto: Producto) => {
    setProductoSeleccionado(producto)
    setErrorModal(null)
    setModalAbierto(true)
  }

  const handleCerrarModal = () => {
    setModalAbierto(false)
    setProductoSeleccionado(null)
    setErrorModal(null)
  }

  const handleGuardarProducto = async (data: ProductoFormData) => {
    setErrorModal(null)
    try {
      if (productoSeleccionado) {
        const res = await fetch(`${API_BASE}/productos/${productoSeleccionado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (res.ok) {
          handleCerrarModal()
          cargarProductos()
        } else {
          const resJson = await res.json()
          setErrorModal(resJson.detail || 'Error al actualizar el producto')
        }
      } else {
        const res = await fetch(`${API_BASE}/productos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (res.status === 201) {
          handleCerrarModal()
          cargarProductos()
        } else {
          const resJson = await res.json()
          setErrorModal(resJson.detail || 'Error al crear el producto')
        }
      }
    } catch {
      setErrorModal('Error de comunicacion con el servidor')
    }
  }

  const handleCambiarDisponibilidad = async (producto: Producto) => {
    try {
      const res = await fetch(`${API_BASE}/productos/${producto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio_base: producto.precio_base,
          unidad_venta_id: producto.unidad_venta_id,
          stock_cantidad: producto.stock_cantidad,
          disponible: !producto.disponible,
        }),
      })

      if (res.ok) {
        cargarProductos()
      }
    } catch {
      setError('Error al cambiar la disponibilidad')
    }
  }

  const handleAnular = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/productos/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        cargarProductos()
      }
    } catch {
      setError('Error al anular el producto')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onNuevoProducto={handleAbrirAlta} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Catalogo de Productos
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Administracion de productos, precios y existencias
            </p>
          </div>
        </div>

        {cargando && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-gray-600 font-medium">
              Cargando productos...
            </span>
          </div>
        )}

        {error && !cargando && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={cargarProductos}
              className="text-sm font-semibold underline hover:text-rose-900 cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && (
          <ProductoLista
            productos={productos}
            onEditar={handleAbrirEdicion}
            onCambiarDisponibilidad={handleCambiarDisponibilidad}
            onAnular={handleAnular}
          />
        )}
      </main>

      <ProductoModal
        abierto={modalAbierto}
        productoEditar={productoSeleccionado}
        unidades={unidades}
        errorModal={errorModal}
        onGuardar={handleGuardarProducto}
        onCerrar={handleCerrarModal}
      />
    </div>
  )
}

export default App
