import { Injectable } from '@angular/core';
import { fetchToken } from '../helpers/fetch';
import { CicloEscolar } from '../interfaces/cicloescolar';
// import { CicloEscolarItem } from '../interfaces/cicloescolar-item';

@Injectable({
  providedIn: 'root'
})
export class CiclosescolaresService {

  constructor() { }

  getCiclosEscolares(urlQueryParams?:string) {
    return fetchToken(`cicloescolar`, urlQueryParams, 'GET');
  }

  findCiclosEscolares (urlQueryParams?:string, buscar:string = '') {
    return fetchToken(`cicloescolar/find/${buscar}`, "", 'GET');
  }

  getCicloEscolarById(id:string) {
    return fetchToken(`cicloescolar/${id}`, null, 'GET');
  }

  save(cicloescolar:CicloEscolar){
    return fetchToken('cicloescolar', cicloescolar, 'POST');
  }  

  update(cicloescolar:any){
    return fetchToken(`cicloescolar/${cicloescolar.id}`, cicloescolar, 'PUT');
  }  

  delete(id:string){
    return fetchToken(`cicloescolar/${id}`, {}, 'DELETE');
  }
  
}

