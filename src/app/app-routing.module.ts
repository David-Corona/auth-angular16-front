import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }, // lazy load


  // TODO
  { path: 'usuarios', canActivate: [authGuard], loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule) }

  // TODO
  // { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
