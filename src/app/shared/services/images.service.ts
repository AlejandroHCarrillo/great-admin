import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fetchToken } from '../../helpers/fetch';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private http: HttpClient) { }

  getImages(urlQueryParams?:string) {
    return fetchToken(`imagen`, urlQueryParams, 'GET');
  }

  findImages(urlQueryParams?:string, buscar:string = '') {
    return fetchToken(`imagen/find/${buscar}`, urlQueryParams, 'GET');
  }

  getImageById(id:string) {
    return fetchToken(`imagen/${id}`, {}, 'GET');
  }

  save(imagen:any){
    return fetchToken('imagen', imagen, 'POST');
  }  

  update(imagen:any){
    return fetchToken(`imagen/${imagen.id}`, imagen, 'PUT');
  }  

  delete(id:string){
    return fetchToken(`imagen/${id}`, {}, 'DELETE');
  }


}
