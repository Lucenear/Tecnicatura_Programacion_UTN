import type { Categoria, CategoriaInput } from "../types/categoria";

const API_URL = "http://localhost:8000/categorias";

export async function getCategorias(): Promise<Categoria[]> {
  const response = await fetch(`${API_URL}/`);
  if (!response.ok) {
    throw new Error("Error al obtener las categorias");
  }
  return response.json();
}

export async function getCategoriaById(id: number): Promise<Categoria> {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Error al obtener la categoria");
  }
  return response.json();
}

export async function createCategoria(data: CategoriaInput): Promise<Categoria> {
  const response = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al crear la categoria");
  }
  return response.json();
}

export async function updateCategoria(id: number, data: CategoriaInput): Promise<Categoria> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar la categoria");
  }
  return response.json();
}

export async function deleteCategoria(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error al eliminar la categoria");
  }
}
