export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = "Error en la peticion"
    try {
      const data = await res.json()
      if (data && data.detail) {
        if (typeof data.detail === "string") {
          errorDetail = data.detail
        } else if (Array.isArray(data.detail)) {
          errorDetail = data.detail.map((err: { msg?: string }) => err.msg || "Dato invalido").join(", ")
        }
      }
    } catch {
      errorDetail = `Error ${res.status}: ${res.statusText}`
    }
    throw new Error(errorDetail)
  }
  if (res.status === 204) {
    return {} as T
  }
  return res.json()
}
