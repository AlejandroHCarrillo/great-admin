import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TASA_IVA } from 'src/app/config/settings'
import * as moment from 'moment';
import Swal from 'sweetalert2'

import { fileUpload } from "../../../helpers/uploadimages";

import { ProductosService } from 'src/app/services/productos.service';
import { DropDownItem } from 'src/app/interfaces/drop-down-item';
import { Producto } from 'src/app/interfaces/producto';
import { ImagesService } from 'src/app/shared/services/images.service';

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

  imageURL: string = "";
  imagesUrls: string[] = [];

  clasificaciones: DropDownItem[] = [
    { name: 'Producto', code: 'P' },
    { name: 'Servicio', code: 'S' }
  ];

  results: string[] = [];

  form : FormGroup = new FormGroup({});
  
  constructor(  private fb: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private productosService :  ProductosService,
                private imagesService :  ImagesService  ){}

  ngOnInit() {
    this.editMode = (this.productoId==="");
    this.productoId = this.route.snapshot.paramMap.get("id") || "";

    if(this.productoId === "" || this.productoId==="new"){
      this.productoId = "";
      this.editMode = true;
      
    } else {
      this.getImages(this.productoId);
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
      if(!this.productoId || this.productoId === ""){
        // console.log("Guardando Nuevo Producto"); 
        this.saveProducto();
      } else {
        // console.log("Actualizando Producto");
        this.updateProducto();
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
      costo: "0.0",
      precio: "0.0",
      cantidad: "",
      tasaIVA: TASA_IVA*100,
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

  private saveProducto() {
    let obj = {...this.form.value};
    obj.clasificacion = this.form.value.selectedClasificacion.code;
    obj.tasaIVA = obj.tasaIVA === 0 ? 0: (obj.tasaIVA / 100);

    this.productosService.save(obj)
    .then(async (resp) => {
      // console.log("La respuesta es: ", resp);      
      if(resp.ok){
        Swal.fire({
          title: 'Guardar producto',
          text: 'Se guardo el producto con exito',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        
        const body = await resp.json();

        console.log("body: ", body);
        this.router.navigate([`producto/${body.id}`]);
      }
    });
  }

  private updateProducto() {
    let obj = {...this.form.value};
    obj.clasificacion = this.form.value.selectedClasificacion.code;

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

  showUploadImage(){
    // console.log("Mostrar el upload file.");
    document.getElementById('fileSelector')?.click();
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
      this.producto.img = fileUrl;
      this.form.value.img = fileUrl;
      this.updateProducto();
      this.saveImage(this.productoId, fileUrl, this.producto.nombre);
      this.imagesUrls = [fileUrl, ...this.imagesUrls];      
    });
    Swal.close();
  };

  handleFileChange(e:any){
    // console.log("handleFileChange...");
    const file = e.target.files[0];
    if ( file ){
      this.startUploading(file);
    }
  }

  getUploadURLs(event:any){
    // get Urls from the Child component
    this.imagesUrls = [...this.imagesUrls, ...event];
    event.forEach((url: any) => {
      this.saveImage(this.productoId, url, this.producto.nombre);
    });
  }

  saveImage(itemId:string, url:string, titulo:string=""){
    this.imagesService.save({
      ownerId: itemId,
      tipoCatalogo: "Producto",
      titulo: titulo,
      url: url
    });
  }

  getImages(ownerId:string){
    let queryParams = `sort=title`;
    this.imagesService.findImages(queryParams, ownerId)
    .then( async (resp)=> {
      const body = await resp.json();
      if(body.imagenes){
        this.imagesUrls = body.imagenes.map((x:any)=>(x.url));
      }
    });
  }

  toggleTax(event: any ){
    let taxControl = this.form.controls["tasaIVA"];
    
    console.log(taxControl.value);
    if(event.checked){
      taxControl.setValue(0);
      taxControl.disable();
    } else {
      taxControl.setValue(TASA_IVA * 100);
      taxControl.enable();
    }
  }
}
