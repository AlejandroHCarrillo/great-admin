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

  pagesize = PAGE_SIZE;
  pageinfo = {
                first : 0,
                rows : this.pagesize,
                page : 0,
                pageCount : 0,
                sort: 'nombre'
          };

  currentPage: number=0;
  totalRecords: number = 0;

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
    let queryParams = `desde=${this.pageinfo.first}&records=${this.pageinfo.rows}&sort=${this.pageinfo.sort}`

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
      this.totalRecords = body.total;

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
    console.log("alumnochanged", event.value.code);
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
      t.producto.id,
      t.producto.precio,
      t.cantidad,
      t.producto.tasaIVA,
      montoImpuestos,
      t.descuento,
      monto,
      t.producto.nombre,
      t.producto.code
    );

    if(this.selectedIndex !== -1){
      console.log("Actualizar la edicion el la posicion ", this.selectedIndex);
      
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
        id: this.shoppingcart[index].productoId,
        code: this.shoppingcart[index].productoCode||"",
        nombre: this.shoppingcart[index].productoNombre||"",
        precio: this.shoppingcart[index].precio,
        exentoIVA: false,
        tasaIVA: this.shoppingcart[index].tasaIVA
      },
      descuento: this.shoppingcart[index].descuento
    };

    this.errorMsgsCurTrns = [];
  }

  deleteCartItem(index:number){
    // console.log("delete data", index);

    this.confirmationService.confirm({
      message: '¿En verdad deseas eliminar este registro?',
      accept: () => {
        let scClon = [...this.shoppingcart];
        this.shoppingcart = [ ...scClon.splice(0, index), 
                              ...this.shoppingcart.splice(index+1)
                            ];
        this.selectedIndex = -1;
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

    if( estatus === "PAGADO" ) 
      return `${ classCargo } cargo-success`;

    if( estatus === "NO_PAGADO" && diff < 0 ) 
      return `${ classCargo } cargo-danger`;

    if( estatus === "NO_PAGADO" && diff > 0 && diff < 15 ) 
      return `${ classCargo } cargo-warning`;

    return classCargo;
  }

  setCargo(index:number){
    let cargo = this.cargosalumno[index];
    console.log("index: ", cargo );

    const item = new CartItem(0, "",
                      cargo.producto.id || "",
                      cargo.producto.precio,
                      cargo.cantidad,
                      cargo.tasaIVA,
                      cargo.impuestos,
                      cargo.descuento,
                      cargo.monto,
                      `${cargo.producto.descripcion} ${ cargo.concepto }` ,
                      cargo.producto.code
                    );
  this.shoppingcart.push(item);
  }

  cleanShoppingCart(){
    this.confirmationService.confirm({
      message: '¿En verdad deseas limpiar las transacciones?',
      accept: () => {
        this.shoppingcart = [];
        this.selectedIndex = -1;
        }
    });   
  }
}