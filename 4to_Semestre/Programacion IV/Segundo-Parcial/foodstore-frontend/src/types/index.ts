export interface UnidadMedida {
  id: number
  nombre: string
  simbolo: string
  tipo: string
}

export interface Categoria {
  id: number
  nombre: string
  descripcion: string | null
  activo: boolean
  anulado_at: string | null
}

export interface Producto {
  id: number
  nombre: string
  descripcion: string | null
  precio_base: number
  stock_cantidad: number
  disponible: boolean
  activo: boolean
  anulado_at: string | null
  unidad_venta_id: number
  unidad_venta: UnidadMedida
  categorias: Categoria[]
  hay_stock: boolean
}

export interface ProductoFormData {
  nombre: string
  descripcion: string
  precio_base: number
  unidad_venta_id: number
  stock_cantidad: number
  disponible: boolean
}
