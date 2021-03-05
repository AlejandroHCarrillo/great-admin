import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../interfaces/cliente';
// import {  } from "../../data/clientes.json";

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }

  getClientes(text:any = "" ) {
    const promise =  new Promise( (resolve, reject) => {
      let data = [
        {
          "id": "adfsdfsdf",
          "Nombre":"ABASCAL SEPTIEN CARLOS",
          "APaterno":"ABASCAL",
          "AMaterno":"SEPTIEN",
          "NOMBREC":"CARLOS",
          "Activo":1
       },
       {
          "id": "wefsd",
          "Nombre":"ABOITES DAVILA RACHEL",
          "APaterno":"ABOITES",
          "AMaterno":"DAVILA",
          "NOMBREC":"RACHEL",
          "Activo":1
       },
       {
          "id": "ghsd",
          "Nombre":"ABURTO PARRA PATRICIA",
          "APaterno":"ABURTO",
          "AMaterno":"PARRA",
          "NOMBREC":"PATRICIA",
          "Activo":1
       },
       {
        "id": "iyuytf",
        "Nombre":"ACEVEDO FRAGOSO RUBEN",
          "APaterno":"ACEVEDO",
          "AMaterno":"FRAGOSO",
          "NOMBREC":"RUBEN",
          "Activo":1
       },
       {
        "id": "zdsrefv",
        "Nombre":"ACEVEDO QUINTERO MARIA DOLORES",
          "APaterno":"ACEVEDO",
          "AMaterno":"QUINTERO",
          "NOMBREC":"MARIA DOLORES",
          "Activo":1
       },
       {
        "id": "wscvgy",
        "Nombre":"ACEVEDO ZETINA ALVARO",
          "APaterno":"ACEVEDO",
          "AMaterno":"ZETINA",
          "NOMBREC":"ALVARO",
          "Activo":1
       },
       {
        "id": "hgfdcvbn",
        "Nombre":"ACEVES GONZALEZ MARIA CANDELARIA",
          "APaterno":"ACEVES",
          "AMaterno":"GONZALEZ",
          "NOMBREC":"MARIA CANDELARIA",
          "Activo":1
       },
       {
        "id": "hgfc",
        "Nombre":"ACOLTZI ALCAZAR PIEDAD ROSA",
          "APaterno":"ACOLTZI",
          "AMaterno":"ALCAZAR",
          "NOMBREC":"PIEDAD ROSA",
          "Activo":1
       },
       {
        "id": "erhjnbv",
        "Nombre":"ACOSTA ESPARZA HECTOR",
          "APaterno":"ACOSTA",
          "AMaterno":"ESPARZA",
          "NOMBREC":"HECTOR",
          "Activo":1
       },
       {
        "id": ",kjhbvd",
        "Nombre":"ACOSTA GALICIA JAVIER",
          "APaterno":"ACOSTA",
          "AMaterno":"GALICIA",
          "NOMBREC":"JAVIER",
          "Activo":1
       },
       {
        "id": "dffhfsdcv",
        "Nombre":"ACOSTA SEGURA JUAN MANUEL",
          "APaterno":"ACOSTA",
          "AMaterno":"SEGURA",
          "NOMBREC":"JUAN MANUEL",
          "Activo":1
       },
       {
        "id": "thjnbvf",
        "Nombre":"AGUILA CASANOVA JOSE CARLOS",
          "APaterno":"AGUILA",
          "AMaterno":"CASANOVA",
          "NOMBREC":"JOSE CARLOS",
          "Activo":1
       },
       {
        "id": "fdghgdc",
        "Nombre":"AGUILAR ALMAZAN ROSALIO LUIS",
          "APaterno":"AGUILAR",
          "AMaterno":"ALMAZAN",
          "NOMBREC":"ROSALIO LUIS",
          "Activo":1
       },
       {
        "id": "kjbvd",
        "Nombre":"AGUILAR BALBUENA GUILLERMINA ESTELA",
          "APaterno":"AGUILAR",
          "AMaterno":"BALBUENA",
          "NOMBREC":"GUILLERMINA ESTELA",
          "Activo":1
       },

                  ];

      setTimeout( function() {
          // resolve(data.filter( (x)=> x.Nombre.toLowerCase().includes(text.toLowerCase() )  ));
          resolve(data);
          }, 1000);
        });
    
        return promise;
      }

}
