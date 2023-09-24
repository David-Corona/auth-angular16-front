import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../auth.service';


export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map(isAuth => {
      if (!isAuth) {
        router.navigate(['auth/login']);
        return false;
      } else {
        return true;
      }
    }),
    catchError((error) => {
      console.log("authGuard Error", error);
      return of(false);
    })
  );
};
