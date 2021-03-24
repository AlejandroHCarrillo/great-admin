import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { PAGE_SIZE } from '../../config/settings'


import { Cliente } from 'src/app/interfaces/cliente';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
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
  clientes: Cliente[] = [];

  constructor(  private router: Router,
                private clientesService: ClientesService) { }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(){
    let queryParams = `desde=${this.pageinfo.first}&records=${this.pageinfo.rows}&sort=${this.pageinfo.sort}`

    let prevScreen = localStorage.getItem("prevScreen") || '';
    if (prevScreen == "cliente"){
      queryParams = localStorage.getItem("lastquery")||'';
      localStorage.setItem('prevScreen', '');
    }

    // console.log(queryParams);
    localStorage.setItem('lastquery', queryParams);
    
    this.clientesService
    .getClientes(queryParams)
    .then(async (resp)=>{
      const body = await resp.json();
      this.clientes = body.clientes;
      this.totalRecords = body.total;
      this.searchResultMsg = "";
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });
  }

  buscar(){
    if (!this.txtbuscar || this.txtbuscar===""){
      this.loadClientes();
      return;
    }

    let queryParams = `desde=${this.pageinfo.first}&records=${this.pageinfo.rows}&sort=${this.pageinfo.sort}`

    let prevScreen = localStorage.getItem("prevScreen") || '';
    if (prevScreen == "cliente"){
      queryParams = localStorage.getItem("lastquery")||'';
      localStorage.setItem('prevScreen', '');
    }

    // console.log(queryParams);
    localStorage.setItem('lastquery', queryParams);
    
    this.clientesService
    .findClientes(queryParams, this.txtbuscar)
    .then(async (resp)=>{
      const body = await resp.json();
      this.clientes = body.clientes;
      this.totalRecords = body.total;
      this.searchResultMsg = `Se encontraron ${body.found} registros.`
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });
  }

  edit(id?:string){
    this.router.navigate([`cliente/${id}`]);
  }

  delete(cliente:any){
    // alert("eliminar:" + cliente.nombre);
    Swal.fire({
      title: '¿En verdad quiere eliminar este cliente?',
      text: "El cliente sera borrado permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.clientesService.delete(cliente._id)
            .then(()=>{
              Swal.fire(
                'Cliente eliminado',
                'El cliente ha sido eliminado con exito',
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
    // if(pageEvent.page != this.currentPage){
      this.currentPage = pageEvent.page;
      console.log("cambio de pagina", pageEvent);
      this.pageinfo = {
        ...this.pageinfo,
        ...pageEvent
      };

      this.loadClientes();
    // }
  }

  setOrder(colname:string){
    this.pageinfo.sort = colname;
    this.pageinfo.first = 0;
    
    this.loadClientes();
  }

}
