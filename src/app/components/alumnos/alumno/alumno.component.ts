import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2'
import { fileUpload } from "../../../helpers/uploadimages";

import { STATES } from 'src/assets/data/drop-down-lists';
import { REGEXP_EMAIL, REGEXP_RFC, REGEXP_CURP } from '../../../config/settings'
import { SharedService } from 'src/app/services/shared.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { DropDownItem } from 'src/app/interfaces/drop-down-item';
@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.css']
})
export class AlumnoComponent implements OnInit {
  editMode: boolean = false;
  showModal: boolean = false;
  alumnoId: string = "";
  alumno: any = {};

  results: string[] = [];
  states: DropDownItem[] = [];
  // states: STATES;

  form : FormGroup = new FormGroup({});

  urlImagen: string = "";
  
  constructor(  private fb: FormBuilder,
                private route: ActivatedRoute,
                private myService :  SharedService,
                private alumnosService :  AlumnosService  ){

                  
                }

  ngOnInit() {
    this.states = STATES;
    // this.myService
    //  .getEstados()
    //  .then( ( data : any) => {        
    //    this.states = data;        
    //  }); 

    this.alumnoId = this.route.snapshot.paramMap.get("id") || "";
    
    if(this.alumnoId==="new" || this.alumnoId === ""){
      this.alumnoId = "";
      this.editMode = true;
    }

    // console.log("this.alumnoId: ", this.alumnoId);
    
    this.initFormGroup();


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
    // if(this.form.invalid) {
    //   this.verificaCampos();
    //   return;
    // }

    try{
      if(!this.alumnoId || this.alumnoId === ""){
        // console.log("Guardando Nuevo Alumno"); 
        this.saveAlumno();
      } else {
        // console.log("Actualizando Alumno");
        this.updateAlumno();
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
      notas: [''],
      img: [this.urlImagen],
      selectedState: ['']
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
      estado: "",
      codigopostal: "",
      
      tcelular: "",
      tcasa: "",
      ttrabajo: "",
      
      email: "",
      img: this.urlImagen,
      notas: "",
      selectedState:  this.setDropDownValue('AGS')
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
            this.alumno = body.alumno;
                    
            if (alumno){
              Object.keys(originalAlumno).map((x)=>{            
                if(x.toString().includes('fecha')){
                  let Fecha = moment(eval(`alumno.${x}`));
                  eval(`originalAlumno.${x} = '${ Fecha.format('MM/DD/yyyy')}' `);
                } else if(x.toString().includes('excepciones')){
                  // console.log(`originalAlumno.${x} = JSON.parse(alumno.${x})`);
                  eval(`originalAlumno.${x} = alumno.${x}`);
                } 
                else {
                  eval(`originalAlumno.${x} = alumno.${x}`);
                }
              });
            }
            originalAlumno.selectedState = this.setDropDownValue(alumno.estado);

            this.form.reset(originalAlumno);
          });
    } else {
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

  private saveAlumno() {
    let obj = {...this.form.value};      
    obj.estado = this.form.value.selectedState.code;
    console.log("guardar: ", obj);
    
    
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
  
  private updateAlumno() {
    let obj = {...this.form.value};      
    obj.estado = this.form.value.selectedState.code;
    obj.id = this.alumnoId;
    
    console.log("guardar: ", obj);
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

  setDropDownValue(code:string) : any {
    return this.states.find((obj : DropDownItem ) => ( obj.code === code ));
  }


  toggleEdit(){
    this.editMode = !this.editMode;
    
    if (this.editMode) {
      this.form.disable()
    } else {
      this.form.enable()
    }
  }

  showUploadImage(){
    // console.log("Mostrar el upload file.");
    document.getElementById('fileSelector')?.click();
  }

  handleFileChange(e:any){
    // console.log("handleFileChange...");
    const file = e.target.files[0];
    if ( file ){
      this.startUploading(file);
    }
  }

  startUploading ( file: any ) {
    Swal.fire({
      title: 'Cargando imagen...', 
      text: 'Por favor espere', 
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
          Swal.showLoading()
      }
    });

    fileUpload(file).then((fileUrl)  => {
      this.alumno.img = fileUrl;
      this.form.value.img = fileUrl;
      this.updateAlumno();
    });
    Swal.close();
  };
  
}
