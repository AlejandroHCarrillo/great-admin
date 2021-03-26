import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PAGE_SIZE } from 'src/app/config/settings';

import { Alumno } from 'src/app/interfaces/alumno';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { setfocus } from 'src/app/helpers/tools';
    
@Component({
  selector: 'app-alumnos-list',
  templateUrl: './alumnos-list.component.html',
  styleUrls: ['./alumnos-list.component.css']
})
export class AlumnosListComponent implements OnInit {
  searchMode: boolean = false;
  txtbuscar: string = "";
  searchResultMsg = "";

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

  constructor(  private alumnoService: AlumnosService,
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
    if (prevScreen == "alumno"){
      queryParams = localStorage.getItem("lastquery")||'';
      localStorage.setItem('prevScreen', '');
    }

    localStorage.setItem('lastquery', queryParams);
    
    this.alumnoService
    .findAlumnos(queryParams, this.txtbuscar)
    .then(async (resp)=>{
      const body = await resp.json();
      this.alumnos = body.alumnos;
      this.totalRecords = body.found;
      this.searchResultMsg = `Se encontraron ${body.found || 0 } registros.`
      setfocus("txtbuscaralumno");
      // console.log(body);
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });
  }

  paginate(pageEvent:any){
    if(pageEvent.page != this.currentPage){
      this.currentPage = pageEvent.page;
      // console.log("cambio de pagina", pageEvent);
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
