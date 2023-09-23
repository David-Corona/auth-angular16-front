
export interface NuevoUsuario {
  nombre: string;
  email: string;
  password: string;
}

export interface UsuarioLogin {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string,
  expires_in: number,
  expires_at?: number,
  usuario_id: number
}
