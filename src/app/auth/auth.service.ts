import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SessionStorageService } from '../_services/session-storage.service';
import { EventBusService } from '../_services/event-bus.service';
import { EventData } from '../_shared/event-data.class';
import { Observable, map } from 'rxjs';


const API_URL_AUTH = environment.apiURL + "/auth/";

// TODO - mover interfaces
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
  accessToken: string,
  // access_token_expires_in: number,
  // refresh_token_expires_in: number
  usuario_id: number
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private token: string = "";
  // private isAuthenticated = false;

  // const httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  // };

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: SessionStorageService,
    private eventBusService: EventBusService
  ) { }

  registrar(usuarioInfo: NuevoUsuario) {
    return this.http.post(API_URL_AUTH + "registro", usuarioInfo)
  }

  login(userLogin: UsuarioLogin) {
    return this.http.post<LoginResponse>(API_URL_AUTH + "login", userLogin)
    .subscribe({
      next: (resp: LoginResponse) => {
        console.log(resp);
        this.storageService.saveUser(resp);
        console.log("SAVE USER: ", this.storageService.getUser());

        this.router.navigate(['/usuarios']); // TODO - Por ejemplo, ya que requiere auth
        // TODO: reload or redirect
        // window.location.reload();

        // const expirationDate = new Date(new Date().getTime() + resp.access_token_expires_in * 1000); // TODO ?

      },
      error: e => {
        console.error(e.error.message || "Error al loguear.");
      }
    })
  }

  autoLogin() {
    // this.refreshToken().subscribe({
    //   next: resp => {
    //     this.storageService.saveUser(resp);
    //     this.router.navigate(['/usuarios']); // TODO
    //   },
    //   error: e => {
    //     if (e.status === 403) {
    //       // this.handleLogout();
    //       // this.eventBusService.emit(new EventData('logout', null)); // TODO: Necesario?
    //       this.router.navigate(['/auth/login']);
    //     }
    //   }
    // });
  }

  refreshToken() {
    return this.http.post(API_URL_AUTH + "refresh-token", null) //  , { withCredentials: true }Añade el cookie con el refreshToken
  }

  logout() {
    const usuario_id = {usuario_id: this.storageService.getUser().usuario_id}
    return this.http.post(API_URL_AUTH + "logout", usuario_id)
      .subscribe({
        next: res => {
          console.log(res);
          this.storageService.clean();
          this.router.navigate(['/auth/login']);
          // reload or relocate // window.location.reload();
        },
        error: err => {
          console.error(err);
        }
      });
  }

  recoverPassword(email: String): Observable<any> {
    return this.http.post<any>(API_URL_AUTH + "forgot-password", {"email": email})
  }

  resetPassword(usuario_id: String, password: String, token: String): Observable<any> {
    return this.http.post<any>(API_URL_AUTH + "reset-password", {usuario_id, password, token})
  }

}
