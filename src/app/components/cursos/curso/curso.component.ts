import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Curso } from "src/app/interfaces/curso";
import { CargoCurso } from "src/app/interfaces/cargocurso";
import { NgForm } from "@angular/forms";

import { CursosService, CargosService, UsuariosService } from "src/app/services/services.index";
import { ddNiveles, ddTiposCargos, eSeverityMessages } from "src/app/config/enums";
import { arraycounter, arrRemoveAt, setfocus } from "src/app/helpers/tools";
import { DropDownItem } from "src/app/interfaces/drop-down-item";
import { ProductosListComponent } from "../../productos/productos-list/productos-list.component";
import { Producto } from "src/app/interfaces/producto";
import { DialogService } from "primeng/dynamicdialog";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  selector: "app-curso",
  templateUrl: "./curso.component.html",
  styleUrls: ['./curso.component.css']
})
export class CursoComponent implements OnInit {
  counter= arraycounter;
  tiposCargos: DropDownItem[] = [ { name:"Seleccione tipo de cargo", code: "" }, ...ddTiposCargos];
  tipocargoSelected: DropDownItem = new DropDownItem();

  cargoEmpty = new CargoCurso("", "", "", false, 0, 0, 0, 1, 1);
  
  idparam: string = "";

  niveles: DropDownItem[] = ddNiveles;
  nivelSelected : DropDownItem = new DropDownItem();

  cargoDialog: boolean = false;
  submitted: boolean = false;

  curso: Curso = new Curso();
  cargos: CargoCurso[] = [];
  cargoSelected: CargoCurso = this.cargoEmpty;
  cargoSelectedIndex: number = -1;

  productoSearch: string = "";
  searchResultMsg: string = "";
  productoSelected: any = {};



  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    public cargosService: CargosService,
    public cursosService: CursosService,
    public usuariosService: UsuariosService,
    private messageService: MessageService
    // public _modalUploadService: ModalUploadService
  ) {
    activatedRoute.params.subscribe(params => {
      let id = params.id;
      this.idparam = id;
      if (id !== "new") {
        this.getCurso(id);
      }
    });
  }

  ngOnInit() {
    this.cargosService
      .getCargos()
      .then((resp:any) => (this.cargos = resp.cargos));
  }

  getCurso(id: string) {
    if(!id || id==="new"){ 
      this.curso = new Curso();
      return;
    }
    this.cursosService.getCursoById(id)
      .then(async (resp) => {      
          const body = await resp.json();
          console.log(body.curso);
          this.curso = body.curso;
          // this.curso.cargo = curso.cargo.id;
          // this.cargo = curso.cargo.id;
          // this.getCargosCurso(this.curso.id);
    });
  }

  // guardarCurso(f: NgForm) {
  //   if (f.invalid) {
  //     return;
  //   }

  //   // setteamos el usuario actual que hace la modificacion
  //   // this.curso.usuario = { name: "Usuario dummy" }; //this.usuariosService.usuario.id;

  //   if (this.idparam === "nuevo") {
  //     // console.log('Creando Curso');
  //     this.cursosService.save(this.curso)
  //     .then(async (resp) => {      
  //       const body = await resp.json();
  //       console.log(body.curso);
  //       this.curso = body.curso;
  //       this.router.navigate(["/curso", this.curso.id]);
  //     });
  //   } else {
  //     // console.log('Actualizando Curso');
  //     this.cursosService.update(this.curso).then(() => {
  //       this.router.navigate(["/curso", this.idparam]);
  //     });
  //   }
  // }

  // getCargosCurso(id: string) {
  //   console.log("Disabled");
    
  //   // this.cargosService.obtenerCargo(id).subscribe(cargo => {
  //   //   this.cargo = cargo;
  //   //   if (this.cargo) {
  //   //     console.log(this.cargo.img);
  //   //   }
  //   // });
  // }

  // cambiarFoto(id: string) {
  //   console.log("Disabled");

    // this._modalUploadService.mostrarModal("cursos", id);

    // this._modalUploadService.notificacion.subscribe(resp => {
    //   console.log(resp);
    //   this.curso.img = resp.curso.img;
    // });
  // }

  isInvalid(controlname:string){
    // console.log("TODO isInvalid: ", controlname);    
    return false;
  }

  save(){
    console.log("TODO: Saving...", this.idparam, this.curso);
    if( !this.idparam || this.idparam === "new" ){
      this.cursosService.save(this.curso)
      .then(async(resp)=>{
        const body = await resp.json();
        console.log(body);
        if(body.ok){
          this.idparam = body.id;
          this.showToastMessage("Curso", "Guardado con exito", eSeverityMessages.success);
          this.router.navigate(["/curso", this.curso.id]);
        } else{
          this.showToastMessage("Curso", "Error al guardar", eSeverityMessages.error);
        }
      });
      return;
    }

    this.cursosService.update(this.curso)
    .then(async(resp)=>{
      const body = await resp.json();
      console.log(body);
      if(body.ok){
        this.showToastMessage("Curso", "Actualizado con exito", eSeverityMessages.success);
      }else{
        console.log(body.error);
        
        this.showToastMessage("Curso", "Error al actualizar", eSeverityMessages.error);
      }
    });

  }

  onChangeNivel(event: any){
    // console.log(event);
    this.curso.nivel = event.value.code;
  }

  onChangeTipocargo(event: any){
    // console.log(event);
    this.tipocargoSelected = event.value;
    this.cargoSelected.nombre = event.value.name;
    this.productoSearch = event.value.name;
  }

  getTipoCargoOption(searchToken:string, byCode:boolean=false) : any {
    if (byCode) return this.tiposCargos.find((obj : DropDownItem ) => ( obj.code.toLowerCase() === searchToken.toLowerCase() ));
    return this.tiposCargos.find((obj : DropDownItem ) => ( obj.name.toLowerCase() === searchToken.toLowerCase() ));
  }

  showProductosList() {
    const ref = this.dialogService.open(ProductosListComponent, {
      header: 'Seleccione un producto',
      width: '70%',
      data: {
        searchtext: this.cargoSelected.nombre || this.productoSearch
      }
    });

    ref.onClose.subscribe((producto: Producto) => {
      if (!producto) return;
      this.productoSelected = producto;

      this.cargoSelected.nombre = producto.nombre;

      this.cargoSelected.precio = producto.precio;
      this.cargoSelected.tasaIVA = producto.tasaIVA;

      this.cargoSelected.monto = (producto.precio * ( 1 +producto.tasaIVA ));

      setfocus("cargonombre");
    });
  }

  addCharge(){
    console.log("agregarCargo...", this.productoSelected);

    if (!this.validaCargo()) return;

    if(!this.productoSelected) return;

    if(this.cargoSelectedIndex < 0) {
      this.curso.cargos?.push(this.cargoSelected);
    }
    this.curso.cargos[this.cargoSelectedIndex] = this.cargoSelected;
    
    this.cleanSelectedCargo();
  }

  cleanSelectedCargo(){
    this.cargoSelectedIndex = -1;
    this.cargoSelected = new CargoCurso("", "", "", false);
    this.productoSearch = "";
    this.productoSelected = {};
    this.tipocargoSelected = this.getTipoCargoOption("", true);
  }

  showToastMessage(title: string = "", text: string = "", tipo: string = "success"){
    this.messageService.add( {
            key: 'tmKey', 
            severity: tipo || 'success', 
            summary: title || 'Titulo', 
            detail: `${text}` || 'Texto'});
  }


  validaCargo(): boolean{

    if(this.cargoSelected.nombre === ""){
      this.showToastMessage("Cargo", "El nombre del cargo es obligatorio", eSeverityMessages.error)
      setfocus("cargonombre");
      return false;
    }

    if(!this.cargoSelected.precio || this.cargoSelected.precio === 0 ){
      this.showToastMessage("Cargo", "El precio del cargo es obligatorio", eSeverityMessages.error);
      setfocus("precio");
      return false;
    }

    return true;
  }
  
  openNew() {
    this.submitted = false;
    this.cargoDialog = true;
  }

  editCargo(index:number){
    // console.log("Cargo index: ", index);
    this.cargoSelectedIndex = index;
    this.cargoSelected = this.curso.cargos?this.curso.cargos[index]: this.cargoEmpty;
    this.tipocargoSelected = this.getTipoCargoOption(this.cargoSelected.nombre);
    this.cargoDialog = true;
  }

  removeCargo(index: number){
      this.curso.cargos =  arrRemoveAt(this.curso.cargos, index);
  }

  hideDialog(){
    this.cleanSelectedCargo();
    this.cargoDialog = false;
  }
  
}