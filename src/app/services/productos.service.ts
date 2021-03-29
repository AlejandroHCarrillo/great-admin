import { Injectable } from '@angular/core';
import { fetchToken } from '../helpers/fetch';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  getProductos(urlQueryParams?:string) {
    return fetchToken(`producto`, urlQueryParams, 'GET');
  }

  findProductos(urlQueryParams?:string, buscar:string = '') {
    return fetchToken(`producto/find/${buscar}`, urlQueryParams, 'GET');
  }

  getProductoById(id:string) {
    return fetchToken(`producto/${id}`, {}, 'GET');
  }

  save(producto:any){
    return fetchToken('producto', producto, 'POST');
  }  

  update(producto:any){
    return fetchToken(`producto/${producto.id}`, producto, 'PUT');
  }  

  delete(id:string){
    return fetchToken(`producto/${id}`, {}, 'DELETE');
  }
  
}
