import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { PAGE_SIZE } from 'src/app/config/settings';

import { Producto } from 'src/app/interfaces/producto';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  txtbuscar: string = "";
  searchResultMsg = "";

  showDeleteButtons: boolean = false;
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
  productos: Producto[] = [];

  constructor(  private router: Router,
                private productosService: ProductosService) { }

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(){
    let queryParams = `desde=${this.pageinfo.first}&records=${this.pageinfo.rows}&sort=${this.pageinfo.sort}`

    let prevScreen = localStorage.getItem("prevScreen") || '';
    if (prevScreen == "producto"){
      queryParams = localStorage.getItem("lastquery")||'';
      localStorage.setItem('prevScreen', '');
    }

    // console.log(queryParams);
    localStorage.setItem('lastquery', queryParams);
    
    this.productosService
    .getProductos(queryParams)
    .then(async (resp)=>{
      const body = await resp.json();
      this.productos = body.productos;
      this.totalRecords = body.total;
      this.searchResultMsg = "";

      console.log(body);
      
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });
  }

  buscar(){
    if (!this.txtbuscar || this.txtbuscar===""){
      this.loadProductos();
      return;
    }

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
      this.searchResultMsg = `Se encontraron ${body.found} registros.`
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });
  }

  edit(id?:string){
    this.router.navigate([`producto/${id}`]);
  }

  delete(producto:any){
    // alert("eliminar:" + producto.nombre);
    Swal.fire({
      title: '¿En verdad quiere eliminar este producto?',
      text: "El producto sera borrado permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.productosService.delete(producto._id)
            .then(()=>{
              Swal.fire(
                'Producto eliminado',
                'El producto ha sido eliminado con exito',
                'success'
                );
            });
      }
    })
  }

  toggleDelete(){
    this.showDeleteButtons = !this.showDeleteButtons;
  }

  paginate(pageEvent:any){
    if(pageEvent.page != this.currentPage){
      this.currentPage = pageEvent.page;
      console.log("cambio de pagina", pageEvent);
      this.pageinfo = {
        ...this.pageinfo,
        ...pageEvent
      };

      this.loadProductos();
    }
  }

  setOrder(colname:string){
    this.pageinfo.sort = colname;
    this.pageinfo.first = 0;
    
    this.loadProductos();
  }

}
