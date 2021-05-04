import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { company } from 'src/app/config/company';
import { getDropDownOption, getMes, getLastDayOfMonth } from 'src/app/helpers/tools';
import { DropDownItem } from 'src/app/interfaces/drop-down-item';
import { EstadocuentaService } from 'src/app/services/estadocuenta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estado-cuenta-mail',
  templateUrl: './estado-cuenta-mail.component.html',
  styleUrls: ['./estado-cuenta-mail.component.css']
})
export class EstadoCuentaMailComponent implements OnInit {
  moment = moment;
  company = company;
  
  matricula: string = "";
  alumnosList: DropDownItem[] = [];
  alumnoSelected: DropDownItem = new DropDownItem();
  searchtext: string = "";
  searchResultMsg = "";

  alumno: any;
  registros: any[] = [];
  imprimirview = false;

  fechainiEC = "2020-06-01T00:00:00.000Z"
  fechafinEC = "2021-04-30T23:59:59.999Z"
  saldototal = 0;

  mesesanio : DropDownItem[] = [];
  mesanioSelected : DropDownItem = new DropDownItem(`Abril 2021`, "2021-04");

  resumen: any[] = [];

  constructor( public estcuentaservice: EstadocuentaService,
               private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.matricula = this.route.snapshot.paramMap.get("id") || "";

    this.populateEndDate()
    this.getAlumnos();
  }

  getAlumnos(){
    this.estcuentaservice.getAlumos()
      .then(async(resp)=>{
        const body = await resp.json();
        // console.log("body: ", body);
        let alumnos: any[] = body.alumnos;
        this.alumnosList = alumnos.map((x)=>( { name: `${ x.nombre } ${x.apellidos} - ${x.matricula}`, code: x.matricula } ));

        if(this.matricula){
          this.alumnoSelected = getDropDownOption(this.matricula, this.alumnosList)
        } else {
          this.alumnoSelected = this.alumnosList[0]; 
        }
        this.getEstadoCuenta(this.alumnoSelected.code);        
    });
  }

  getEstadoCuenta(matricula:string){
    // console.log("matricula: ", matricula);    
    this.estcuentaservice.getEstadoCuentaAlumno(matricula)
    .then(async(resp)=>{
      const body = await resp.json();

      this.alumno = body.alumno;
      this.registros = body.estadocuenta;

      let ed = new Date(this.fechafinEC).getTime();

      this.registros = [...this.registros.filter( 
        (x)=>{ 
            let time = new Date(x.fecha).getTime();
            return ( time < ed )
         })];

      this.registros.sort(this.comparefechas);

      let saldoanterior = 0;

      for (let i = 0; i < this.registros.length; i++) {
        const element = this.registros[i];        
        element.saldo = saldoanterior + element.cargo - element.abono;
        saldoanterior = element.saldo;
      }

      this.saldototal = saldoanterior;

      this.getResumenEstadoCuenta(matricula);
  });
  }

  getResumenEstadoCuenta(matricula:string){
    // console.log("getResumenEstadoCuenta by matricula: ", matricula);    
    // console.log("matricula: ", matricula);
    // console.log(this.mesanioSelected.code);

    let fini = this.fechainiEC.substring(0,7) + '-01';
    let ffin = getLastDayOfMonth(this.mesanioSelected.code);
    // console.log("ffin: ", ffin);
    
    let urlQueryParams = `fini=${fini}&ffin=${ffin}`;

    this.estcuentaservice.getResumenEstadoCuentaAlumno(matricula, urlQueryParams)
    .then(async(resp)=>{
      
      const body = await resp.json();
      // console.log(body);
      this.resumen = body.resumen;
    });
  }

  alumnoChanged(event:any){
    // console.log(event);
    this.registros = [];
    this.getEstadoCuenta(event.value.code);
  }

  mesanioChanged(event:any){
    this.registros = [];
    this.fechafinEC = `${event.value.code}-28T23:59:59.999Z`
    // console.log(this.fechafinEC);
    // console.log("this.alumnoSelected.code: ", this.alumnoSelected.code);
    this.getEstadoCuenta(this.alumnoSelected.code);
  }

  private comparefechas(a:any, b:any) {
    return moment(a.fecha).diff(b.fecha, "day") < 0 ? -1 : 1;
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

  sendECEmail(){
    const htmlEC = document.getElementById("ecuenta");
    // console.log(htmlEC?.innerHTML.toString());
    
    this.estcuentaservice.enviarCorreo(htmlEC?.innerHTML || "NO HAY CORREO QUE ENVIAR")
    .then( async(resp)=>{
      const body = await resp.json();
      // console.log(body);
      if(body.ok){
        Swal.fire({
          title: 'Estado de cuenta',
          text: 'Se envio con exito con exito',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        return;
      }
      
    } );

  }

  getMonthInt(fecha:any){
    let mes = moment(fecha).format('MM');
    return Number(mes);
  }

  checkMonthChange(index: number){
    // console.log(this.registros.length, index);    
    if(index >= this.registros.length-1){
      return true;
    }

    let fechaProxima = new Date(this.registros[index+1].fecha);
    let fechaActual= new Date(this.registros[index].fecha);
    // console.log(fechaActual.getMonth(), fechaProxima.getMonth());
    
    return fechaActual.getMonth() !== fechaProxima.getMonth();
  }
}
