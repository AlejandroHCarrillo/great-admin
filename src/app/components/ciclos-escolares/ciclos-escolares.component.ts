import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PAGE_SIZE } from 'src/app/config/settings';
import { dateEsp2Eng, isDate } from 'src/app/helpers/tools';
import { CicloEscolar } from 'src/app/interfaces/cicloescolar';
import { PageInfo } from 'src/app/interfaces/pageinfo.model';
import { CiclosescolaresService } from 'src/app/services/ciclosescolares.service';


@Component({
  selector: 'app-ciclos-escolares',
  templateUrl: './ciclos-escolares.component.html',
  styleUrls: ['./ciclos-escolares.component.css', './primetable.scss']
})

export class CiclosEscolaresComponent implements OnInit {
    isDate = isDate;
    dateEsp2Eng = dateEsp2Eng;

    showCicloescolarDialog: boolean = false;
    ciclosescolares: CicloEscolar[] = [];
    cicloescolar: CicloEscolar = new CicloEscolar(true, "", new Date(), new Date());
    ciclosescolaresSelected: CicloEscolar[] = [];
    submitted: boolean = false;

    txtbuscar: string = "";

    pageinfo : PageInfo = new PageInfo(1, PAGE_SIZE, 1, 1, "nombre");
    totalRecords: number = 0;

    fInicio: string = "";
    fFin: string = "";

    constructor(private ciclosService: CiclosescolaresService, 
                private messageService: MessageService, 
                private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        // console.log("ciclos init");
        this.loaddata();
    }

loaddata(){
    let queryParams = `desde=${this.pageinfo.first}&records=${this.pageinfo.rows}&sort=${this.pageinfo.sort}`
    this.ciclosService.getCiclosEscolares(queryParams)    
        .then(async (resp)=>{
            const body = await resp.json();
            console.log("body: ", body);
            this.ciclosescolares = body.ciclosescolares;
            this.totalRecords = body.total;
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });
  }

  buscar(){
      console.log("buscar: ", this.txtbuscar);
      
    if (!this.txtbuscar || this.txtbuscar===""){
    //   this.loadCiclo escolaros();
      return;
    }

    let queryParams = `desde=${this.pageinfo.first}&records=${this.pageinfo.rows}&sort=${this.pageinfo.sort}`

    let prevScreen = localStorage.getItem("prevScreen") || '';
    if (prevScreen == "cicloescolar"){
      queryParams = localStorage.getItem("lastquery")||'';
      localStorage.setItem('prevScreen', '');
    }

    // console.log(queryParams);
    localStorage.setItem('lastquery', queryParams);
    
    this.ciclosService
    .findCiclosEscolares(queryParams, this.txtbuscar)
    .then(async (resp)=>{
        console.log("resp: ", resp);        
        const body = await resp.json();
        this.ciclosescolares = body.ciclosescolares;
        this.totalRecords = body.total;
    // //   this.searchResultMsg = `Se encontraron ${body.found} registros.`
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });
  }

openNew() {
    this.cicloescolar = new CicloEscolar(true, "", new Date(), new Date());
    this.fInicio = moment( new Date() ).format("DD/MM/yyyy");
    this.fFin = moment( new Date() ).format("DD/MM/yyyy");

    this.submitted = false;
    this.showCicloescolarDialog = true;
}

deleteSelectedItems() {
    this.confirmationService.confirm({
        message: '¿Esta seguro de eliminar los ciclos escolares seleccionados?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            console.log(this.ciclosescolaresSelected);
            this.ciclosescolaresSelected.forEach(ciclo => {
                console.log("Eliminando ciclo: ", ciclo.id);
                this.ciclosService.delete(ciclo.id || "")
                    .then((resp)=>{
                        console.log(resp);
                        this.ciclosescolares = this.ciclosescolares.filter(val => val.id !== ciclo.id);
                        this.messageService.add({
                            severity:'success', 
                            summary: 'Ciclo escolar', 
                            detail: ciclo.nombre + 'eliminado con exito', life: 3000});
                    });
            });
            
            // this.ciclosescolares = this.ciclosescolares.filter(val => !this.ciclosescolaresSelected.includes(val));
            this.ciclosescolaresSelected = [];
            this.messageService.add({severity:'success', summary: 'Ciclos escolares', detail: 'Eliminados con exito', life: 3000});
        }
    });
}

edit(cicloescolar: CicloEscolar) {
    this.cicloescolar = {...cicloescolar};

    this.fInicio = moment( this.cicloescolar.fechaInicio ).format("DD/MM/yyyy");
    this.fFin = moment( this.cicloescolar.fechaFin ).format("DD/MM/yyyy");

    this.showCicloescolarDialog = true;
}

delete(cicloescolar: CicloEscolar) {
    this.confirmationService.confirm({
        message: '¿Esta seguro de eliminar el ciclo ' + cicloescolar.nombre + '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {            
            this.ciclosService.delete(cicloescolar.id || "")
                    .then(()=>{
                        this.ciclosescolares = this.ciclosescolares.filter(val => val.id !== cicloescolar.id);
                        this.cicloescolar = new CicloEscolar(true, "", new Date(), new Date());;
                        this.messageService.add({
                            severity:'success', 
                            summary: cicloescolar.nombre + 'Ciclo escolar', 
                            detail: 'Eliminado con exito', life: 3000});
                    });
        }
    });
}

hideDialog() {
    this.showCicloescolarDialog = false;
    this.submitted = false;
}

save() {
    // console.log("saving...");
    this.submitted = true;

    this.cicloescolar.fechaInicio = new Date( dateEsp2Eng(this.fInicio) );
    this.cicloescolar.fechaFin = new Date( dateEsp2Eng(this.fFin) );

    if (!this.cicloescolar?.nombre || 
        !isDate(this.cicloescolar.fechaInicio.toString()) ||
        !isDate(this.cicloescolar.fechaFin.toString())
         ) {
            console.log("Hubo un error al guardar");
            return;
    } else{
        if (this.cicloescolar.id) {
    // console.log("updating...", this.cicloescolar);
            // Actualizar
            this.ciclosService.update(this.cicloescolar)
                .then(async (resp) => {
                    // console.log(resp);
                    if(resp.ok){
                        this.messageService.add({
                            severity:'success', 
                            summary: 'Ciclo escolar', 
                            detail: this.cicloescolar.nombre + ' actualizado con exito', 
                            life: 3000});
                        
                        // const body = await resp.json();
                        this.ciclosescolares[this.findIndexById(this.cicloescolar.id || '' )] = this.cicloescolar;

                        this.showCicloescolarDialog = false;
                        this.cicloescolar = new CicloEscolar(true, "", new Date(), new Date());

                        this.hideDialog();
                      }
                
                });


        }
        else {
            // Guardar
            this.ciclosService.save(this.cicloescolar)
                .then(async (resp) => {
                    console.log(resp);
                    if(resp.ok){
                        this.messageService.add({
                            severity:'success', 
                            summary: 'Ciclo escolar', 
                            detail: this.cicloescolar.nombre + 'creado con exito', 
                            life: 3000});            
                        
                        const body = await resp.json();
                        this.cicloescolar.id = body.id;                        
                        this.ciclosescolares.push(this.cicloescolar);

                        this.showCicloescolarDialog = false;
                        this.cicloescolar = new CicloEscolar(true, "", new Date(), new Date());
                        
                        this.hideDialog();
                      }
                
                });
        }

        // this.ciclosescolares = [...this.ciclosescolares];
        // this.cicloescolarDialog = false;
        // this.cicloescolar = {};
    }
}

findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.ciclosescolares.length; i++) {
        if (this.ciclosescolares[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

}
