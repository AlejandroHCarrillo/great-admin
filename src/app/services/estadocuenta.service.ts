import { Injectable } from '@angular/core';
import { fetchToken } from '../helpers/fetch';

@Injectable({
  providedIn: 'root'
})
export class EstadocuentaService {

  constructor() { }

  getAlumos() {
    return fetchToken(`estadocuenta/alumnos`, "", 'GET');
  }

  getEstadoCuentaAlumno(matricula: string) {
    // console.log(matricula);
    return fetchToken(`estadocuenta/alumno/${matricula}`, "", 'GET');
  }

  getResumenEstadoCuentaAlumno(matricula: string, urlQueryParams?:string) {
    // console.log("getResumenEstadoCuentaAlumno", matricula);
    return fetchToken(`estadocuenta/resumen/${matricula}`, urlQueryParams, 'GET');
  }

  getListaEstadoCuentaAlumno(urlQueryParams?:string) {
    // console.log("getResumenEstadoCuentaAlumno", matricula);
    return fetchToken(`estadocuenta/lista/`, urlQueryParams, 'GET');
  }

  enviarCorreo(emailHTMLBody:string){
    // to: "baltadelarosau@gmail.com",
    let objEmail = 
      {
        from: "ignaciojaimes976@gmail.com",
        to: "el_grande_ahc@hotmail.com",
        cc: "gabypin76@hotmail.com",
        cco: "ahernandez.dotcom@gmail.com",
        subject: "Estado de cuenta",
        html: emailHTMLBody
      }

      return fetchToken(`correo`, objEmail, 'POST');

  }

}
