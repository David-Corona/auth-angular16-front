
export interface NuevoUsuario {
  nombre: string;
  email: string;
  password: string;
}

export interface UsuarioLogin {
  email: string;
  password: string;
}

export interface TokenResponse {
  message: string,
  data: {
    accessToken: string,
    expires_in: number,
    expires_at?: number,
    usuario_id: number
  }
}

export interface ApiResponse {
  success?: boolean,
  message: string,
  data?: {},
  error?: string,
}


