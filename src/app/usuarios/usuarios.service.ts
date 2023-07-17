import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


const API_URL_USUARIOS = environment.apiURL + "/usuarios/";


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private http: HttpClient
  ) { }

  getUsuarios() {
    return this.http.get(API_URL_USUARIOS);
      // .subscribe(res => {
      //   console.log("En service", res);

      // })
      // .subscribe({
      //   next: (res) => {
      //     console.log(res);
      //     return res
      //   },
      //   error: e => console.error(e)
      // });


  }
}
