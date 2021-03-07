import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2'

import { REGEXP_EMAIL, REGEXP_RFC, REGEXP_CURP } from '../../../config/settings'
import { SharedService } from 'src/app/services/shared.service';
import { ClientesService } from 'src/app/services/clientes.service';
@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  clientId: string = "";

  results: string[] = [];
  states: string[] = [];
  selectedStateCode = {
    "name": "Baja California Sur",
    "code": "ZAC"
  };

  form : FormGroup = new FormGroup({});
  
  constructor(  private fb: FormBuilder,
                private route: ActivatedRoute,
                private myService :  SharedService,
                private clientesService :  ClientesService  ){}

  ngOnInit() {
    this.clientId = this.route.snapshot.paramMap.get("id") || "";

    console.log("this.clientId: ", this.clientId);
    
    this.initFormGroup();

     this.myService
     .getEstados()
     .then( ( data : any) => {        
       this.states = data;        
     }); 

   }

  initFormGroup() {
    this.crearFormulario();
    this.loadFormData();
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
    this.verificaCampos();

    try{
      let obj = {...this.form.value};      
      obj.estado = JSON.stringify(this.form.value.estado);

      if(!this.clientId || this.clientId === ""){
        console.log("Guardando Nuevo Cliente"); 
        this.saveCliente(obj);
      } else {
        console.log("Actualizando Cliente");
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
      console.log("buscando el usuario con el id:", this.clientId);
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
                  console.log(`originalClient.${x} = JSON.parse(cliente.${x})`);
                  // eval(`originalClient.${x} = JSON.parse(cliente.${x})`);
                } 
                else {
                  eval(`originalClient.${x} = cliente.${x}`);
                }
              });
            }

            originalClient.estado = JSON.parse(cliente.estado);
            
            this.form.reset(originalClient);
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
      console.log("La respuesta es: ", resp);
      
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

}
