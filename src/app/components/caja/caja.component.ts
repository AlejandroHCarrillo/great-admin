import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PAGE_SIZE } from '../../config/settings'

import { Alumno } from 'src/app/interfaces/alumno';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { DropDownItem } from 'src/app/interfaces/drop-down-item';
import { CartItem } from 'src/app/interfaces/cart-item';
import { DialogService } from 'primeng/dynamicdialog';
import { Producto } from 'src/app/interfaces/producto';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductosListComponent } from '../productos/productos-list/productos-list.component';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css'],
  providers: [ DialogService ]
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

  shoppingcart: CartItem[]= [
    {
      "index": 0,
      "id": "",
      "productoId": "604fcf2da3eaca46e8296845",
      "precio": 25,
      "cantidad": 1,
      "tasaIVA": 10,
      "impuestos": 2.5,
      "descuento": 2,
      "monto": 25,
      "productoNombre": "1Manzana amarilla GOLDEN",
      "productoCode": "MZNGLDN"
    },
    {
      "index": 0,
      "id": "",
      "productoId": "604fb5b939009a2fc0e2f750",
      "precio": 50,
      "cantidad": 0,
      "tasaIVA": 100,
      "impuestos": 0,
      "descuento": 10,
      "monto": 0,
      "productoNombre": "2Manzana roja ",
      "productoCode": "MZNAWSHRDL"
    },
    {
      "index": 0,
      "id": "",
      "productoId": "604fcf2da3eaca46e8296845",
      "precio": 25,
      "cantidad": 1,
      "tasaIVA": 10,
      "impuestos": 2.5,
      "descuento": 2,
      "monto": 25,
      "productoNombre": "3Manzana amarilla GOLDEN",
      "productoCode": "MZNGLDN"
    },
    {
      "index": 0,
      "id": "",
      "productoId": "604fb5b939009a2fc0e2f750",
      "precio": 50,
      "cantidad": 0,
      "tasaIVA": 100,
      "impuestos": 0,
      "descuento": 10,
      "monto": 0,
      "productoNombre": "4Manzana roja ",
      "productoCode": "MZNAWSHRDL"
    },
    {
      "index": 0,
      "id": "",
      "productoId": "604fcf2da3eaca46e8296845",
      "precio": 25,
      "cantidad": 1,
      "tasaIVA": 10,
      "impuestos": 2.5,
      "descuento": 2,
      "monto": 25,
      "productoNombre": "5Manzana amarilla GOLDEN",
      "productoCode": "MZNGLDN"
    },
    {
      "index": 0,
      "id": "",
      "productoId": "604fb5b939009a2fc0e2f750",
      "precio": 50,
      "cantidad": 0,
      "tasaIVA": 100,
      "impuestos": 0,
      "descuento": 10,
      "monto": 0,
      "productoNombre": "6Manzana roja ",
      "productoCode": "MZNAWSHRDL"
    },
    {
      "index": 0,
      "id": "",
      "productoId": "604fcf2da3eaca46e8296845",
      "precio": 25,
      "cantidad": 1,
      "tasaIVA": 10,
      "impuestos": 2.5,
      "descuento": 2,
      "monto": 25,
      "productoNombre": "7Manzana amarilla GOLDEN",
      "productoCode": "MZNGLDN"
    },
    {
      "index": 0,
      "id": "",
      "productoId": "604fb5b939009a2fc0e2f750",
      "precio": 50,
      "cantidad": 0,
      "tasaIVA": 100,
      "impuestos": 0,
      "descuento": 10,
      "monto": 0,
      "productoNombre": "8Manzana roja ",
      "productoCode": "MZNAWSHRDL"
    },            
  ];

  constructor(  private router: Router,
                private alumnosService: AlumnosService,
                private dialogService: DialogService,
                private confirmationService: ConfirmationService,
                private messageService: MessageService
                ) 
  { }

  ngOnInit(): void {
    // this.loadAlumnos()
  }

  loadAlumnos(){
    console.log("Cargando alumnos");
    
    let queryParams = `desde=${this.pageinfo.first}&records=${this.pageinfo.rows}&sort=${this.pageinfo.sort}`

    let prevScreen = localStorage.getItem("prevScreen") || '';
    if (prevScreen == "caja"){
      queryParams = localStorage.getItem("lastquery")||'';
      localStorage.setItem('prevScreen', '');
    }

    // console.log(queryParams);
    localStorage.setItem('lastquery', queryParams);
    
    this.alumnosService
    .getAlumnos(queryParams)
    .then(async (resp:any)=>{
      const body = await resp.json();
      this.alumnos = body.alumnos;
      this.totalRecords = body.total;
      this.searchResultMsg = "";
    })
    .catch((e:any)=>{
        console.log("error: ", e);            
    });
  }

  buscar(){
    // if (!this.txtbuscar || this.txtbuscar===""){
    //   this.loadAlumnos();
    //   return;
    // }

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
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });
  }

  edit(id?:string){
    this.router.navigate([`caja/${id}`]);
  }

  paginate(pageEvent:any){
    // if(pageEvent.page != this.currentPage){
      this.currentPage = pageEvent.page;
      console.log("cambio de pagina", pageEvent);
      this.pageinfo = {
        ...this.pageinfo,
        ...pageEvent
      };

      this.loadAlumnos();
    // }
  }

  setOrder(colname:string){
    this.pageinfo.sort = colname;
    this.pageinfo.first = 0;    
    this.loadAlumnos();
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

  show() {
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

}
