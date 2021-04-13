import { Injectable } from '@angular/core';
import { fetchToken } from '../helpers/fetch';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  constructor() { }

  getPagos(urlQueryParams?:string) {
    return fetchToken(`pago`, urlQueryParams, 'GET');
  }

  findPagos(urlQueryParams?:string, buscar:string = '') {
    return fetchToken(`pago/find/${buscar}`, urlQueryParams, 'GET');
  }

  getPagoById(id:string) {
    return fetchToken(`pago/${id}`, null, 'GET');
  }

  save(pago:any){
    return fetchToken('pago', pago, 'POST');
  }  

  update(pago:any){
    return fetchToken(`pago/${pago.id}`, pago, 'PUT');
  }  

  delete(id:string){
    return fetchToken(`pago/${id}`, {}, 'DELETE');
  }

}
