import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login | MySite' },
  { path: 'registro', component: RegistroComponent, title: 'Registro | MySite' },
  { path: 'forgot-password', component: ForgotPasswordComponent, title: 'Contraseña olvidada | MySite' },
  { path: 'reset-password/:usuario_id/:token', component: ResetPasswordComponent, title: 'Nueva contraseña | MySite' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
