import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2'

import { REGEXP_EMAIL, REGEXP_RFC, REGEXP_CURP } from '../../../config/settings'
import { SharedService } from 'src/app/services/shared.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlumnosListComponent } from '../../alumnos/alumnos-list/alumnos-list.component';
import { Alumno } from 'src/app/interfaces/alumno';
import { AlumnoViewComponent } from '../../alumnos/alumno-view/alumno-view.component';
@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  editMode: boolean = false;
  clientId: string = "";

  results: string[] = [];
  states: string[] = [];

  form : FormGroup = new FormGroup({});

  alumnoscliente: {
    nombre: string,
    apaterno: string,
    amaterno: string,
    img: string,
    matricula: string,
    id: string
  }[] = [];

  selectedIndex: number = -1;

  private emptyalumno = { 
    index: 0,
    activo: true,
    nombre: "",
    apaterno: "",
    amaterno: "",
    email: "",
    id: "",
    img: "",
  };

  curralumno = this.emptyalumno;
  
  constructor(  private fb: FormBuilder,
                private route: ActivatedRoute,
                private myService :  SharedService,
                private clientesService :  ClientesService,
                private dialogService: DialogService,
                private confirmationService: ConfirmationService,
                private messageService: MessageService  ){}

  ngOnInit() {
    this.clientId = this.route.snapshot.paramMap.get("id") || "";

    if(this.clientId==="new" || this.clientId === ""){
      this.clientId = "";
      this.editMode = true;
    }
    // console.log("this.clientId: ", this.clientId);
    
    this.initFormGroup();
    
    this.myService
     .getEstados()
     .then( ( data : any) => {        
       this.states = data;        
     }); 

   }

  initFormGroup() {
    localStorage.setItem("prevScreen", "cliente");

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

      if(!this.clientId || this.clientId === ""){
        // console.log("Guardando Nuevo Cliente"); 
        this.saveCliente(obj);
      } else {
        // console.log("Actualizando Cliente");
        this.updateCliente(obj);
      }
      

    } catch(e){
      console.log(e);
      Swal.fire({
        title: 'Hubo un error',
        text: 'Error al guardar el cliente' + e,
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
    let originalClient = {
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

    if(this.clientId){
      // console.log("buscando el usuario con el id:", this.clientId);
      this.clientesService.getClienteById(this.clientId)
          .then(async (resp)=>{
            const body = await resp.json();
            // console.log("body: ", body);

            if(!body.ok){
              console.log(body.msg);
              Swal.fire({
                title: 'Error!',
                text:  body.msg, //'El cliente que busca no ha sido encontrado',
                icon: 'error',
                confirmButtonText: 'Continuar'
              });

              this.clientId = "";
              return;
            }

            const cliente = body.cliente;
                    
            if (cliente){
              Object.keys(originalClient).map((x)=>{            
                if(x.toString().includes('fecha')){
                  let Fecha = moment(eval(`cliente.${x}`));
                  eval(`originalClient.${x} = '${ Fecha.format('MM/DD/yyyy')}' `);
                } else if(x.toString().includes('estado')){
                  // console.log(`originalClient.${x} = JSON.parse(cliente.${x})`);
                  eval(`originalClient.${x} = JSON.parse(cliente.${x})`);
                } 
                else {
                  eval(`originalClient.${x} = cliente.${x}`);
                }
              });
            }

            originalClient.estado = JSON.parse(cliente.estado);
            
            this.form.reset(originalClient);

            this.getAlumnosCliente();
          });
    } else {
      // this.form.setValue({
        this.form.reset(originalClient);
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

  private saveCliente(obj:any) {
    this.clientesService.save(obj)
    .then( (resp) => {
      // console.log("La respuesta es: ", resp);
      
      if(resp.ok){
        Swal.fire({
          title: 'Guardar cliente',
          text: 'Se guardo el cliente con exito',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      }         
    });
  }

  private updateCliente(obj:any) {
      obj.id = this.clientId;
      this.clientesService.update(obj)
      .then( (resp) => {
        if(resp.ok){
          Swal.fire({
            title: 'Actualizar cliente',
            text: 'Se actualizo el cliente con exito',
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

  getAlumnosCliente(){
    this.alumnoscliente = [];

    this.clientesService.getAlumnosCliente(this.clientId)
    .then( async (resp) => {
      const body = await resp.json();
      // console.log("body: ", body);
      if(!body.ok){
        console.log(body.msg);
        return;
      }
      // console.log(body.alumnos.map(( x:any )=>( x.alumno )) );
      this.alumnoscliente = body.alumnos.map(( x:any )=>( x.alumno ));
      // console.log(this.alumnoscliente);      
    });
  }

  deleteCartItem(index:number){
    // console.log("delete data", index);

    this.confirmationService.confirm({
      message: '¿En verdad deseas eliminar este registro?',
      accept: () => {
        let scClon = [...this.alumnoscliente];
        this.alumnoscliente = [ ...scClon.splice(0, index), 
                              ...this.alumnoscliente.splice(index+1)
                            ];
        this.selectedIndex = -1;
        }
    });
  }


  showAlumnosList() {
    const ref = this.dialogService.open(AlumnosListComponent, {
      header: 'Seleccione un alumno',
      width: '70%',
      data: {
        searchtext: this.form.value.apaterno
      }
    });

    ref.onClose.subscribe((alumno: Alumno) => {
        // console.log("Alumno seleccionado: ", alumno);
        if (!alumno) return;

        this.curralumno = { ...alumno, index:0 };
        if (alumno) {
            this.messageService.add({severity:'info', summary: 'Alumno seleccionado', detail:'matricula:' + alumno.matricula });
        }
        
        console.log("Iniciando save alumno cliente");        
        this.clientesService.saveAlumnoCliente( this.clientId, alumno.id )
        .then(async(resp)=>{
          
          const body = await resp.json();
          
          if(!body.ok){
            Swal.fire({
              title: 'Error guardando el alumno relacionado al cliente!',
              text:  body.msg,
              icon: 'error',
              confirmButtonText: 'Continuar'
            });            
            return;
          }
          this.alumnoscliente.push({ ...alumno });
        });
    });
  }

  showAlumnoView(alumnoId:string=""){
    // console.log("alumnoId: ", alumnoId);    
    const ref = this.dialogService.open(AlumnoViewComponent, {
      header: 'Perfil del alumno',
      width: '70%',
      data: {
        searchtext: alumnoId
      }
    });
  }

}
