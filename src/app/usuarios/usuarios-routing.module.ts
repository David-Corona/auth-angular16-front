import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsuariosListadoComponent } from './usuarios-listado/usuarios-listado.component';


const routes: Routes = [
  { path: 'test', component: UsuariosListadoComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
