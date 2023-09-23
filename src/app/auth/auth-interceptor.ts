import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HTTP_INTERCEPTORS, HttpErrorResponse  } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from "./auth.service";
import { SessionStorageService } from "../_services/session-storage.service";
import { LoginResponse } from "./auth.model";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private tokenIsRefreshing = false; // para evitar multiples requests de refresh token simultaneas

  constructor(
    private storageService: SessionStorageService,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Clonar request y añadir tokens // TODO: añadir cookie solo si es a auth/refreshToken
    const accessToken = this.storageService.getUser()?.accessToken;
    // const isRefreshTokenReq = req.url.includes('auth/refresh-token') ? true : false;
    req = req.clone({
      headers: req.headers.set('Authorization', "Bearer " +  accessToken),
      withCredentials: true
    });

    // Next, a menos que salte error. Y en caso de 401, manejarlo (excepto si es intento de login).
    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !req.url.includes('auth/login')) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.tokenIsRefreshing) {
      this.tokenIsRefreshing = true;

      return this.authService.refreshToken().pipe(
        switchMap((resp: LoginResponse) => {
          this.tokenIsRefreshing = false;
          // Actualiza sesión con usuario y request con accessToken
          this.storageService.saveUser(resp);
          request = request.clone({
            headers: request.headers.set('Authorization', "Bearer " +  resp.accessToken), // añade nuevo accessToken
          });
          return next.handle(request);
        }),
        catchError((error) => {
          this.tokenIsRefreshing = false;
          //f the API returns response with 403 error (the refresh token is expired), emit 'logout' event.
          this.authService.logout();
          return throwError(() => error);
        })
      );
    }

    return next.handle(request);
  }
}
