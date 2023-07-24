import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
//import { Subscription } from "rxjs";


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit, OnDestroy{

  // TODO: Limpiar codigo
  // Añadir spinner


  // isLoading = false;
  // private authStatusSub!: Subscription;

  // constructor(public authService: AuthService) {}

  // ngOnInit() {
    // this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
    //   authStatus => {
    //     this.isLoading = false;
    //   }
    // );
  // }

  // onSignup(form: NgForm) {
    // if (form.invalid) {
    //   return;
    // }
    // this.isLoading = true;
    // this.authService.createUser(form.value.email, form.value.password);
  // }

  ngOnDestroy() {
    // this.authStatusSub.unsubscribe();
  }


  nuevoUsuario = {
    nombre: "",
    email: "",
    password: "",
  }

  passRep: string = "";

  constructor(
    private titleService: Title,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Registro | xxxxx");
    this.resetForm(); //TODO: Necesario?
  }

  validClasses(ngModel: NgModel, validClass: string, errorClass: string) {
    return { // sólo valida al ser "tocado"
      [validClass]: ngModel.touched && ngModel.valid,
      [errorClass]: ngModel.touched && ngModel.invalid,
    };
  }

  createAccount() {
    this.authService.registrar(this.nuevoUsuario).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
        this.toastr.success('Cuenta creada correctamente');
      },
      error: (e: any) => {
        console.error(e);
        this.toastr.error(e.error.message  || 'Error al crear la cuenta');
      }
    });
  }

  resetForm() {
    this.nuevoUsuario = {
      nombre: "",
      email: "",
      password: "",
    };
  }



}
