import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Alumno } from 'src/app/interfaces/alumno';
import { CargoItem } from 'src/app/interfaces/cargo-item';
import { CargosService } from 'src/app/services/cargos.service';
import { CiclosescolaresService } from 'src/app/services/ciclosescolares.service';
import { InscripcionesService } from 'src/app/services/inscripciones.service';
import { aMeses, eEstatusCargos, eSeverityMessages } from '../../config/enums';
import { AlumnosListComponent } from '../alumnos/alumnos-list/alumnos-list.component';
import { arraycounter, getMes } from 'src/app/helpers/tools'
import { CursosService } from 'src/app/services/cursos.service';
import { Curso } from 'src/app/interfaces/curso';

@Component({
  selector: 'app-inscripciones',
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.css']
})
export class InscripcionesComponent implements OnInit {
  counter = arraycounter;

  searchtext: string = "";
  alumnoSelected: any;
  inscripcionesAlumno: any[] = [];
  meses = aMeses;
  cursoSelected: any = null;

  ciclosEscolares: any[] = [];
  cicloSelected: any;

  cursos: Curso[] =  [];

  cargosalumno: any[] = [];
  fechaprimerpago: string = "";

  msgs: any;

  baseCobro = 0;

  constructor(
    private dialogService: DialogService,
    private messageService: MessageService,
    private cargosService: CargosService,
    private ciclosService: CiclosescolaresService,
    private inscripcionesService: InscripcionesService,
    private cursosService: CursosService
  ) { }

  ngOnInit(): void {
    // this.selectedCurso = this.cursos[1];
    // this.setfocus("alumnSearch");
    // this.fechaprimerpago = "03/03/2021"
    this.loadCiclosEscolares();
    this.loadCursos();
  }


  loadCursos(){
    this.cursosService.getCursos("activo=true")
    .then(async (resp)=>{
      // console.log(resp);
      const body = await resp.json();
      // console.log(body);

      if(!body.ok){
        // console.log("No hay cursos");
        this.showToastMessage("Cursos", "No hay cursos", eSeverityMessages.error);
        return;        
      }
      let arrCursos : any[] = body.cursos;

      // console.log(arrCursos);
      
      this.cursos = [ { code: "", nombre: "Seleccione un curso" },
                      ...arrCursos.filter((x)=>(x.activo==true)) ] ;
      // this.cursoSelected = body.cursos[0];
    });
  }

  loadCiclosEscolares(){
    this.ciclosService.getCiclosEscolares()
    .then(async (resp)=>{
      // console.log(resp);
      const body = await resp.json();
      // console.log(body);

      if(!body.ok){
        // console.log("No hay ciclos escolares");
        this.showToastMessage("Ciclos escolares", "No hay ciclos escolares para realizar inscripciones", eSeverityMessages.error);
        return;        
      }
      let ciclos: any[] = body.ciclosescolares;

      this.ciclosEscolares = [ { nombre:"Seleccione un ciclo", code:"" }, ...ciclos.filter((x)=>(x.activo===true)) ];
      // this.cicloSelected = body.ciclosescolares[0];
    });
  }

  buildConcepto( cargo: any, index: number=0, fechavencimiento: string = "" ){
    // console.log("fechavencimiento: ", fechavencimiento);
    
    let intervalopagos = cargo.intervalopagos || 1;
    let fechaInicio = new Date(this.cicloSelected.fechaInicio);
    
    let mesini = fechaInicio.getMonth() + (index * intervalopagos);
    if (mesini>11) mesini -= 12;
    let mesfin = mesini + cargo.intervalopagos - 1;
    if (mesfin>11) mesfin -= 12;
    
    let periodo = intervalopagos===1? this.meses[index] : ` ${this.meses[mesini]} - ${this.meses[mesfin]}`
    let concepto = `${cargo.nombre}`;

    if(cargo.tipocargo === "COLEGIATURA"){
      let mes = getMes(moment(fechavencimiento).format("MM"));

      concepto = `${cargo.tipocargo} ${ mes }  ${ moment(fechavencimiento).format("YYYY") }.`
      if(this.alumnoSelected.beca>0) concepto = `${concepto} Beca: ${this.alumnoSelected.beca}% `
      if(this.alumnoSelected.prestacion>0) concepto = `${concepto} Prestacion: ${this.alumnoSelected.prestacion}% `
      if(this.alumnoSelected.apoyo>0) concepto = `${concepto} Apoyo: ${this.alumnoSelected.apoyo}% `        
    }

    return concepto
    // return cargo.numpagos===1? concepto : `${concepto} ${ periodo }`

  }

  calculaFechaVencimiento(index: number, intervalopagos: number, tipocargo: string ){    
    let mes = index * intervalopagos;
    if(tipocargo === "COLEGIATURA"){
      mes += 1;
    }

    let yearini = new Date(this.cicloSelected.fechaInicio).getFullYear();
    let strFecha = `${yearini}-${String(this.cursoSelected.fechaprimerpago).substring(5, 10)}`;
    // console.log("->", strFecha);
    // console.log(strFecha);
    // console.log(fecha);
    let fecha = moment(strFecha).add(mes, "month").format("MM/DD/YYYY");
    
    return fecha;
  }

  showAlumnosList() {
    const ref = this.dialogService.open(AlumnosListComponent, {
      header: 'Seleccione un alumno',
      width: '70%',
      data: {
        searchtext: this.searchtext
      }
    });

    ref.onClose.subscribe((alumno: Alumno) => {
        // console.log("Alumno seleccionado: ", alumno);
        if (!alumno) return;

        this.searchtext = alumno.nombre;
        this.alumnoSelected = { ...alumno, index:0 };
    //  this.messageService.add({severity:'info', summary: 'Alumno seleccionado', detail:'matricula:' + alumno.matricula });
        let nombrecompleto = `${alumno.matricula || "" }  - ${alumno.nombre} ${alumno.apaterno}`
        
        this.baseCobro = this.calculaFactorDescuento();

        this.showToastMessage("Alumno seleccionado", nombrecompleto, eSeverityMessages.info);
        this.buscarInscripciones(alumno.id);
    });
  }

  continuarInscripcion(){
    
    if( this.isEnrolled(this.cicloSelected.id) ){
      // console.log("El alumno ya esta inscrito en este ciclo escolar");
      this.showToastMessage("Error", "El alumno ya esta inscrito en este ciclo escolar.", eSeverityMessages.error);
      return;
    }

    this.inscripcionesService.save({  alumno: this.alumnoSelected.id,
                                      cicloescolar: this.cicloSelected.id,
                                      ciclo: this.cicloSelected.nombre,
                                      matricula: this.alumnoSelected.matricula,
                                      nivel: this.alumnoSelected.nivel,
                                      grado: this.alumnoSelected.grado
    }).then(async(resp)=>{

      const body = await resp.json();
      // console.log(body);

      if(!body.ok){
        // console.log("Hubo un error al guardar los cargos.");
        this.showToastMessage("Error", "Hubo un error al guardar los cargos.", eSeverityMessages.error);
        return;
      }

      // console.log("Inscripcion realizada con exito");
      this.showToastMessage("Inscripcion", "Inscripcion realizada con exito.", eSeverityMessages.success);

      let cargos : any[] = [];
      cargos = this.generarCargos();

      if(cargos.length>0) {
        this.cargosService.savecargos(cargos)
            .then(async(resp)=>{
              // console.log("Los cargos fueron guardados.", resp);

              const body = await resp.json();
              // console.log(body);

              if(!body.ok){
                // console.log("Hubo un error al guardar los cargos.");
                this.showToastMessage("Error", "Hubo un error al guardar los cargos.", eSeverityMessages.error);
                return;
              }
              
              this.showToastMessage("Cargos guardados", 
                                    `Los ${ cargos.length } cargos a ${ this.alumnoSelected.nombre } fueron guardados con exito`, 
                                    eSeverityMessages.success);
              
              this.alumnoSelected = null;
              this.cursoSelected = null;
              this.searchtext = "";
              this.setfocus("alumnSearch");
              
            }).catch((err)=>{
              // console.log("Hubo un error al guardar los cargos", err);
              this.showToastMessage("Error", "Hubo un error al guardar los cargos.", eSeverityMessages.error);
            });
      }

    });


  }

  generarCargos(): any[]{
    console.log("generarCargos...");
    
    if(!this.alumnoSelected){
      this.showToastMessage('Atencion', 'Por favor seleccione un alumno', eSeverityMessages.warn)
      this.setfocus("alumnSearch");
      return [];
    }
    let cargos : any[] = [];

    this.cursoSelected.cargos.forEach((cargoelement:any) => {
      for (let i = 0; i < cargoelement.numpagos; i++) {
        console.log("cargoelement", cargoelement);
        let factor = 1;

        if(cargoelement.tipocargo === "COLEGIATURA"){
          factor = this.baseCobro;
        }

        let fechaVencimiento = this.calculaFechaVencimiento(i, cargoelement.intervalopagos, cargoelement.tipocargo) || ""

        let cargo = new CargoItem(
          "", this.alumnoSelected.id,
          // element.productoid, 
          this.buildConcepto( cargoelement, i, fechaVencimiento ),
          fechaVencimiento, 
          cargoelement.precio, 
          1,
          cargoelement.tasaIVA, 
          (factor * cargoelement.precio * cargoelement.tasaIVA), 
          ((1-factor) * cargoelement.precio ),
          factor * cargoelement.monto,
          eEstatusCargos.NO_PAGADO,
          cargoelement.tipocargo
          // element.producto.id || ""
        )
        console.log("Cargo ", i, cargo);
        cargos.push(cargo);
      }
    });

    return cargos;
  }

  calculaFactorDescuento(){
    let factor = 1;

    if(this.alumnoSelected.beca > 0) factor *= (1 - this.alumnoSelected.beca/100);
    if(this.alumnoSelected.prestacion > 0) factor *= (1 - this.alumnoSelected.prestacion/100);
    if(this.alumnoSelected.apoyo > 0) factor *= (1 - this.alumnoSelected.apoyo/100);

    return factor;
  }

  setfocus(controlname: string){
    document.getElementsByName(controlname)[0].focus();  
  }

  cursosOnChange(event:any){
    console.log("cursosOnChange...");
    
    this.fechaprimerpago = event.value.fechaprimerpago;
  }

  showToastMessage(title: string = "", text: string = "", tipo: string = "success"){
    this.messageService.add( {
            key: 'tmKey', 
            severity: tipo || 'success', 
            summary: title || 'Titulo', 
            detail: `${text}` || 'Texto'});
  }

  buscarInscripciones(id:string){
    this.inscripcionesService.findInscripciones("", id)
        .then(async (resp)=>{
          const body = await resp.json();
          this.inscripcionesAlumno = body.inscripciones;          
        });
  }

  isEnrolled(cicloId: string): boolean{
    return !!this.inscripcionesAlumno.find((x) => ( x.cicloescolar.id === cicloId ) );
  }

  getfactorBaseCobro(tipocargo: string): number{
    // console.log(tipocargo);
    if(tipocargo==='COLEGIATURA') return this.baseCobro;

    return 1;
  }
}
