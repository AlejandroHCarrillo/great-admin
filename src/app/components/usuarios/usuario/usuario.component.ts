import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2'

import { REGEXP_EMAIL, REGEXP_RFC, REGEXP_CURP } from '../../../config/settings'
import { UsuariosService } from 'src/app/services/usuarios.service';
import { DropDownItem } from 'src/app/interfaces/drop-down-item';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  editMode: boolean = false;
  usuarioId: string = "";
  passwordconfirmation: boolean = false;

  roles: DropDownItem[] = [
    { name: 'Administrador', code: 'ADMIN_ROLE' },
    { name: 'Usuario', code: 'USER_ROLE' }
  ];

  results: string[] = [];
  states: string[] = [];

  form : FormGroup = new FormGroup({});
  
  constructor(  private fb: FormBuilder,
                private route: ActivatedRoute,
                private usuariosService :  UsuariosService  ){}

  ngOnInit() {
    this.editMode = (this.usuarioId==="");
    this.usuarioId = this.route.snapshot.paramMap.get("id") || "";

    if(this.usuarioId==="new"){
      this.usuarioId = "";
    }
    
    this.initFormGroup();
    
   }

  initFormGroup() {
    localStorage.setItem("prevScreen", "usuario");

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
    //   console.log('No se pudo guardar forma no valida');
      
    //   this.verificaCampos();
    //   return;
    // }

    try{
      let obj = {...this.form.value};

      obj.role = this.form.value.selectedRol.code;

      if(!this.usuarioId || this.usuarioId === ""){
        // console.log("Guardando Nuevo Usuario"); 
        this.saveUsuario(obj);
      } else {
        // console.log("Actualizando Usuario");
        this.updateUsuario(obj);
      }
      

    } catch(e){
      console.log(e);
      Swal.fire({
        title: 'Hubo un error',
        text: 'Error al guardar el usuario' + e,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }

  }

  crearFormulario(){
    this.form = this.fb.group({
      activo: [true],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.pattern(REGEXP_EMAIL)]],

      password: ['', [Validators.required, Validators.maxLength(50)]],
      password2: ['', [Validators.required, Validators.maxLength(50)]],

      role: ['', [Validators.required]],
      selectedRol: [{
        name: "Usuario",
        code: "USER_ROLE"
      }],
      img: ['']
    });
  }

  loadFormData (){
    let valuesFormUsuario = {
      nombre: "",
      username: "",
      name: "",
      email: "",
      password: "",
      password2: "",
      img: "",
      selectedRol: { name:"Usuario", code:"USER_ROLE" },
      role: "",
      activo: true
    };

    if(this.usuarioId){
      // console.log("buscando el usuario con el id:", this.usuarioId);
      this.usuariosService.getUsuarioById(this.usuarioId)
          .then(async (resp)=>{
            const body = await resp.json();

            if(!body.ok){
              console.log(body.msg);
              Swal.fire({
                title: 'Error!',
                text:  body.msg, //'El usuario que busca no ha sido encontrado',
                icon: 'error',
                confirmButtonText: 'Continuar'
              });

              this.usuarioId = "";
              return;
            }

            const usuario = body.usuario;
            
            if (usuario){
              Object.keys(valuesFormUsuario).map((x)=>{            
                if(x.toString().includes('fecha')){
                  let Fecha = moment(eval(`usuario.${x}`));
                  eval(`valuesFormUsuario.${x} = '${ Fecha.format('MM/DD/yyyy')}' `);
                } else if(x.toString().includes('password2')){
                  // Casos especiales
                  // console.log(`valuesFormUsuario.${x} = JSON.parse(usuario.${x})`);
                  //eval(`valuesFormUsuario.${x} = JSON.parse(usuario.${x})`);
                } 
                else {
                  eval(`valuesFormUsuario.${x} = usuario.${x}`);
                }
              });
            }

            valuesFormUsuario.selectedRol = this.setDropDownValue(usuario.role);
            valuesFormUsuario.password2 = valuesFormUsuario.password;
                        
            this.form.reset(valuesFormUsuario);
          });
    } else {
      // this.form.setValue({
        this.form.reset(valuesFormUsuario);
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

  private saveUsuario(obj:any) {
    this.usuariosService.save(obj)
    .then( (resp) => {
      // console.log("La respuesta es: ", resp);
      
      if(resp.ok){
        Swal.fire({
          title: 'Guardar usuario',
          text: 'Se guardo el usuario con exito',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      }         
    });
  }

  private updateUsuario(obj:any) {
      obj.id = this.usuarioId;
      this.usuariosService.update(obj)
      .then( (resp) => {
        if(resp.ok){
          Swal.fire({
            title: 'Actualizar usuario',
            text: 'Se actualizo el usuario con exito',
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

  setDropDownValue(code:string) : any {
    console.log("code rol: ", code);
    
    return this.roles.find((obj) => ( obj.code === code ));
  }
  
}
