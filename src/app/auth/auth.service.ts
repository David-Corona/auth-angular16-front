import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


const API_URL_AUTH = environment.apiURL + "/auth/";

// TODO - mover
interface NuevoUsuario {
  nombre: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }


  registrar(usuarioInfo: NuevoUsuario){
    return this.http.post(API_URL_AUTH + "registro", usuarioInfo)
      // .subscribe({
      //   next: () => this.router.navigate(["/"]),
      //   error: () =>  this.authStatusListener.next(false)
      // });
  }

  // createUser(email: string, password: string) {
  //   const authData: AuthData = {email: email, password: password};
  //   return this.http.post(BACKEND_URL + "signup", authData)
  //     .subscribe({
  //       next: () => this.router.navigate(["/"]),
  //       error: () =>  this.authStatusListener.next(false)
  //     });
  // }

  // register(userInfo: any): Observable<any> {
  //   return this.http.post<any>(`${this.authURL}/register`, userInfo).pipe(
  //     map(resp => resp)
  //   )
  // }

}
