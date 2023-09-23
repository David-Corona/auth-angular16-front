import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, switchMap, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { SessionStorageService } from '../_services/session-storage.service';
import { LoginResponse, NuevoUsuario, UsuarioLogin } from './auth.model';

const API_URL_AUTH = environment.apiURL + "/auth/";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: SessionStorageService,
  ) { }


  registrar(usuarioInfo: NuevoUsuario) {
    return this.http.post(API_URL_AUTH + "registro", usuarioInfo)
  }

  login(userLogin: UsuarioLogin) {
    return this.http.post<LoginResponse>(API_URL_AUTH + "login", userLogin)
    .subscribe({
      next: (resp: LoginResponse) => {
        // Añadir hora de expiracion al accessToken
        const currentTimestamp = Math.floor(Date.now() / 1000);
        resp.expires_at = currentTimestamp + resp.expires_in;
        this.storageService.saveUser(resp);
        this.router.navigate(['/usuarios']); // TODO - reload or redirect
      },
      error: e => {
        console.error(e.error.message || "Error al loguear.");
      }
    })
  }

  isAuthenticated(): Observable<boolean> {
    const token = this.storageService.getUser()?.accessToken;
    if (token && this.isTokenValid()) {
      return of(true);
    } else {
      return this.refreshToken().pipe(
        switchMap((resp: LoginResponse) => {
          this.storageService.saveUser(resp);
          return of(true);
        }),
        catchError(e => {
          console.error(e);
          return of(false);
        })
      );
    }
  }

  private isTokenValid(): boolean {
    const loggedUser = this.storageService.getUser();
    if (!loggedUser || !loggedUser.expires_at) {
      return false;
    }
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (loggedUser.expires_at > currentTimestamp) {
      return true;
    }
    return false;
  }

  refreshToken(): Observable<any> {
    return this.http.post(API_URL_AUTH + "refresh-token", null) //  , { withCredentials: true }Añade el cookie con el refreshToken
  }

  logout() {
    const usuario_id = {usuario_id: this.storageService.getUser()?.usuario_id}
    return this.http.post(API_URL_AUTH + "logout", usuario_id)
      .subscribe({
        next: () => {
          this.storageService.clean();
          this.router.navigate(['/auth/login']);
        },
        error: err => console.error(err)
      });
  }

  recoverPassword(email: String): Observable<any> {
    return this.http.post<any>(API_URL_AUTH + "forgot-password", {"email": email})
  }

  resetPassword(usuario_id: String, password: String, token: String): Observable<any> {
    return this.http.post<any>(API_URL_AUTH + "reset-password", {usuario_id, password, token})
  }

}
