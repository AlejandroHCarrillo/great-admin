import { Injectable } from '@angular/core';
import { fetchToken } from '../helpers/fetch';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  constructor() { }

  getAlumnos(urlQueryParams?:string) {
    return fetchToken(`alumno`, urlQueryParams, 'GET');
  }

  findAlumnos(urlQueryParams?:string, buscar:string = '') {
    return fetchToken(`alumno/find/${buscar}`, urlQueryParams, 'GET');
  }

  getAlumnoById(id:string) {
    return fetchToken(`alumno/${id}`, null, 'GET');
  }

  save(alumno:any){
    return fetchToken('alumno', alumno, 'POST');
  }  

  update(alumno:any){
    return fetchToken(`alumno/${alumno.id}`, alumno, 'PUT');
  }  

  delete(id:string){
    return fetchToken(`alumno/${id}`, {}, 'DELETE');
  }
  
}
