import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Alumno } from 'src/app/interfaces/alumno';
import { AlumnosService } from 'src/app/services/alumnos.service';

@Component({
  selector: 'app-alumno-view',
  templateUrl: './alumno-view.component.html',
  styleUrls: ['./alumno-view.component.css']
})
export class AlumnoViewComponent implements OnInit {
  txtbuscar: string = "";
  alumno = {
    id: "",
    activo:  true, 
    nombre:  "", 
    apaterno:  "", 
    amaterno:  "", 
    fechaNacimiento:  true, 
    fechaIngreso:  true, 
    matricula:  "", 
    curp:  "", 
    sexo:  "", 
    callenumero:  "", 
    colonia:  "", 
    municipio:  "", 
    estado:  "", 
    codigopostal:  "", 
    tcelular:  "", 
    tcasa:  "", 
    ttrabajo:  "", 
    email:  "", 
    notas:  "", 
    img:  ""
  };

  constructor(private alumnoService: AlumnosService,
              public ref?: DynamicDialogRef, 
              public config?: DynamicDialogConfig
              ) { }

  ngOnInit(): void {
    this.txtbuscar = this.config?.data.searchtext;
    // console.log("this.txtbuscar: ", this.txtbuscar);
    this.alumnoService.getAlumnoById(this.txtbuscar)
        .then(async(resp)=>{
          // console.log(resp);
          if(resp.ok){
            const body = await resp.json();
            this.alumno = {...body.alumno };
          }
        });
  }

}
