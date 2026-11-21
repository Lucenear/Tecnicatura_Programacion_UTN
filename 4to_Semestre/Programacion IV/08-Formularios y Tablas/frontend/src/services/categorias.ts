import { API_URL, handleResponse } from "./api"
import { Categoria, CategoriaCreate, CategoriaUpdate } from "../types/categoria"

export async function getCategorias(): Promise<Categoria[]> {
  const res = await fetch(`${API_URL}/categorias`)
  return handleResponse<Categoria[]>(res)
}

export async function getCategoriaById(id: number): Promise<Categoria> {
  const res = await fetch(`${API_URL}/categorias/${id}`)
  return handleResponse<Categoria>(res)
}

export async function createCategoria(data: CategoriaCreate): Promise<Categoria> {
  const res = await fetch(`${API_URL}/categorias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return handleResponse<Categoria>(res)
}

export async function updateCategoria(id: number, data: CategoriaUpdate): Promise<Categoria> {
  const res = await fetch(`${API_URL}/categorias/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return handleResponse<Categoria>(res)
}

export async function deleteCategoria(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/categorias/${id}`, {
    method: "DELETE",
  })
  return handleResponse<void>(res)
}
