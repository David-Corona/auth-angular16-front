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

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];


// https://medium.com/@an.sajinsatheesan/refresh-token-interceptor-angular-10-d876d01561be

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {
//   private isRefreshing = false;
//   private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
//     null
//   );

//   constructor(public authService: AuthService) {}

//   intercept( request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     if (this.authService.getJwtToken()) {
//       request = this.addToken(request, this.authService.getJwtToken());
//     }

//     return next.handle(request).pipe(
//       catchError((error) => {
//         if (error instanceof HttpErrorResponse && error.status === 401) {
//           return this.handle401Error(request, next);
//         } else {
//           return throwError(error);
//         }
//       })
//     );
//   }

//   private addToken(request: HttpRequest<any>, token: string) {
//     return request.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   }

//   private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
//     if (!this.isRefreshing) {
//       this.isRefreshing = true;
//       this.refreshTokenSubject.next(null);

//       return this.authService.refreshToken().pipe(
//         switchMap((token: any) => {
//           this.isRefreshing = false;
//           this.refreshTokenSubject.next(token['result'].accessToken);
//           return next.handle(this.addToken(request, token['result'].accessToken));
//         })
//       );
//     } else {
//       return this.refreshTokenSubject.pipe(
//         filter((token) => token != null),
//         take(1),
//         switchMap((jwt) => {
//           return next.handle(this.addToken(request, jwt));
//         })
//       );
//     }
//   }
// }


// export const tokenInterceptor = {
//     provide: HTTP_INTERCEPTORS,
//     useClass: TokenInterceptor,
//     multi: true
//   };
