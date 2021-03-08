import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../interfaces/cliente';
import { fetchToken } from '../helpers/fetch';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }

  getClientes(urlQueryParams?:string) {
    return fetchToken(`cliente`, urlQueryParams, 'GET');
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
