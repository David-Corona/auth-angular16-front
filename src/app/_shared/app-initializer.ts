import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

// TODO - Eliminar? Al acceder, se hace alguna llamada y empieza el proceso auth, por lo que necesario?
// Se ejecuta al iniciar la app. Intenta autoLogin mediante refreshToken().
export function appInitializer(authService: AuthService) {
  return () => authService.autoLogin();
}
