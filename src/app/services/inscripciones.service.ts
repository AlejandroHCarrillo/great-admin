import { Injectable } from '@angular/core';
import { fetchToken } from '../helpers/fetch';

@Injectable({
  providedIn: 'root'
})
export class InscripcionesService {

  constructor() { }

  getInscripciones(urlQueryParams?:string) {
    return fetchToken(`inscripcion`, urlQueryParams, 'GET');
  }

  getInscripcionesReport(urlQueryParams?:string) {
    console.log("OJO: El del id Cliclo est hardcodeado.");
    
    return fetchToken(`inscripcion/report/60611e6d518f1f6074cd2b02`, urlQueryParams, 'GET');
  }

  findInscripciones(urlQueryParams?:string, buscar:string = '') {
    return fetchToken(`inscripcion/find/${buscar}`, urlQueryParams, 'GET');
  }

  getInscripcionById(id:string) {
    return fetchToken(`inscripcion/${id}`, null, 'GET');
  }

  save(inscripcion:any){
    return fetchToken('inscripcion', inscripcion, 'POST');
  }  

  update(inscripcion:any){
    return fetchToken(`inscripcion/${inscripcion.id}`, inscripcion, 'PUT');
  }  

  delete(id:string){
    return fetchToken(`inscripcion/${id}`, {}, 'DELETE');
  }

}
