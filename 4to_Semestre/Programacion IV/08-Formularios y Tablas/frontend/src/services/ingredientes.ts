import { API_URL, handleResponse } from "./api"
import { Ingrediente, IngredienteCreate, IngredienteUpdate } from "../types/ingrediente"

export async function getIngredientes(): Promise<Ingrediente[]> {
  const res = await fetch(`${API_URL}/ingredientes`)
  return handleResponse<Ingrediente[]>(res)
}

export async function getIngredienteById(id: number): Promise<Ingrediente> {
  const res = await fetch(`${API_URL}/ingredientes/${id}`)
  return handleResponse<Ingrediente>(res)
}

export async function createIngrediente(data: IngredienteCreate): Promise<Ingrediente> {
  const res = await fetch(`${API_URL}/ingredientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return handleResponse<Ingrediente>(res)
}

export async function updateIngrediente(id: number, data: IngredienteUpdate): Promise<Ingrediente> {
  const res = await fetch(`${API_URL}/ingredientes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return handleResponse<Ingrediente>(res)
}

export async function deleteIngrediente(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/ingredientes/${id}`, {
    method: "DELETE",
  })
  return handleResponse<void>(res)
}
