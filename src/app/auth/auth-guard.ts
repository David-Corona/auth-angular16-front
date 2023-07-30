import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SessionStorageService } from '../_services/session-storage.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const sessionStorage = inject(SessionStorageService)

  // TODO - implementar (equivalente a canDeactive) para no acceder a login/registro si está logueado
  if (sessionStorage.isLoggedIn()) {
    console.log("Guard: Authenticated");
    return true;
  }
  console.log("Guard: Not Authenticated");
  return router.parseUrl('/auth/login');
};


// DEPRECATED
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
// import { Injectable } from "@angular/core";
// import { Observable } from "rxjs";
// import { AuthService } from "./auth.service";

// @Injectable()
// export class AuthGuard implements CanActivate {

//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): boolean | Observable<boolean> | Promise<boolean> {
//     const isAuth = this.authService.getIsAuth();
//     if (!isAuth) {
//       this.router.navigate(['/auth/login']);
//     }
//     return isAuth;
//   }
// }
