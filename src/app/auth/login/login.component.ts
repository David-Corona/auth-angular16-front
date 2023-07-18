import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';


// import { UserLogin } from '../interfaces/user';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: any = { //UserLogin
    email: "",
    password: ""
  }

  constructor(
    private titleService: Title,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Login | xxxxx");
    this.resetForm();
  }

  tryLogin() {
    // this.authService.login(this.user);
  }

  resetForm() {
    this.user = {
      email: "",
      password: ""
    };
  }

}
