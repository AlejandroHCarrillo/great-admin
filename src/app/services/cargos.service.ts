import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fetchToken } from '../helpers/fetch';
import { CargoItem } from '../interfaces/cargo-item';

@Injectable({
  providedIn: 'root'
})
export class CargosService {

  constructor(private http: HttpClient) { }

  getCargos(urlQueryParams?:string) {
    return fetchToken(`cargo`, urlQueryParams, 'GET');
  }

  async findCargos (buscar:string = '') {
    let retCargos: CargoItem[] = [];
    await fetchToken(`cargo/find/${buscar}`, "", 'GET')
      .then( async (resp) => {
        const body = await resp.json();
  // console.log(body);
        retCargos = body.cargos;
      } );
    return retCargos;
  }

  getCargoById(id:string) {
    return fetchToken(`cargo/${id}`, null, 'GET');
  }

  save(cargo:any){
    return fetchToken('cargo', cargo, 'POST');
  }  

  update(cargo:any){
    return fetchToken(`cargo/${cargo.id}`, cargo, 'PUT');
  }  

  delete(id:string){
    return fetchToken(`cargo/${id}`, {}, 'DELETE');
  }
  
}
