import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';


export function appInitializer(authService: AuthService) {
  return () => authService.autoLogin();
}
