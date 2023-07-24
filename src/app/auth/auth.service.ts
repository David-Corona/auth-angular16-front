import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


const API_URL_AUTH = environment.apiURL + "/auth/";

// TODO - mover
interface NuevoUsuario {
  nombre: string;
  email: string;
  password: string;
}
interface UsuarioLogin {
  email: string;
  password: string;
}
interface LoginResponse {
  token: string,
  expiresIn: number,
  usuario_id: number
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string = "";

  constructor(
    private http: HttpClient
  ) { }

  registrar(usuarioInfo: NuevoUsuario) {
    return this.http.post(API_URL_AUTH + "registro", usuarioInfo)
  }

  login(userLogin: UsuarioLogin) {
    return this.http.post<LoginResponse>(API_URL_AUTH + "login", userLogin)
    .subscribe({
      next: (resp: LoginResponse) => {
        this.token = resp.token;
        console.log(resp);
      },
      error: e => {
        console.error(e.error.message || "Error al loguear.");
      }
    })
  }

  getToken() {
    return this.token;
  }

}
