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
  private isAuthenticated = false;

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
        const expirationDate = new Date(new Date().getTime() + resp.expiresIn * 1000);
        this.saveAuthData(this.token, expirationDate, resp.usuario_id)


        this.isAuthenticated = true;
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

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  private saveAuthData(token: string, expirationDate: Date, userId: number) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId.toString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

}
