import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { NuevoUsuario } from '../auth.model';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit{

  nuevoUsuario: NuevoUsuario = {
    nombre: "",
    email: "",
    password: "",
  }
  passRep: string = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  validClasses(ngModel: NgModel, validClass: string, errorClass: string) {
    return { // sólo valida al ser "tocado"
      [validClass]: ngModel.touched && ngModel.valid,
      [errorClass]: ngModel.touched && ngModel.invalid,
    };
  }

  createAccount(): void {
    this.authService.registrar(this.nuevoUsuario).subscribe({
      next: resp => {
        this.router.navigate(['/auth/login']);
        this.toastr.success(resp.message || 'Cuenta creada correctamente');
      },
      error: e => {
        console.error(e);
        this.toastr.error(e.error.message  || 'Error al crear la cuenta');
      }
    });
  }

}
