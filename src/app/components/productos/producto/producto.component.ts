import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TASA_IVA } from 'src/app/config/settings'
import Swal from 'sweetalert2'

import { fileUpload } from "../../../helpers/uploadimages";

import { ProductosService } from 'src/app/services/productos.service';
import { DropDownItem } from 'src/app/interfaces/drop-down-item';
import { Producto } from 'src/app/interfaces/producto';
import { ImagesService } from 'src/app/shared/services/images.service';
import { ddTipoItemVenta, ddUnidadesMedida } from 'src/app/config/enums';
import { getDropDownOption } from 'src/app/helpers/tools';

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

  clasificaciones: DropDownItem[] = ddTipoItemVenta;
  selectedClasificacion: DropDownItem = new DropDownItem();

  unidadesmedida: DropDownItem[] = ddUnidadesMedida;
  unidadmedidaSelected: DropDownItem = new DropDownItem();
  unidadmedidacode: string = "";

  results: string[] = [];

  form : FormGroup = new FormGroup({});

  productoEmpty = {
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
    selectedClasificacion: getDropDownOption('P', this.clasificaciones),
    unidadmedidaSelected: getDropDownOption('', this.unidadesmedida)
  };

  
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
      unidadmedida: [''],
      clasificacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      img: ['' ],
      
      selectedClasificacion: [{
        name: "Producto",
        code: "P"
      }],      
      unidadmedidaSelected: [{
        name: "",
        code: ""
      }],      
    });
  }

  loadFormData (){
    console.log("Cargando datos del producto: ",  this.productoId);
    
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
            console.log(body.producto);
            
            const producto = body.producto;

            this.producto = producto;
            this.productoEmpty = producto;
            this.selectedClasificacion = getDropDownOption(producto.clasificacion, this.clasificaciones);
            this.unidadmedidaSelected = getDropDownOption(producto.unidadmedida, this.unidadesmedida);

            this.productoEmpty.selectedClasificacion = this.selectedClasificacion;
            this.productoEmpty.unidadmedidaSelected = this.unidadmedidaSelected;

            // console.log(this.unidadesmedida);
            // console.log("unidade de medida: ", producto.unidadmedida);
            // console.log(this.unidadmedidaSelected);


            // console.log(this.productoEmpty.unidadmedidaSelected);
            
            this.form.reset(this.productoEmpty);
            // console.log("producto obj", this.productoEmpty);

          });
    } else {
      // this.form.setValue({
        this.form.reset(this.productoEmpty);
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
    obj.unidadmedida = this.form.value.unidadmedidaSelected.code;
    obj.unidadmedidaSelected = this.form.value.unidadmedidaSelected;

    console.log(obj);

      obj.id = this.productoId;
      this.productosService.update(obj)
      .then( async (resp) => {
        const body = await resp.json();
        console.log(body);
        
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

  // setDropDownValue(code:string, ddname: string = "") : any {
  //   if (ddname === "unidadesmedida"){
  //     return this.unidadesmedida.find((obj) => ( obj.code === code ));
  //   }
  //   return this.clasificaciones.find((obj) => ( obj.code === code ));
  // }

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
                
  edit(id?:string){
    this.form.reset(this.productoEmpty);
    this.router.navigate([`producto/${id}`]);
  }

  unidadMedidaChange(event: any){
    console.log(event);
    this.unidadmedidacode = " " + event.value.code;
    console.log(this.unidadmedidacode);    
  }

}
