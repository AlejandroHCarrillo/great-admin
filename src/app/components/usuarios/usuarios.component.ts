import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

import { Usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  txtbuscar: string = "";
  searchResultMsg = "";

  showDeleteButtons: boolean = false;
  pagesize = 10;

  pageinfo = {
                first : 0,
                rows : this.pagesize,
                page : 0,
                pageCount : 0,
                sort: 'nombre'
          };

  currentPage: number=0;
  totalRecords: number = 0;
  usuarios: Usuario[] = [];

  constructor(  private router: Router,
                private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(){
    let queryParams = `desde=${this.pageinfo.first}&records=${this.pageinfo.rows}&sort=${this.pageinfo.sort}`

    let prevScreen = localStorage.getItem("prevScreen") || '';
    if (prevScreen == "usuario"){
      queryParams = localStorage.getItem("lastquery")||'';
      localStorage.setItem('prevScreen', '');
    }

    // console.log(queryParams);
    localStorage.setItem('lastquery', queryParams);
    
    this.usuariosService
    .getUsuarios(queryParams)
    .then(async (resp)=>{
      const body = await resp.json();
      this.usuarios = body.usuarios;
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
      this.loadUsuarios();
      return;
    }

    let queryParams = `desde=${this.pageinfo.first}&records=${this.pageinfo.rows}&sort=${this.pageinfo.sort}`

    let prevScreen = localStorage.getItem("prevScreen") || '';
    if (prevScreen == "usuario"){
      queryParams = localStorage.getItem("lastquery")||'';
      localStorage.setItem('prevScreen', '');
    }

    // console.log(queryParams);
    localStorage.setItem('lastquery', queryParams);
    
    this.usuariosService
    .findUsuarios(queryParams, this.txtbuscar)
    .then(async (resp)=>{
      const body = await resp.json();
      this.usuarios = body.usuarios;
      this.totalRecords = body.total;
      this.searchResultMsg = `Se encontraron ${body.found} registros.`
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });
  }

  edit(id?:string){
    this.router.navigate([`usuario/${id}`]);
  }

  delete(usuario:any){
    // alert("eliminar:" + usuario.nombre);
    Swal.fire({
      title: '¿En verdad quiere eliminar este usuario?',
      text: "El usuario sera borrado permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuariosService.delete(usuario._id)
            .then(()=>{
              Swal.fire(
                'Usuario eliminado',
                'El usuario ha sido eliminado con exito',
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

      this.loadUsuarios();
    }
  }

  setOrder(colname:string){
    this.pageinfo.sort = colname;
    this.pageinfo.first = 0;
    
    this.loadUsuarios();
  }

}
