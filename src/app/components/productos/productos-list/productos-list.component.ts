import { Component, OnInit } from '@angular/core';
import { PAGE_SIZE } from 'src/app/config/settings';

import { Producto } from 'src/app/interfaces/producto';
import { ProductosService } from 'src/app/services/productos.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { setfocus } from 'src/app/helpers/tools';
import { PageInfo } from 'src/app/interfaces/pageinfo.model';
  
@Component({
  selector: 'app-productos-list',
  templateUrl: './productos-list.component.html',
  styleUrls: ['./productos-list.component.css']
})
export class ProductosListComponent implements OnInit {
  searchMode: boolean = false;
  txtbuscar: string = "";
  searchResultMsg = "";

  pageinfo : PageInfo = new PageInfo(0, PAGE_SIZE, 0, 0, "nombre");

  currentPage: number=0;
  totalRecords: number = 0;
  productos: Producto[] = [];

  constructor(  private productosService: ProductosService,
                public ref?: DynamicDialogRef, 
                public config?: DynamicDialogConfig
                ) { }

  ngOnInit(): void {
    this.txtbuscar = this.config?.data.searchtext;
    this.buscar();
  }

  buscar(){
    let queryParams = `desde=${this.pageinfo.first}&records=${this.pageinfo.rows}&sort=${this.pageinfo.sort}`

    let prevScreen = localStorage.getItem("prevScreen") || '';
    if (prevScreen == "producto"){
      queryParams = localStorage.getItem("lastquery")||'';
      localStorage.setItem('prevScreen', '');
    }

    // console.log(queryParams);
    localStorage.setItem('lastquery', queryParams);
    
    this.productosService
    .findProductos(queryParams, this.txtbuscar)
    .then(async (resp)=>{
      const body = await resp.json();
      this.productos = body.productos;
      this.totalRecords = body.total;
      this.searchResultMsg = `Se encontraron ${body.found || 0 } registros.`

      setfocus("buscar");
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });
  }

  paginate(pageEvent:any){
    if(pageEvent.page != this.currentPage){
      this.currentPage = pageEvent.page;
      this.pageinfo = {
        ...this.pageinfo,
        ...pageEvent
      };

      this.buscar();
    }
  }

  selectItem(item: any) {
    this.ref?.close(item);
  }

}
