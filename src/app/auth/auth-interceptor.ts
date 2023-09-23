import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HTTP_INTERCEPTORS, HttpErrorResponse  } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from "./auth.service";
import { SessionStorageService } from "../_services/session-storage.service";
import { EventBusService } from "../_services/event-bus.service";
import { EventData } from "../_shared/event-data.class";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private tokenIsRefreshing = false; // para evitar multiples requests de refresh token simultaneas

  constructor(
    private storageService: SessionStorageService,
    private authService: AuthService,
    private eventBusService: EventBusService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Clonar request y añadir tokens // TODO:añadir cookie solo si es a auth/refreshToken
    const accessToken = this.storageService.getUser().accessToken;
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
    console.log("Handling 401 error");
    console.log(this.tokenIsRefreshing);
    if (!this.tokenIsRefreshing) {
      this.tokenIsRefreshing = true;
      // console.log("Logged in session", this.storageService.isLoggedIn());
      //if the user is logged in, call AuthService.refreshToken() method.
      // if (this.storageService.isLoggedIn()) {
        return this.authService.refreshToken().pipe(
          switchMap((resp: any) => { // TODO, interface loginresponse?
            this.tokenIsRefreshing = false;

            // this.authService.setAuthenticationStatus(true); // TODO-ObsGuard

            // Actualiza sesión con usuario y request con accessToken
            this.storageService.saveUser(resp);
            request = request.clone({
              headers: request.headers.set('Authorization', "Bearer " +  resp.accessToken), // añade nuevo accessToken
            });

            return next.handle(request);
          }),
          catchError((error) => {
            this.tokenIsRefreshing = false;

            // this.authService.setAuthenticationStatus(false); // TODO-ObsGuard

            //f the API returns response with 403 error (the refresh token is expired), emit 'logout' event.
            // TODO - necesario? llamar logout() directamente
            if (error.status == '403') {
              this.eventBusService.emit(new EventData('logout', null));
            }

            return throwError(() => error);
          })
        );
      // }
    }

    return next.handle(request);
  }
}

// export const httpInterceptorProviders = [
//   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
// ];
