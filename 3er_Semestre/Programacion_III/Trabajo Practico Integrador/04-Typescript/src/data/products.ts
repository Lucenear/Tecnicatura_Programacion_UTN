export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
  stock?: number;
}

export const categorias: string[] = ["Hamburguesas", "Pizzas", "Papas Fritas", "Bebidas"];

export const productos: Product[] = [
  {
    id: 1,
    nombre: "Hamburguesa Boom",
    descripcion: "Hamburguesa Boom smash con mucho cheddar.",
    precio: 25000,
    imagen: "/assets/img/hamburguesa_boom.jpg",
    categoria: "Hamburguesas",
    stock: 12
  },
  {
    id: 2,
    nombre: "Pizza Muzzarella",
    descripcion: "Salsa de tomate casera y abundante muzzarella.",
    precio: 18000,
    imagen: "/assets/img/pizza_muzzarella.jpg",
    categoria: "Pizzas",
    stock: 5
  },
  {
    id: 3,
    nombre: "Papas con Cheddar",
    descripcion: "Papas fritas crocantes con salsa cheddar y verdeo.",
    precio: 9000,
    imagen: "/assets/img/papas_cheddar.jpg",
    categoria: "Papas Fritas",
    stock: 10
  },
  {
    id: 4,
    nombre: "Coca Cola 500ml",
    descripcion: "Bebida refrescante de 500ml.",
    precio: 3500,
    imagen: "/assets/img/coca_cola_500ml.jpg",
    categoria: "Bebidas",
    stock: 50
  }
];
