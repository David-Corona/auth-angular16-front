import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SessionStorageService } from '../_services/session-storage.service';
import { catchError, map, of } from 'rxjs';

// export const authGuard22 = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);
//   const sessionStorage = inject(SessionStorageService);

//   // TODO - returns comentados por lo que no hace nada actualmente.
//   if (sessionStorage.isLoggedIn()) { // TODO - isLoggedIn() ok aqui?
//     console.log("Guard: Authenticated");
//     // return true;
//   }
//   console.log("Guard: NOT Authenticated");
//   // return router.parseUrl('/auth/login');
//   return true;

//   // router.navigate(['/auth/login']);
//   // return false; // Prevent access to the protected route
// };

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe( //getAuthenticationStatus
    map(isAuth => {
      console.log("isAuth: ", isAuth);
      if (!isAuth) {
        router.navigate(['auth/login']);
        console.log("Auth FALSE");
        return false;
      } else {
        console.log("Auth TRUE");
        return true;
      }
    }),
    catchError((error) => {
      console.log(error);
      return of(false);
    })
  );
};

// TODO-ObsGuard
// export const authGuard = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   console.log("Guard");
//   return authService.getAuthenticationStatus().pipe(
//     map((isAuthenticated) => {
//       console.log(isAuthenticated);
//       if (isAuthenticated) {
//         console.log("Guard: Authenticated");
//         return true;
//       } else {
//         // router.navigate(['/auth/login']);
//         console.log("Guard: NOT Authenticated");
//         return false;
//       }
//     }), catchError(
//       err => {
//         return of(false);
//       }
//     )
//   );
// };
