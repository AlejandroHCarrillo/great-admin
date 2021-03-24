import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Alumno } from 'src/app/interfaces/alumno';
import { CargoItem } from 'src/app/interfaces/cargo-item';
import { aMeses, eEstatusCargos } from '../../config/enums';
import { AlumnosListComponent } from '../alumnos/alumnos-list/alumnos-list.component';

@Component({
  selector: 'app-inscripciones',
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.css']
})
export class InscripcionesComponent implements OnInit {
  searchtext: string = "";
  alumnoSelected: any;
  meses = aMeses;
  selectedCurso: any = {};
  cursos: any[] =  [
    {
      id: "xxx",
      code: "KND-M",
      nombre: "Kinder pago mensual",
      descripcion: "Choro de la descripcion del curso y las facilidades de pago",
      costo: 10000,
      intevalopagos: 1,
      numpagos: 12,
      fechaprimerpago: "08-20-2021",
      cargos:[
        { nombre: "Inscripcion", costo: 1000, numpagos: 1, productoid: "11111111" },
        { nombre: "Material", costo: 500, numpagos:1, productoid: "2222222" },
        { nombre: "Colegiatura", costo: (10000/12), numpagos: 12, productoid: "333333" },
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
      fechaprimerpago: "08-20-2021",
      cargos:[
        { nombre: "Inscripcion", costo: 1000, numpagos: 1, productoid: "11111111" },
        { nombre: "Material", costo: 500, numpagos:1, productoid: "2222222" },
        { nombre: "Colegiatura", costo: (9500/6), numpagos: 6, productoid: "333333" },
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
      fechaprimerpago: "08-20-2021",
      cargos:[
        { nombre: "Inscripcion", costo: 1000, numpagos: 1, productoid: "11111111" },
        { nombre: "Material", costo: 500, numpagos:1, productoid: "2222222" },
        { nombre: "Colegiatura", costo: (9000/4), numpagos: 3, productoid: "333333" },
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
      fechaprimerpago: "08-20-2021",
      cargos:[
        { nombre: "Inscripcion", costo: 1000, numpagos: 1, productoid: "11111111" },
        { nombre: "Material", costo: 500, numpagos:1, productoid: "2222222" },
        { nombre: "Colegiatura", costo: (8500/2), numpagos: 2, productoid: "333333" },
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
      fechaprimerpago: "08-20-2021",
      cargos:[
        { nombre: "Inscripcion", costo: 1000, numpagos: 1, productoid: "11111111" },
        { nombre: "Material", costo: 500, numpagos:1, productoid: "2222222" },
        { nombre: "Colegiatura", costo: (8000), numpagos: 1, productoid: "333333" },
      ]
    },
  ]

  cargosalumno: any[] = [];

  constructor(
    private dialogService: DialogService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.selectedCurso = this.cursos[1];
  }

  buildConcepto( cargo: any, index: number=0 ){
    // console.log(cargo);
    let mesini = index * this.selectedCurso.intevalopagos;
    let mesfin = mesini + this.selectedCurso.intevalopagos - 1;

    let periodo = cargo.intevalopagos>1? this.meses[index] : ` ${this.meses[mesini]} - ${this.meses[mesfin]}`

    return cargo.numpagos===1? cargo.nombre : `${cargo.nombre} ${ periodo }`

  }

  calculaFechaVencimiento(index: number){
    let mes = index * this.selectedCurso.intevalopagos;
    return moment(this.selectedCurso.fechaprimerpago).add(mes, "month").format("DD/MMM/YYYY");
  }

  get fechaInicio () {
    let fecha = moment(this.selectedCurso.fechaprimerpago);
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

        this.alumnoSelected = { ...alumno, index:0 };
        if (alumno) {
            this.messageService.add({severity:'info', summary: 'Alumno seleccionado', detail:'matricula:' + alumno.matricula });
        }
    });
  }

  continuarInscripcion(){
    let cargos : any[] = []; 
    cargos = this.generarCargos();
  }

  generarCargos(): any[]{
    if(!this.alumnoSelected){
      console.log("SELECCIONA AL ALUMNO");
      return [];
    }
    let cargos : any[] = [];

    this.selectedCurso.cargos.forEach((element:any) => {
      console.log( element );
      for (let i = 0; i < element.numpagos; i++) {
        let cargo = new CargoItem(
          "", this.alumnoSelected.id, 
          element.productoid, 
          this.buildConcepto(element, i),
          this.calculaFechaVencimiento(i), 
          element.costo, 1, 0, 0, 0, 
          element.costo,
          eEstatusCargos.NO_PAGADO,
          element.producto
        )
        console.log("Cargo ", i, cargo);
        cargos.push(cargo);
      }
    });

    return cargos;
  }

  counter(i: number) {
    return new Array(i);
  }
}
