export interface Ingredient {
  id: number
  nombre: string
  costo: number
  stock: number
  unidad: string
}

export interface IngredientCreate {
  nombre: string
  costo: number
  stock: number
  unidad: string
}

export interface IngredientUpdate {
  nombre?: string
  costo?: number
  stock?: number
  unidad?: string
}

export type Ingrediente = Ingredient
export type IngredienteCreate = IngredientCreate
export type IngredienteUpdate = IngredientUpdate
