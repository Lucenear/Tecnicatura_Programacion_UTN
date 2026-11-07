import { Producto } from './types/producto'
import { Navbar } from './components/Navbar'
import { ProductoForm } from './components/ProductoForm'
import { ProductoList } from './components/ProductoList'
import { Footer } from './components/Footer'

const PRODUCTOS_INICIALES: Producto[] = [
  {
    id: 1,
    nombre: 'Queso Tybo',
    descripcion: 'Queso en barra ideal para fiambreria por peso o feteado',
    precio: 8000.0,
  },
  {
    id: 2,
    nombre: 'Jamon Cocido',
    descripcion: 'Jamon seleccionado cocido tradicional feteado fino',
    precio: 12000.0,
  },
  {
    id: 3,
    nombre: 'Pan Lactal',
    descripcion: 'Pan lactal blanco en paquete para sandwiches',
    precio: 2500.0,
  },
  {
    id: 4,
    nombre: 'Tomate Perita',
    descripcion: 'Tomate fresco seleccionado por kilogramo para ensaladas',
    precio: 3000.0,
  },
  {
    id: 5,
    nombre: 'Cerveza Lata',
    descripcion: 'Cerveza rubia en lata pack individual de 473 ml',
    precio: 1800.0,
  },
]

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar titulo="Food Store" subtitulo="Panel de Administracion" />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductoForm titulo="Registrar Nuevo Producto" />
        <ProductoList productos={PRODUCTOS_INICIALES} />
      </main>
      <Footer nombreTienda="Food Store" año={2026} />
    </div>
  )
}
