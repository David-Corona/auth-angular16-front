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
  private isRefreshing = false;

  constructor(
    private storageService: SessionStorageService,
    private authService: AuthService,
    private eventBusService: EventBusService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Clonar request y añadir cookie si es a auth/refreshToken
    const accessToken = this.storageService.getUser().accessToken;
    // const isRefreshTokenReq = req.url.includes('auth/refresh-token') ? true : false;
    req = req.clone({
      headers: req.headers.set('Authorization', "Bearer " +  accessToken),
      withCredentials: true
    });

    //handle 401 status on interceptor response (except response of /signin request).
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

    if (!this.isRefreshing) {
      this.isRefreshing = true;

      //if the user is logged in, call AuthService.refreshToken() method.
      if (this.storageService.isLoggedIn()) {
        return this.authService.refreshToken().pipe(
          switchMap((resp: any) => { // TODO, interface loginresponse?
            this.isRefreshing = false;

            // Actualiza sesión y request con nuevo accessToken
            this.storageService.saveUser(resp);
            request = request.clone({
              headers: request.headers.set('Authorization', "Bearer " +  resp.accessToken), // añade nuevo accessToken
            });

            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;

            //f the API returns response with 403 error (the refresh token is expired), emit 'logout' event.
            if (error.status == '403') {
              this.eventBusService.emit(new EventData('logout', null));
            }

            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(request);
  }
}

// export const httpInterceptorProviders = [
//   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
// ];
