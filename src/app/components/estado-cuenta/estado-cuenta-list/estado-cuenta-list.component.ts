import { Component, OnInit } from '@angular/core';
import { getMes } from 'src/app/helpers/tools';
import { DropDownItem } from 'src/app/interfaces/drop-down-item';
import { EstadocuentaService } from 'src/app/services/estadocuenta.service';

@Component({
  selector: 'app-estado-cuenta-list',
  templateUrl: './estado-cuenta-list.component.html',
  styleUrls: ['./estado-cuenta-list.component.css']
})
export class EstadoCuentaListComponent implements OnInit {
  fechafinEC = "2021-04-30T23:59:59.999Z"
  mesesanio : DropDownItem[] = [];
  mesanioSelected : DropDownItem = new DropDownItem(`Abril 2021`, "2021-04");

  alumnosList: any[] = [];  
  estadosCuentaList: any[] = [];

  constructor(public estcuentaservice: EstadocuentaService,
    ) { }

  ngOnInit(): void {
    this.populateEndDate();
    this.getAlumnos();
  }

  getListaEstadosCuenta(){
    //TODO: calcular el dia anterior de la fecha inicial y el ultimo dia del mes
    let urlQueryParams = `?fini=2020-05-30&ffin=2021-04-30`;

    this.estcuentaservice.getResumenEstadoCuentaAlumno(urlQueryParams)
    .then(async(resp)=>{
      const body = await resp.json();
      // console.log(body);
      let estadosCuenta = body.estadoscuenta;

      // console.log(this.alumnosList);

      this.alumnosList.forEach( async (alumno) => {
        let ec = await estadosCuenta.find((x:any)=>( (x.matricula === alumno.matricula) || (parseInt(x.matricula) === parseInt(alumno.matricula)) ));
        // console.log(ec);
        
        this.estadosCuentaList.push({
          ...ec,
          alumno: alumno,
          matricula: alumno.matricula
        });
      });

    });

  }

  sortDataByFolio(a: any, b: any){
    return parseInt(a.folio) < parseInt(b.folio)  ? -1 : 1;
  }

  getAlumnos(){
    this.estcuentaservice.getAlumos()
      .then(async(resp)=>{
        const body = await resp.json();
        // console.log("body: ", body);
        let alumnos: any[] = body.alumnos;

        this.alumnosList = alumnos.map( (x) => ( { 
              nombre: `${ x.nombre } ${x.apellidos}`, 
              matricula: x.matricula, 
              folio: x.folio, 
              hoja: x.hoja
            } ));

        this.getListaEstadosCuenta();
    });
  }

  mesanioChanged(event:any){
    this.fechafinEC = `${event.value.code}-28T23:59:59.999Z`
    // console.log(this.fechafinEC);
    // console.log("this.alumnoSelected.code: ", this.alumnoSelected.code);
  }

  private populateEndDate(){
    let anio = 2020;

    let mesOffset = 6;
    for (let i = 0; i < 13; i++) {
      if ((mesOffset+i)>12) {
        mesOffset = -6;
        anio = anio + 1;
      }
      this.mesesanio.push(
        new DropDownItem(`${ getMes( ( mesOffset + i ).toString() ) } ${anio}`, `${anio}-${ ( ("0" + (mesOffset + i)).substr(-2) ) }`)
      );      
    }
  }


}
