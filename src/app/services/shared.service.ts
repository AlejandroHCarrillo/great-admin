import { Injectable } from '@angular/core';
import { STATES, COLONIAS } from 'src/assets/data/drop-down-lists';
import { DropDownItem } from '../interfaces/drop-down-item';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  getEstados(text : any = "") {
    const promise =  new Promise( (resolve, reject) => {    
      const data:DropDownItem[] = STATES;

      setTimeout( function() {
          resolve(data.filter( (x)=> x.name.toLowerCase().includes(text.toLowerCase() )  ));
          }, 10);
        });
    
        return promise;
      }
             
  getColonias(text : any = "") {
    const promise =  new Promise( (resolve, reject) => {
      const data:string[] = COLONIAS;
      
      setTimeout( function() {
        resolve(data.filter( (x)=> x.toLowerCase().includes(text.toLowerCase() )  ));
      }, 1000);
    });

    return promise;
  }
}
