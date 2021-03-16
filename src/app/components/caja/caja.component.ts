import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { PAGE_SIZE } from '../../config/settings'

import { Alumno } from 'src/app/interfaces/alumno';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { DropDownItem } from 'src/app/interfaces/drop-down-item';
import { ChartItem } from 'src/app/interfaces/chart-item';

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

  shoppingcart: ChartItem[]= [];

  constructor(  private router: Router,
                private alumnosService: AlumnosService) { }

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

}
