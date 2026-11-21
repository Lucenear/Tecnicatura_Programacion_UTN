export type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: string;
  imagen_url: string[];
  disponible: boolean;
};

export type ProductoCategoria = {
  producto_id: number;
  categoria_id: number;
};
