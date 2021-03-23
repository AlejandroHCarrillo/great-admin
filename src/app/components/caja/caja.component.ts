import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DIA_MILLISECONDS, PAGE_SIZE } from '../../config/settings'
import * as moment from 'moment';

import { Alumno } from 'src/app/interfaces/alumno';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { DropDownItem } from 'src/app/interfaces/drop-down-item';
import { CartItem } from 'src/app/interfaces/cart-item';
import { DialogService } from 'primeng/dynamicdialog';
import { Producto } from 'src/app/interfaces/producto';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductosListComponent } from '../productos/productos-list/productos-list.component';
import { CargoItem } from 'src/app/interfaces/cargo-item';
import { CargosService } from 'src/app/services/cargos.service';
import { eEstatusPagos } from 'src/app/config/enums';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})

export class CajaComponent implements OnInit {
  txtbuscar: string = "";
  searchResultMsg = "";

  alumnoslist : DropDownItem[] = [];
  alumnoSelected: DropDownItem = { name:"Seleccione un alumno", code:"-1" };

  private emptytranscaction = { 
    index: 0,
    cantidad: 0,
    producto: {
      id: "",
      code: "",
      nombre: "",
      precio: 0,
      exentoIVA: false,
      tasaIVA: 0
    },
    descuento: 0
  };

  currtransaction = this.emptytranscaction;
  selectedIndex = -1;
  isSingleClick: Boolean = true;
  errorMsgsCurTrns: string[] = [];

  alumnos: Alumno[] = [];
  cargosalumno: CargoItem[] = [];

  shoppingcart: CartItem[]= [];

  alumnosdrdwnenabled = true;

  constructor(  private router: Router,
                private alumnosService: AlumnosService,
                private cargosService: CargosService,
                private dialogService: DialogService,
                private confirmationService: ConfirmationService,
                private messageService: MessageService
                ) 
  { }

  ngOnInit(): void {
    // this.loadAlumnos()
    this.alumnochanged({ value: { code: "605018e1ab32bf465014d1a4"}});
  }

  buscar(){
    let queryParams = `desde=${""}&records=${""}&sort=${""}`

    let prevScreen = localStorage.getItem("prevScreen") || '';
    if (prevScreen == "caja"){
      queryParams = localStorage.getItem("lastquery")||'';
      localStorage.setItem('prevScreen', '');
    }

    // console.log(queryParams);
    localStorage.setItem('lastquery', queryParams);
    
    this.alumnosService
    .findAlumnos(queryParams, this.txtbuscar)
    .then(async (resp:any)=>{
      const body = await resp.json();
      this.alumnos = body.alumnos;
      // this.totalRecords = body.total;

      if(this.alumnos){
        // console.log("Alumnos: ", this.alumnos );
        this.alumnoslist =  [ { name:"Seleccione un alumno", code:"-1" },
                              ...this.alumnos.map((a)=>({ name: `${a.nombre} ${a.apaterno || ""} ${a.amaterno || ""} - ${ a.matricula || "" }` , code: a.id }))
                            ];
      }

      this.searchResultMsg = `Se encontraron ${body.found} registros.`
      this.setfocus("alumnoslist");
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });
  }

  async alumnochanged(event: any){
    this.alumnosdrdwnenabled = false;

    if (event.value.code !== -1 && event.value.code.length >= 24 ) {
      this.cargosalumno = await this.cargosService.findCargos(event.value.code);
    } else {
      this.cargosalumno = [];
    }
    this.alumnosdrdwnenabled = true;
    this.setfocus("producto");
  }

  edit(id?:string){
    this.router.navigate([`caja/${id}`]);
  }

  get subtotal(){
    return Math.round(this.shoppingcart.reduce((prev, cur) => {
      return prev + ( cur.cantidad * cur.precio );
      }, 0)*100)/100;
  }

  get sumaDescuentos(){
    return Math.round(this.shoppingcart.reduce((prev, cur) => {
      return prev + cur.descuento;
      }, 0)*100)/100;
  }

  get sumaIVA(){
    return Math.round(this.shoppingcart.reduce((prev, cur) => {
      return prev + cur.impuestos;
      }, 0)*100)/100;
  }

  get total(){
    return Math.round(this.shoppingcart.reduce((prev, cur) => {
      return prev + ( cur.monto + cur.impuestos );
      }, 0)*100)/100;
  }

  addProduct(){
    console.log(this.currtransaction.producto);
    this.errorMsgsCurTrns = [];

    if(this.currtransaction.producto.id=="" ) this.errorMsgsCurTrns.push("El producto debe ser seleccionado");
    if(this.currtransaction.cantidad===0) this.errorMsgsCurTrns.push("La cantidad es obligatoria y mayor a cero");

    if(this.errorMsgsCurTrns.length>0) return;

    const t = this.currtransaction;
    const monto = (t.cantidad * t.producto.precio) - t.descuento;
    const montoImpuestos = monto * (t.producto.tasaIVA/100);

    const item = new CartItem(t.index, "",
      t.producto.precio,
      t.cantidad,
      t.producto.tasaIVA,
      montoImpuestos,
      t.descuento,
      monto,
      t.producto
    );

    if(this.selectedIndex > -1){
      // console.log("Actualizar la edicion el la posicion ", this.selectedIndex);
      this.shoppingcart[this.selectedIndex] = item;
    } else{
      this.shoppingcart.push(item);
    }

    this.clearCurrTrans();
    this.setfocus("producto");
  }

  clearCurrTrans(){
    // this.currtransaction = this.emptytranscaction;
    this.currtransaction.index = 0;
    this.currtransaction.producto = {
      id: "",
      code: "",
      nombre: "",
      precio: 0,
      exentoIVA: false,
      tasaIVA: 0,
    };
    this.currtransaction.cantidad = 0;
    this.currtransaction.descuento = 0;

    this.errorMsgsCurTrns = [];
  }

  selectedItem(index:number){
    this.isSingleClick = true;

    setTimeout(()=>{
      if(this.isSingleClick){
        console.log(index);
        this.selectedIndex = index;
      }
    },500);
  }

  setEditCartItem(index:number){
    this.isSingleClick = false;
    
    this.currtransaction = {
      index: index,
      cantidad: this.shoppingcart[index].cantidad,
      producto: {
        id: this.shoppingcart[index].producto.id,
        code: this.shoppingcart[index].producto.code||"",
        nombre: this.shoppingcart[index].producto.nombre||"",
        precio: this.shoppingcart[index].precio,
        exentoIVA: false,
        tasaIVA: this.shoppingcart[index].tasaIVA
      },
      descuento: this.shoppingcart[index].descuento
    };

    this.errorMsgsCurTrns = [];
  }

  deleteCartItem(index:number){
    let cargoIndex = this.shoppingcart[index].cargoindex || -1;

    this.confirmationService.confirm({
      message: '¿En verdad deseas eliminar este cargo de la lista?',
      accept: () => {
        let scClon = [...this.shoppingcart];
        this.shoppingcart = [ ...scClon.splice(0, index), 
                              ...this.shoppingcart.splice(index+1)
                            ];
        this.selectedIndex = -1;
        this.cargosalumno[cargoIndex].isAddedSC = false;
        }
    });
  }

  showProductosList() {
    const ref = this.dialogService.open(ProductosListComponent, {
      header: 'Seleccione un producto',
      width: '70%',
      data: {
        searchtext: this.currtransaction.producto.nombre
      }
    });

    ref.onClose.subscribe((producto: Producto) => {
        // console.log("Producto seleccionado: ", producto);
        if (!producto) return;

        this.currtransaction.producto = {
                      ...producto,
                      id: producto?.id || "",
                      code: producto?.code
                      };
        if (producto) {
            this.messageService.add({severity:'info', summary: 'Producto seleccionado', detail:'code:' + producto.code });
        }

        this.setfocus("cantidad");
    });
  }

  setfocus(controlname: string){
    document.getElementsByName(controlname)[0].focus();
    
  }

  daysToExpire(fecha:string){
    return moment(fecha).diff(new Date().getTime())/( DIA_MILLISECONDS );
  }

  setClassPago(fecha: string, estatus: string){
    let diff = this.daysToExpire(fecha);
    let classCargo = "card cargo ";

    if( estatus === eEstatusPagos.PAGADO ) 
      return `${ classCargo } cargo-success`;

    if( estatus === eEstatusPagos.CANCELADO ) 
      return `${ classCargo } cargo-canceled`;

    if( estatus === eEstatusPagos.NO_PAGADO && diff < 0 ) 
      return `${ classCargo } cargo-danger`;

    if( estatus === eEstatusPagos.NO_PAGADO && diff > 0 && diff < 15 ) 
      return `${ classCargo } cargo-warning`;

    return classCargo;
  }

  setCargo(cargoIndex:number){
    let cargo = this.cargosalumno[cargoIndex];
    // console.log(cargo);
    if( !!cargo.isAddedSC ){
      // console.log("El cargo ya habia sido agregado.");
      return;
    }
    
    if( cargo.estatus === eEstatusPagos.PAGADO ||
        cargo.estatus === eEstatusPagos.CANCELADO 
        ) 
      { 
        // console.log("Cargos Pagados y cancelados no se pueden agregar");
          return;
      }

    console.log("index: ", cargo.producto );
    cargo.producto.nombre += " / " + cargo.concepto;
    const item = new CartItem(0, "",
                      // cargo.producto.id || "",
                      cargo.producto.precio,
                      cargo.cantidad,
                      cargo.tasaIVA,
                      cargo.impuestos,
                      cargo.descuento,
                      cargo.monto,
                      cargo.producto,
                      cargoIndex
                    );

    console.log("cart item: ", item);
    
    this.shoppingcart.push(item);
    this.cargosalumno[cargoIndex].isAddedSC = true;
  }

  removeCargo(index: number){
    // console.log("remover cargo: ", index);
    let CargoInCartIndex = this.shoppingcart.findIndex((scItem) =>( scItem.cargoindex === index) );
    // console.log("shoppinchart position: ", CargoInCartIndex);
    this.deleteCartItem(CargoInCartIndex);
  }

  cleanShoppingCart(){
    this.confirmationService.confirm({
      message: '¿En verdad deseas limpiar las transacciones?',
      accept: () => {
        this.shoppingcart = [];
        this.selectedIndex = -1;

        this.cargosalumno.forEach( (c) => {
          c.isAddedSC = false;
        });
        }
    });   
  }
}