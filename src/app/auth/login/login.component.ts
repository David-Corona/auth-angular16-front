import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UsuarioLogin } from '../auth.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UsuarioLogin = {
    email: "",
    password: ""
  }

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  tryLogin(): void {
    this.authService.login(this.user)
      .subscribe({
        next: () => this.router.navigate(['/usuarios']),
        error: e => {
          console.error("Login error", e);
          this.toastr.error(e.error.message || 'Error al loguear');
        }
      });
  }

}
