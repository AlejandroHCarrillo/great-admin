import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PAGE_SIZE } from '../../config/settings'

import { Alumno } from 'src/app/interfaces/alumno';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { DropDownItem } from 'src/app/interfaces/drop-down-item';
import { CartItem } from 'src/app/interfaces/cart-item';
import { DialogService } from 'primeng/dynamicdialog';
import { Producto } from 'src/app/interfaces/producto';
import { MessageService } from 'primeng/api';
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

  shoppingcart: CartItem[]= [];

  constructor(  private router: Router,
                private alumnosService: AlumnosService,
                public dialogService: DialogService,
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
    const t = this.currtransaction;

    const monto = (t.cantidad * t.producto.precio) - t.descuento;
    const montoImpuestos = monto * (t.producto.tasaIVA/100);

    const item = new CartItem("id",
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

    this.shoppingcart.push(item);

    this.clearCurrTrans();
  }

  clearCurrTrans(){
    // this.currtransaction = this.emptytranscaction;
    this.currtransaction.producto = {
      id: "",
      code: "",
      nombre: "",
      precio: 0,
      exentoIVA: false,
      tasaIVA: 0
    };
    this.currtransaction.cantidad = 0;
    this.currtransaction.descuento = 0;

  }

  selectedItem(index:number){
    console.log(index);
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
      console.log(producto);
      this.currtransaction.producto = {
                    ...producto,
                    id: producto.id || "",
                    code: producto.code
                    };
      if (producto) {
          this.messageService.add({severity:'info', summary: 'Producto seleccionado', detail:'code:' + producto.code });
      }
  });
}
}
