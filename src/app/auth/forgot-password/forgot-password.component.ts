import { Component, OnInit } from '@angular/core';
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
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  requestReset(): void {
    this.authService.recoverPassword(this.email).subscribe({
      next: () => {
        this.toastr.success('Email enviado correctamente');
        this.router.navigate(['/auth/login']);
      },
      error: e => {
        console.error(e);
        this.toastr.error('Error al enviar el email');
      }
    });
  }

}
