import axios, { isAxiosError } from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
})

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === "string") {
      return detail
    }
    if (Array.isArray(detail)) {
      return detail.map((err: { msg?: string }) => err.msg || "Dato invalido").join(", ")
    }
    return error.response?.data?.message || error.message || "Error en la peticion"
  }
  if (error instanceof Error) {
    return error.message
  }
  return "Error inesperado"
}

export default api
