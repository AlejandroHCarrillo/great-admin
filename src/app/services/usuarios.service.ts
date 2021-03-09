import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fetchToken } from '../helpers/fetch';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  getUsuarios(urlQueryParams?:string) {
    return fetchToken(`usuario`, urlQueryParams, 'GET');
  }

  findUsuarios(urlQueryParams?:string, buscar:string = '') {
    return fetchToken(`usuario/find/${buscar}`, urlQueryParams, 'GET');
  }

  getUsuarioById(id:string) {
    return fetchToken(`usuario/${id}`, {}, 'GET');
  }

  save(usuario:any){
    return fetchToken('usuario', usuario, 'POST');
  }  

  update(usuario:any){
    return fetchToken(`usuario/${usuario.id}`, usuario, 'PUT');
  }  

  delete(id:string){
    return fetchToken(`usuario/${id}`, {}, 'DELETE');
  }


}
