import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SessionStorageService } from '../_services/session-storage.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const sessionStorage = inject(SessionStorageService)

  // TODO - returns comentados por lo que no hace nada actualmente.
  if (sessionStorage.isLoggedIn()) { // TODO - isLoggedIn() ok aqui?
    console.log("Guard: Authenticated");
    // return true;
  }
  console.log("Guard: Not Authenticated");
  // return router.parseUrl('/auth/login');
  return true;
};
