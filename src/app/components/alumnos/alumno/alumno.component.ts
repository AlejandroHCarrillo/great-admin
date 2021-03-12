import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2'

import { REGEXP_EMAIL, REGEXP_RFC, REGEXP_CURP } from '../../../config/settings'
import { SharedService } from 'src/app/services/shared.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.css']
})
export class AlumnoComponent implements OnInit {
  editMode: boolean = false;
  alumnoId: string = "";

  results: string[] = [];
  states: string[] = [];

  form : FormGroup = new FormGroup({});
  
  constructor(  private fb: FormBuilder,
                private route: ActivatedRoute,
                private myService :  SharedService,
                private alumnosService :  AlumnosService  ){}

  ngOnInit() {
    this.alumnoId = this.route.snapshot.paramMap.get("id") || "";
    
    if(this.alumnoId==="new" || this.alumnoId === ""){
      this.alumnoId = "";
      this.editMode = true;
    }

    // console.log("this.alumnoId: ", this.alumnoId);
    
    this.initFormGroup();
    
    this.myService
     .getEstados()
     .then( ( data : any) => {        
       this.states = data;        
     }); 

   }

  initFormGroup() {
    localStorage.setItem("prevScreen", "alumno");

    this.crearFormulario();
    this.loadFormData();
    this.toggleEdit();
  }

  getFormControl(name: any){
    return this.form.get(name);
  }

  isInvalidControl(name: any){
    const control = this.form.get(name);
    return (!control?.valid && control?.touched);
  }

  submit(){
    console.log("submiting Form...");
    // console.log(this.form.value);
    if(this.form.invalid) {
      this.verificaCampos();
      return;
    }

    try{
      let obj = {...this.form.value};      
      obj.estado = JSON.stringify(this.form.value.estado);

      if(!this.alumnoId || this.alumnoId === ""){
        // console.log("Guardando Nuevo Alumno"); 
        this.saveAlumno(obj);
      } else {
        // console.log("Actualizando Alumno");
        this.updateAlumno(obj);
      }
      

    } catch(e){
      console.log(e);
      Swal.fire({
        title: 'Hubo un error',
        text: 'Error al guardar el alumno' + e,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }

  }

  search( event : any ) {
    this.myService
      .getColonias(event.query)
      .then( ( data : any) => {
        this.results = data;        
    });
  }

  crearFormulario(){
    this.form = this.fb.group({
      activo: [true],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apaterno: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      amaterno: ['', [Validators.maxLength(50)]],

      fechaNacimiento: ['', [Validators.required]],
      // Validators.minLength(12), Validators.maxLength(13), 
      rfc: ['', [Validators.pattern(REGEXP_RFC)]],
      fechaIngreso: ['', [Validators.required]],

      matricula: [''],
      curp: ['', [Validators.pattern(REGEXP_CURP)]],
      sexo: new FormControl('M', Validators.required),

//       direccion: this.fb.group({
//         callenumero: ['', [Validators.required]],
//         colonia: ['', [Validators.required]],

//         municipio: ['', [Validators.required]],
//         estado: ['', [Validators.required]],
//         codigopostal: ['', [Validators.required]],
//       }),
      callenumero: ['', [Validators.required]],
      colonia: ['', [Validators.required]],

      municipio: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      codigopostal: ['', [Validators.required]],

      tcelular: ['', [Validators.required]],
      tcasa: [''],
      ttrabajo: [''],

      email: ['', [Validators.required, Validators.pattern(REGEXP_EMAIL)]],
      notas: ['']
    });
  }

  loadFormData (){
    let originalAlumno = {
      nombre: "",
      apaterno: "",
      amaterno: "", 
      
      fechaNacimiento: "", 
      rfc: "", 
      fechaIngreso: "", 
      
      matricula: "",
      curp: "",
      sexo: "",
      callenumero: "",
      colonia: "",
      
      municipio: "",
      estado: {
        name: "",
        code: ""
      },
      codigopostal: "",
      
      tcelular: "",
      tcasa: "",
      ttrabajo: "",
      
      email: "",
      notas: ""  
    };

    if(this.alumnoId){
      // console.log("buscando el usuario con el id:", this.alumnoId);
      this.alumnosService.getAlumnoById(this.alumnoId)
          .then(async (resp)=>{
            const body = await resp.json();
            // console.log("body: ", body);

            if(!body.ok){
              console.log(body.msg);
              Swal.fire({
                title: 'Error!',
                text:  body.msg, //'El alumno que busca no ha sido encontrado',
                icon: 'error',
                confirmButtonText: 'Continuar'
              });

              this.alumnoId = "";
              return;
            }

            const alumno = body.alumno;
                    
            if (alumno){
              Object.keys(originalAlumno).map((x)=>{            
                if(x.toString().includes('fecha')){
                  let Fecha = moment(eval(`alumno.${x}`));
                  eval(`originalAlumno.${x} = '${ Fecha.format('MM/DD/yyyy')}' `);
                } else if(x.toString().includes('estado')){
                  // console.log(`originalAlumno.${x} = JSON.parse(alumno.${x})`);
                  eval(`originalAlumno.${x} = JSON.parse(alumno.${x})`);
                } 
                else {
                  eval(`originalAlumno.${x} = alumno.${x}`);
                }
              });
            }

            originalAlumno.estado = JSON.parse(alumno.estado);
            
            this.form.reset(originalAlumno);
          });
    } else {
      // this.form.setValue({
        this.form.reset(originalAlumno);
      }
  }

  verificaCampos(form?: any){
    if (!form){
      form = this.form;
    }
    // console.log(this.form);
    if(form.invalid){
      return Object.values( this.form.controls ).forEach( control => {
        if( control instanceof FormGroup ){
          this.verificaCampos(control);
        } else{
          control.markAllAsTouched();
        }
      });
    }
  }

  private saveAlumno(obj:any) {
    this.alumnosService.save(obj)
    .then( (resp) => {
      // console.log("La respuesta es: ", resp);
      
      if(resp.ok){
        Swal.fire({
          title: 'Guardar alumno',
          text: 'Se guardo el alumno con exito',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      }         
    });
  }

  private updateAlumno(obj:any) {
      obj.id = this.alumnoId;
      this.alumnosService.update(obj)
      .then( (resp) => {
        if(resp.ok){
          Swal.fire({
            title: 'Actualizar alumno',
            text: 'Se actualizo el alumno con exito',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
        }         
      });
    }

  toggleEdit(){
    this.editMode = !this.editMode;
    
    if (this.editMode) {
      this.form.disable()
    } else {
      this.form.enable()
    }
  }
  
}
