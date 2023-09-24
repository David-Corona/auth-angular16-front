import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HTTP_INTERCEPTORS, HttpErrorResponse  } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from "./auth.service";
import { SessionStorageService } from "../_services/session-storage.service";
import { TokenResponse } from "./auth.model";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private tokenIsRefreshing = false; // para evitar multiples requests de refresh token simultaneas

  constructor(
    private storageService: SessionStorageService,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Clonar request y añadir tokens
    const accessToken = this.storageService.getUser()?.accessToken;
    req = req.clone({
      headers: req.headers.set('Authorization', "Bearer " +  accessToken),
      withCredentials: true
    });

    // Next, a menos que salte error.
    return next.handle(req).pipe(
      catchError((e) => {
        // En caso de 401 (excepto si es intento de login o refresh token invalido) => refreshToken()
        if (e instanceof HttpErrorResponse && e.status === 401 && e.error.error != "invalid-refreshtoken" && !req.url.includes('auth/login')) {
          return this.handle401Error(req, next);
        }
        return throwError(() => e);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.tokenIsRefreshing) {
      this.tokenIsRefreshing = true;

      return this.authService.refreshToken().pipe(
        switchMap((resp: TokenResponse) => {
          this.tokenIsRefreshing = false;
          // Actualiza sesión con usuario y request con accessToken
          this.storageService.saveUser(resp.data);
          request = request.clone({
            headers: request.headers.set('Authorization', "Bearer " +  resp.data.accessToken), // añade nuevo accessToken
          });
          return next.handle(request);
        }),
        catchError((error) => {
          this.tokenIsRefreshing = false;
          // API returns error (refresh token is expired), logout.
          this.authService.logout()
            .subscribe({
              error: err => console.error("Error al desloguear", err)
            });
          return throwError(() => error);
        })
      );
    }

    return next.handle(request);
  }
}
