import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

// import { UserLogin } from '../interfaces/user';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: any = { //TODO: Interface
    email: "",
    password: ""
  }

  constructor(
    private titleService: Title,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Login | xxxxx");
    this.resetForm(); // TODO - necesario?
  }

  tryLogin() {
    this.authService.login(this.user)
    // .subscribe({
    //   next: () => {

    //     // this.router.navigate(['/auth/login']);
    //     // this.toastr.success('Cuenta creada correctamente');
    //   },
    //   error: (e: any) => {
    //     console.error(e);
    //     // this.toastr.error('Error: ' + e);
    //   }
    // });
  }

  resetForm() {
    this.user = {
      email: "",
      password: ""
    };
  }

}
