import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  email: String = "";

  constructor(
    private titleService: Title,
    private authService: AuthService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Contraseña Olvidada | xxxxx");
    this.email = "";
  }


  requestReset(){
    this.authService.recoverPassword(this.email).subscribe({
      next: () => {
        this.toastr.success('Email enviado correctamente');
      },
      error: (e: any) => {
        console.error(e);
        this.toastr.error('Error al enviar el email');
      }
    });
  }

}
