import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../auth.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  password: String = "";
  password2: String = "";
  token: String = "";
  usuario_id: String = "";

  constructor(
    private titleService: Title,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Nueva Contraseña | xxxxx");
    this.resetForm(); // TODO
    this.token = this.route.snapshot.paramMap.get('token')!;
    this.usuario_id = this.route.snapshot.paramMap.get('usuario_id')!;
  }

  resetPassword(){
    this.authService.resetPassword(this.usuario_id, this.password, this.token).subscribe({
      next: () => {
        this.toastr.success('Contraseña restablecida correctamente');
        this.router.navigate(['/auth/login']);
      },
      error: e => {
        console.error(e);
        this.toastr.error('Error al actualizar la contraseña');
      }
    });
  }

  validClasses(ngModel: NgModel, validClass: string, errorClass: string) {
    return {
      [validClass]: ngModel.touched && ngModel.valid,
      [errorClass]: ngModel.touched && ngModel.invalid,
    };
  }

  resetForm() {
    this.password = "";
    this.password2 = "";
  }

}
