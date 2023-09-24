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
  }

}
