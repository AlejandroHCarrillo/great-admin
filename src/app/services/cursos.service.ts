import { Injectable } from '@angular/core';
import { fetchToken } from '../helpers/fetch';

@Injectable({
  providedIn: 'root'
})
export class CursosService {

  constructor() { }

  getCursos(urlQueryParams?:string) {
    return fetchToken(`curso`, urlQueryParams, 'GET');
  }

  findCursos(urlQueryParams?:string, buscar:string = '') {
    return fetchToken(`curso/find/${buscar}`, urlQueryParams, 'GET');
  }

  getCursoById(id:string) {
    return fetchToken(`curso/${id}`, null, 'GET');
  }

  save(curso:any){
    return fetchToken('curso', curso, 'POST');
  }  

  update(curso:any){
    return fetchToken(`curso/${curso.id}`, curso, 'PUT');
  }  

  delete(id:string){
    return fetchToken(`curso/${id}`, {}, 'DELETE');
  }

  addCharge(cargo:any){
    return fetchToken('curso/cargo', cargo, 'POST');
  }

  updateCharge(cargo:any){
    console.log("Servicio de actualizacion");
    return fetchToken(`curso/cargo/${cargo.id}`, cargo, 'PUT');
  }

  removeCharge(id:string){
    return fetchToken(`curso/cargo/${id}`, {}, 'DELETE');
  }

}
