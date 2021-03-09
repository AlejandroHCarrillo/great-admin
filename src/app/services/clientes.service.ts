import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fetchToken } from '../helpers/fetch';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }

  getClientes(urlQueryParams?:string) {
    return fetchToken(`cliente`, urlQueryParams, 'GET');
  }

  findClientes(urlQueryParams?:string, buscar:string = '') {
    return fetchToken(`cliente/find/${buscar}`, urlQueryParams, 'GET');
  }

  getClienteById(id:string) {
    return fetchToken(`cliente/${id}`, {}, 'GET');
  }

  save(cliente:any){
    return fetchToken('cliente', cliente, 'POST');
  }  

  update(cliente:any){
    return fetchToken(`cliente/${cliente.id}`, cliente, 'PUT');
  }  

  delete(id:string){
    return fetchToken(`cliente/${id}`, {}, 'DELETE');
  }


}
