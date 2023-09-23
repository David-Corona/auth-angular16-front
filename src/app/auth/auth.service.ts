import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SessionStorageService } from '../_services/session-storage.service';
import { EventBusService } from '../_services/event-bus.service';
import { EventData } from '../_shared/event-data.class';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, throwError } from 'rxjs';


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
  expires_in: number,
  expires_at?: number,
  usuario_id: number
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // TODO-ObsGuard
  private authenticationStatus = new BehaviorSubject<boolean>(false);

  // private token: string = "";
  // private isAuthenticated = false;

  // const httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  // };

  // private refreshTokenInProgress = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: SessionStorageService,
    private eventBusService: EventBusService
  ) { }

  // TODO-ObsGuard
  setAuthenticationStatus(status: boolean) {
    this.authenticationStatus.next(status);
  }
  getAuthenticationStatus() {
    return this.authenticationStatus.asObservable();
  }

  registrar(usuarioInfo: NuevoUsuario) {
    return this.http.post(API_URL_AUTH + "registro", usuarioInfo)
  }

  login(userLogin: UsuarioLogin) {
    return this.http.post<LoginResponse>(API_URL_AUTH + "login", userLogin)
    .subscribe({
      next: (resp: LoginResponse) => {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        resp.expires_at = currentTimestamp + resp.expires_in;
        this.storageService.saveUser(resp);
        console.log("SAVE USER: ", this.storageService.getUser());

        this.setAuthenticationStatus(true); // TODO-ObsGuard

        this.router.navigate(['/usuarios']); // TODO - Por ejemplo, ya que requiere auth
        // TODO: reload or redirect
        // window.location.reload();
      },
      error: e => {
        console.error(e.error.message || "Error al loguear.");
      }
    })
  }

  isAuthenticated(): Observable<boolean> {
    const token = this.storageService.getUser().accessToken;

    if (token && this.isTokenValid()) {
      console.log("isAuthenticated() - True");
      return of(true);
    } else {
      return this.refreshToken().pipe(
        switchMap(resp => {
          console.log("Refreshed Token: ", resp);
          this.storageService.saveUser(resp);
          return of(true);
        }),
        catchError(e => {
          console.log("isAuthenticated() - False");
          console.error(e);
          return of(false);
        })
      );
    }
  }

  isTokenValid(): boolean {
    console.log("isTokenValid()");
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

  refreshToken() {
    return this.http.post(API_URL_AUTH + "refresh-token", null) //  , { withCredentials: true }Añade el cookie con el refreshToken
  }

  logout() {
    const usuario_id = {usuario_id: this.storageService.getUser().usuario_id}
    console.log("Logout() - usuario: ", usuario_id);
    return this.http.post(API_URL_AUTH + "logout", usuario_id)
      .subscribe({
        next: res => {
          console.log(res);
          this.storageService.clean();
          this.router.navigate(['/auth/login']);
          // reload or relocate // window.location.reload();
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
