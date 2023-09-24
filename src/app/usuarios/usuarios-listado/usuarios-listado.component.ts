import { Component, OnInit } from '@angular/core';
import { UsuariosService } from "../usuarios.service";

@Component({
  selector: 'app-usuarios-listado',
  templateUrl: './usuarios-listado.component.html',
  styleUrls: ['./usuarios-listado.component.css']
})
export class UsuariosListadoComponent implements OnInit {

  constructor(public usuariosService: UsuariosService) {}

  async ngOnInit() {
    console.log("En listado usuarios");
    await this.usuariosService.getUsuarios()
      .subscribe({
        next: res => console.log("Res", res),
        error: e => console.error(e.error.message || "Error al listar usuarios.")
      });
  }


}
