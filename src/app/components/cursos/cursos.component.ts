import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { PAGE_SIZE } from '../../config/settings'


import { Curso } from 'src/app/interfaces/curso';
import { CursosService } from 'src/app/services/cursos.service';
import { PageInfo } from 'src/app/interfaces/pageinfo.model';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
  txtbuscar: string = "";
  searchResultMsg = "";

  showDeleteButtons: boolean = false;

  pageinfo : PageInfo = new PageInfo(0, PAGE_SIZE, 0, 0, "nombre");

  currentPage: number=0;
  totalRecords: number = 0;
  cursos: Curso[] = [];

  constructor(  private router: Router,
                private cursosService: CursosService) { }

  ngOnInit(): void {
    this.loadCursos();
  }

  loadCursos(){
    let queryParams = `desde=${this.pageinfo.first}&records=${this.pageinfo.rows}&sort=${this.pageinfo.sort}`

    let prevScreen = localStorage.getItem("prevScreen") || '';
    if (prevScreen == "curso"){
      queryParams = localStorage.getItem("lastquery")||'';
      localStorage.setItem('prevScreen', '');
    }

    // console.log(queryParams);
    localStorage.setItem('lastquery', queryParams);
    
    this.cursosService
    .getCursos(queryParams)
    .then(async (resp)=>{
      const body = await resp.json();
      this.cursos = body.cursos;
      this.totalRecords = body.total;
      this.searchResultMsg = "";
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });
  }

  buscar(){
    if (!this.txtbuscar || this.txtbuscar===""){
      this.loadCursos();
      return;
    }

    let queryParams = `desde=${this.pageinfo.first}&records=${this.pageinfo.rows}&sort=${this.pageinfo.sort}`

    let prevScreen = localStorage.getItem("prevScreen") || '';
    if (prevScreen == "curso"){
      queryParams = localStorage.getItem("lastquery")||'';
      localStorage.setItem('prevScreen', '');
    }

    // console.log(queryParams);
    localStorage.setItem('lastquery', queryParams);
    
    this.cursosService
    .findCursos(queryParams, this.txtbuscar)
    .then(async (resp)=>{
      const body = await resp.json();
      this.cursos = body.cursos;
      this.totalRecords = body.total;
      this.searchResultMsg = `Se encontraron ${body.found} registros.`
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });
  }

  edit(id?:string){
    this.router.navigate([`curso/${id}`]);
  }

  delete(curso:any){
    // alert("eliminar:" + curso.nombre);
    Swal.fire({
      title: '¿En verdad quiere eliminar este curso?',
      text: "El curso sera borrado permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.cursosService.delete(curso._id)
            .then(()=>{
              Swal.fire(
                'Curso eliminado',
                'El curso ha sido eliminado con exito',
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

      this.loadCursos();
    // }
  }

  setOrder(colname:string){
    this.pageinfo.sort = colname;
    this.pageinfo.first = 0;
    
    this.loadCursos();
  }

}
