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

  getPagosByAlumno(id:string) {
    return fetchToken(`pago/alumno/${id}`, 'GET');
  }

  getPagosReport(year:string) {
    return fetchToken(`pago/report/${year}`, null, 'GET');
  }

  getPagosByFormaPagoReport(year:string) {
    return fetchToken(`pago/report/formapago/${year}`, null, 'GET');
  }

  async findPagosPorAlumno(buscar:string = '') {
      let retPagos: any[] = [];
      await fetchToken(`pago/alumno/${buscar}`, "", 'GET')
        .then( async (resp) => {
          const body = await resp.json();
    // console.log(body);
          retPagos = body.pagos;
        } );
      return retPagos;
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
