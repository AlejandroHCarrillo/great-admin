import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { PAGE_SIZE } from '../../config/settings'

import { Alumno } from 'src/app/interfaces/alumno';
import { AlumnosService } from 'src/app/services/alumnos.service';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit {
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
  alumnos: Alumno[] = [];

  constructor(  private router: Router,
                private alumnosService: AlumnosService) { }

  ngOnInit(): void {
    this.loadAlumnos();
  }

  loadAlumnos(){
    let queryParams = `desde=${this.pageinfo.first}&records=${this.pageinfo.rows}&sort=${this.pageinfo.sort}`

    let prevScreen = localStorage.getItem("prevScreen") || '';
    if (prevScreen == "alumno"){
      queryParams = localStorage.getItem("lastquery")||'';
      localStorage.setItem('prevScreen', '');
    }

    // console.log(queryParams);
    localStorage.setItem('lastquery', queryParams);
    
    this.alumnosService
    .getAlumnos(queryParams)
    .then(async (resp)=>{
      const body = await resp.json();
      this.alumnos = body.alumnos;
      this.totalRecords = body.total;
      this.searchResultMsg = "";
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });
  }

  buscar(){
    if (!this.txtbuscar || this.txtbuscar===""){
      this.loadAlumnos();
      return;
    }

    let queryParams = `desde=${this.pageinfo.first}&records=${this.pageinfo.rows}&sort=${this.pageinfo.sort}`

    let prevScreen = localStorage.getItem("prevScreen") || '';
    if (prevScreen == "alumno"){
      queryParams = localStorage.getItem("lastquery")||'';
      localStorage.setItem('prevScreen', '');
    }

    // console.log(queryParams);
    localStorage.setItem('lastquery', queryParams);
    
    this.alumnosService
    .findAlumnos(queryParams, this.txtbuscar)
    .then(async (resp)=>{
      const body = await resp.json();
      this.alumnos = body.alumnos;
      this.totalRecords = body.total;
      this.searchResultMsg = `Se encontraron ${body.found} registros.`
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });
  }

  edit(id?:string){
    this.router.navigate([`alumno/${id}`]);
  }

  delete(alumno:any){
    // alert("eliminar:" + alumno.nombre);
    Swal.fire({
      title: '¿En verdad quiere eliminar este alumno?',
      text: "El alumno sera borrado permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.alumnosService.delete(alumno._id)
            .then(()=>{
              Swal.fire(
                'Alumno eliminado',
                'El alumno ha sido eliminado con exito',
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

      this.loadAlumnos();
    // }
  }

  setOrder(colname:string){
    this.pageinfo.sort = colname;
    this.pageinfo.first = 0;
    
    this.loadAlumnos();
  }

}
