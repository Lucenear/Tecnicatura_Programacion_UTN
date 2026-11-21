import { axiosInstance } from "../api/axiosInstance"
import { Categoria, CategoriaCreate, CategoriaUpdate } from "../types/categoria"
import { getErrorMessage } from "./api"

export async function getCategorias(): Promise<Categoria[]> {
  try {
    const res = await axiosInstance.get<Categoria[]>("/categorias")
    return res.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getCategoriaById(id: number): Promise<Categoria> {
  try {
    const res = await axiosInstance.get<Categoria>(`/categorias/${id}`)
    return res.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function createCategoria(data: CategoriaCreate): Promise<Categoria> {
  try {
    const res = await axiosInstance.post<Categoria>("/categorias", data)
    return res.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function updateCategoria(id: number, data: CategoriaUpdate): Promise<Categoria> {
  try {
    const res = await axiosInstance.put<Categoria>(`/categorias/${id}`, data)
    return res.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function deleteCategoria(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`/categorias/${id}`)
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
