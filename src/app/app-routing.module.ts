import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { noAuthGuard } from './auth/guards/no-auth.guard';


const routes: Routes = [
  { path: 'auth', canActivate: [noAuthGuard], loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }, // lazy load

  // TODO - Modulo testeo zona interna
  { path: 'usuarios', canActivate: [authGuard], loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule) },

  // TODO
  // { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  // { path: '**', redirectTo: '/inicio', pathMatch: 'full' } // URL incorrecta
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
