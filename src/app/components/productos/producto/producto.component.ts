import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2'

import { REGEXP_EMAIL, REGEXP_RFC, REGEXP_CURP } from '../../../config/settings'
import { ProductosService } from 'src/app/services/productos.service';
import { DropDownItem } from 'src/app/interfaces/drop-down-item';
import { Producto } from 'src/app/interfaces/producto';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  editMode: boolean = false;
  showModal: boolean = false;
  productoId: string = "";
  producto: Producto = new Producto(); 
  // exentoIVA: boolean = false;
  imageURL: string = "";

  clasificaciones: DropDownItem[] = [
    { name: 'Producto', code: 'P' },
    { name: 'Servicio', code: 'S' }
  ];

  results: string[] = [];

  form : FormGroup = new FormGroup({});
  
  constructor(  private fb: FormBuilder,
                private route: ActivatedRoute,
                private productosService :  ProductosService  ){}

  ngOnInit() {
    this.editMode = (this.productoId==="");
    this.productoId = this.route.snapshot.paramMap.get("id") || "";

    if(this.productoId==="new"){
      this.productoId = "";
      this.editMode = true;
    }
    
    this.initFormGroup();
    
   }

  initFormGroup() {
    localStorage.setItem("prevScreen", "producto");

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

      obj.clasificacion = this.form.value.selectedClasificacion.code;

      if(!this.productoId || this.productoId === ""){
        // console.log("Guardando Nuevo Producto"); 
        this.saveProducto(obj);
      } else {
        // console.log("Actualizando Producto");
        this.updateProducto(obj);
      }
      

    } catch(e){
      console.log(e);
      Swal.fire({
        title: 'Hubo un error',
        text: 'Error al guardar el producto' + e,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }

  }

  crearFormulario(){
    this.form = this.fb.group({
      activo: [true],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      costo: ['0.00', [Validators.required ]],
      precio: ['0.00', [Validators.required ]],
      cantidad: ['0', [Validators.required ]],
      tasaIVA: ['16', []],
      exentoIVA: [false, []],
      conceptocontable: ['', [Validators.maxLength(50)]],
      clasificacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      img: ['' ],
      
      selectedClasificacion: [{
        name: "Producto",
        code: "P"
      }]
    });
  }

  loadFormData (){
    let valuesFormProducto = {
      activo: true,
      nombre: "",
      code: "",
      descripcion: "",
      precio: "0.0",
      cantidad: "",
      tasaIVA: "0",
      exentoIVA: false,
      clasificacion: "P",
      img: "",
      selectedClasificacion: this.setDropDownValue('P')
    };

    if(this.productoId){
      // console.log("buscando el producto con el id:", this.productoId);
      this.productosService.getProductoById(this.productoId)
          .then(async (resp)=>{
            const body = await resp.json();

            if(!body.ok){
              console.log(body.msg);
              Swal.fire({
                title: 'Error!',
                text:  body.msg, //'El producto que busca no ha sido encontrado',
                icon: 'error',
                confirmButtonText: 'Continuar'
              });

              this.productoId = "";
              return;
            }

            const producto = body.producto;

            this.producto = producto;
            
            if (producto){
              Object.keys(valuesFormProducto).map((x)=>{            
                if(x.toString().includes('fecha')){
                  let Fecha = moment(eval(`producto.${x}`));
                  eval(`valuesFormProducto.${x} = '${ Fecha.format('MM/DD/yyyy')}' `);
                } else if(x.toString().includes('password2')){
                  // Casos especiales
                  // console.log(`valuesFormProducto.${x} = JSON.parse(producto.${x})`);
                  //eval(`valuesFormProducto.${x} = JSON.parse(producto.${x})`);
                } 
                else {
                  eval(`valuesFormProducto.${x} = producto.${x}`);
                }
              });
            }

            valuesFormProducto.selectedClasificacion = this.setDropDownValue(producto.clasificacion);

            // console.log("producto", valuesFormProducto);
            this.form.reset(valuesFormProducto);

          });
    } else {
      // this.form.setValue({
        this.form.reset(valuesFormProducto);
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

  private saveProducto(obj:any) {
    this.productosService.save(obj)
    .then( (resp) => {
      // console.log("La respuesta es: ", resp);
      
      if(resp.ok){
        Swal.fire({
          title: 'Guardar producto',
          text: 'Se guardo el producto con exito',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      }         
    });
  }

  private updateProducto(obj:any) {
      obj.id = this.productoId;
      this.productosService.update(obj)
      .then( (resp) => {
        if(resp.ok){
          Swal.fire({
            title: 'Actualizar producto',
            text: 'Se actualizo el producto con exito',
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
    // console.log("code: ", code);    
    return this.clasificaciones.find((obj) => ( obj.code === code ));
  }

  toggleModal(){
    this.showModal = !this.showModal;
  }

  closeModal(){
    this.showModal = false;
  }
  
}
