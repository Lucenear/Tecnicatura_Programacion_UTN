export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio_base: number
  disponible: boolean
  categoria_id?: number | null
}

export interface ProductoCreate {
  nombre: string
  descripcion: string
  precio_base: number
  disponible: boolean
  categoria_id?: number | null
}

export interface ProductoUpdate {
  nombre?: string
  descripcion?: string
  precio_base?: number
  disponible?: boolean
  categoria_id?: number | null
}
