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
import { arraycounter } from 'src/app/helpers/tools'
import { CursosService } from 'src/app/services/cursos.service';

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

  cursos: any[] =  [
    {
      code: "",
      nombre: "Seleccione un curso",
    },
    {
      id: "xxx",
      code: "KND-M",
      nombre: "Kinder pago mensual",
      descripcion: "Choro de la descripcion del curso y las facilidades de pago",
      costo: 10000,
      intevalopagos: 1,
      numpagos: 12,
      fechaprimerpago: "08/01/2021",
      cargos:[
        { nombre: "Inscripcion", costo: 1000, numpagos: 1, producto: { id: "604ae147d7cc5406e4abefc5"} },
        { nombre: "Material", costo: 500, numpagos:1, producto: { id: "6047f1eb33dff3893ce49634" }},
        { nombre: "Colegiatura", costo: (10000/12), numpagos: 12, producto: { id: "6051253243160a4cd086173e" }},
      ]
    },
    {
      id: "xxx",
      code: "KND-B",
      nombre: "Kinder pago bimestral",
      descripcion: "Choro de la descripcion del curso y el X% de descuento y las facilidades de pago",
      costo: 9500,
      intevalopagos: 2,
      numpagos: 6,
      fechaprimerpago: "08/02/2021",
      cargos:[
        { nombre: "Inscripcion", costo: 1000, numpagos: 1, producto: { id: "604ae147d7cc5406e4abefc5"} },
        { nombre: "Material", costo: 500, numpagos:1, producto: { id: "6047f1eb33dff3893ce49634" }},
        { nombre: "Colegiatura", costo: (9500/6), numpagos: 6, producto: { id: "6051253243160a4cd086173e" }},
      ]
    },
    {
      id: "xxx",
      code: "KND-T",
      nombre: "Kinder pago trimestral",
      descripcion: "Choro de la descripcion del curso y el MAYOR % de descuento Y las facilidades de pago",
      costo: 9000,
      intevalopagos: 3,
      numpagos: 4,
      fechaprimerpago: "08/03/2021",
      cargos:[
        { nombre: "Inscripcion", costo: 1000, numpagos: 1, producto: { id: "604ae147d7cc5406e4abefc5"} },
        { nombre: "Material", costo: 500, numpagos:1, producto: { id: "6047f1eb33dff3893ce49634" }},
        { nombre: "Colegiatura", costo: (9000/4), numpagos: 3, producto: { id: "6051253243160a4cd086173e" }},
      ]
    },
    {
      id: "xxx",
      code: "KND-S",
      nombre: "Kinder pago semestral",
      descripcion: "Choro de la descripcion del curso y el MUCHO MEJO % de descuento",
      costo: 8500,
      intevalopagos: 6,
      numpagos: 2,
      fechaprimerpago: "08/04/2021",
      cargos:[
        { nombre: "Inscripcion", costo: 1000, numpagos: 1, producto: { id: "604ae147d7cc5406e4abefc5"} },
        { nombre: "Material", costo: 500, numpagos:1, producto: { id: "6047f1eb33dff3893ce49634" }},
        { nombre: "Colegiatura", costo: (8500/2), numpagos: 2, producto: { id: "6051253243160a4cd086173e" }},
      ]
    },
    {
      id: "xxx",
      code: "KND-A",
      nombre: "Kinder pago anual",
      descripcion: "Choro de la descripcion del curso y MEJOR PORCENTAJE DE DESCUENTO",
      costo: 8000,
      intevalopagos: 1,
      numpagos: 4,
      fechaprimerpago: "08/05/2021",
      cargos:[
        { nombre: "Inscripcion", costo: 1000, numpagos: 1, producto: { id: "604ae147d7cc5406e4abefc5"} },
        { nombre: "Material", costo: 500, numpagos:1, producto: { id: "6047f1eb33dff3893ce49634" }},
        { nombre: "Colegiatura", costo: (8000), numpagos: 1, producto: { id: "6051253243160a4cd086173e" }},
      ]
    },
  ]

  cargosalumno: any[] = [];
  fechaprimerpago: string = "";

  msgs: any;

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
    this.cursosService.getCursos()
    .then(async (resp)=>{
      // console.log(resp);
      const body = await resp.json();
      // console.log(body);

      if(!body.ok){
        // console.log("No hay cursos");
        this.showToastMessage("Cursos", "No hay cursos", eSeverityMessages.error);
        return;        
      }
      this.cursos = body.cursos;
      this.cursoSelected = body.cursos[0];
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
      this.ciclosEscolares = body.ciclosescolares;
      this.cicloSelected = body.ciclosescolares[0];
    });
  }

  buildConcepto( cargo: any, index: number=0 ){
    // console.log(cargo);
    // console.log(this.cicloSelected);
    

    let intevalopagos = this.cursoSelected.intevalopagos || 1;
    let fechaInicio = new Date(this.cicloSelected.fechaInicio);

    let mesini = fechaInicio.getMonth() + (index * intevalopagos);
    if (mesini>11) mesini -= 12;
    let mesfin = mesini + this.cursoSelected.intevalopagos - 1;
    if (mesfin>11) mesfin -= 12;

    let periodo = intevalopagos===1? this.meses[index] : ` ${this.meses[mesini]} - ${this.meses[mesfin]}`

    return cargo.numpagos===1? cargo.nombre : `${cargo.nombre} ${ periodo }`

  }

  calculaFechaVencimiento(index: number){    
    let mes = index * this.cursoSelected.intevalopagos;
    return moment(this.cursoSelected.fechaprimerpago).add(mes, "month").format("MM/DD/YYYY");
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
                                      cicloescolar: this.cicloSelected.id
    }).then(()=>{

      // console.log("Inscripcion realizada con exito");
      this.showToastMessage("Inscripcion", "Inscripcion realizada con exito.", eSeverityMessages.success);

      let cargos : any[] = [];
      cargos = this.generarCargos();
      // console.log("cargos a guardar", cargos);
      // return;
      if(cargos.length>0) {
        this.cargosService.savecargos(cargos)
            .then((resp)=>{
              if(!resp.ok){
                // console.log("Hubo un error al guardar los cargos.");
                this.showToastMessage("Error", "Hubo un error al guardar los cargos.", eSeverityMessages.error);
                return;
              }
              // console.log("Los cargos fueron guardados.", resp);
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
    if(!this.alumnoSelected){
      this.showToastMessage('Atencion', 'Por favor seleccione un alumno', eSeverityMessages.warn)
      this.setfocus("alumnSearch");
      return [];
    }
    let cargos : any[] = [];

    this.cursoSelected.cargos.forEach((element:any) => {
      // console.log( element );
      for (let i = 0; i < element.numpagos; i++) {
        let cargo = new CargoItem(
          "", this.alumnoSelected.id, 
          element.productoid, 
          this.buildConcepto(element, i),
          this.calculaFechaVencimiento(i), 
          element.costo, 1, 0, 0, 0, 
          element.costo,
          eEstatusCargos.NO_PAGADO,
          element.producto.id
        )
        // console.log("Cargo ", i, cargo);
        cargos.push(cargo);
      }
    });

    return cargos;
  }

  setfocus(controlname: string){
    document.getElementsByName(controlname)[0].focus();  
  }

  cursosOnChange(event:any){
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

}
