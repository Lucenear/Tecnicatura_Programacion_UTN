import { axiosInstance } from "../api/axiosInstance"
import { Producto, ProductoCreate, ProductoUpdate } from "../types/producto"
import { getErrorMessage } from "./api"

export async function getProductos(): Promise<Producto[]> {
  try {
    const res = await axiosInstance.get<Producto[]>("/productos")
    return res.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getProductoById(id: number): Promise<Producto> {
  try {
    const res = await axiosInstance.get<Producto>(`/productos/${id}`)
    return res.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function createProducto(data: ProductoCreate): Promise<Producto> {
  try {
    const res = await axiosInstance.post<Producto>("/productos", data)
    return res.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function updateProducto(id: number, data: ProductoUpdate): Promise<Producto> {
  try {
    const res = await axiosInstance.put<Producto>(`/productos/${id}`, data)
    return res.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function deleteProducto(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`/productos/${id}`)
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
