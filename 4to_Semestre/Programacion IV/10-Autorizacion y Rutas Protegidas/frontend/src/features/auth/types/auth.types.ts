export interface UsuarioAuth {
  id: number
  nombre: string
  apellido: string
  email: string
  celular?: string | null
  roles: string[]
  created_at?: string | null
  updated_at?: string | null
  deleted_at?: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  nombre: string
  apellido: string
  email: string
  celular?: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}
