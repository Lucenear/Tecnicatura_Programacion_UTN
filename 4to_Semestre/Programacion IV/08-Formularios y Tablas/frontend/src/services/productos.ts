import { API_URL, handleResponse } from "./api"
import { Producto, ProductoCreate, ProductoUpdate } from "../types/producto"

export async function getProductos(): Promise<Producto[]> {
  const res = await fetch(`${API_URL}/productos`)
  return handleResponse<Producto[]>(res)
}

export async function getProductoById(id: number): Promise<Producto> {
  const res = await fetch(`${API_URL}/productos/${id}`)
  return handleResponse<Producto>(res)
}

export async function createProducto(data: ProductoCreate): Promise<Producto> {
  const res = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return handleResponse<Producto>(res)
}

export async function updateProducto(id: number, data: ProductoUpdate): Promise<Producto> {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return handleResponse<Producto>(res)
}

export async function deleteProducto(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: "DELETE",
  })
  return handleResponse<void>(res)
}
