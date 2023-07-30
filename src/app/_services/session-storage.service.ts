import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';

// Guardamos información del usuario en SessionStorage del navegador.

// en login se está guardando:
// interface LoginResponse {
//   accessToken: string,
//   access_token_expires_in: number,
//   refresh_token_expires_in: number
//   usuario_id: number
// }

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }
}
