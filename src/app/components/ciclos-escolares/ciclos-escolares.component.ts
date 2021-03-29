import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PAGE_SIZE } from 'src/app/config/settings';
import { isDate } from 'src/app/helpers/tools';
import { CicloEscolar } from 'src/app/interfaces/cicloescolar';
import { PageInfo } from 'src/app/interfaces/pageinfo.model';
import { CiclosescolaresService } from 'src/app/services/ciclosescolares.service';


@Component({
  selector: 'app-ciclos-escolares',
  templateUrl: './ciclos-escolares.component.html',
  styleUrls: ['./ciclos-escolares.component.css', './primetable.scss']
})
export class CiclosEscolaresComponent implements OnInit {
  cicloescolarDialog: boolean = false;
  ciclosescolares: CicloEscolar[] = [];
  cicloescolar?: any;
  ciclosescolaresSelected: CicloEscolar[] = [];
  submitted: boolean = false;

  isDate = isDate;
  txtbuscar: string = "";

  pageinfo : PageInfo = new PageInfo(1, PAGE_SIZE, 1, 1, "nombre");
  totalRecords: number = 0;

  constructor(private ciclosService: CiclosescolaresService, 
              private messageService: MessageService, 
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    console.log("ciclos init");
    this.loaddata();

  }

loaddata(){
    let queryParams = `desde=${this.pageinfo.first}&records=${this.pageinfo.rows}&sort=${this.pageinfo.sort}`
    this.ciclosService.getCiclosEscolares(queryParams)    
        .then(async (resp)=>{
            console.log("resp: ", resp);
            const body = await resp.json();
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
    this.cicloescolar = {};
    this.submitted = false;
    this.cicloescolarDialog = true;
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
    this.cicloescolarDialog = true;
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
                        this.cicloescolar = {};
                        this.messageService.add({
                            severity:'success', 
                            summary: cicloescolar.nombre + 'Ciclo escolar', 
                            detail: 'Eliminado con exito', life: 3000});
                    });
        }
    });
}

hideDialog() {
    this.cicloescolarDialog = false;
    this.submitted = false;
}

save() {
    this.submitted = true;
    if (!this.cicloescolar?.nombre || 
        !isDate(this.cicloescolar.fechaInicio) ||
        !isDate(this.cicloescolar.fechaFin)        
         ) {
            console.log("Hubo un error al guardar");
            return;
    } else{
        if (this.cicloescolar.id) {
            // Actualizar
            this.ciclosService.save(this.cicloescolar)
                .then(async (resp) => {
                    console.log(resp);
                    if(resp.ok){
                        this.messageService.add({
                            severity:'success', 
                            summary: 'Ciclo escolar', 
                            detail: 'Actualizado con exito', 
                            life: 3000});
                        
                        // const body = await resp.json();
                        this.ciclosescolares[this.findIndexById(this.cicloescolar.id)] = this.cicloescolar;

                        this.cicloescolarDialog = false;
                        this.cicloescolar = {};
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
                            detail: 'Creado con exito', 
                            life: 3000});            
                        
                        const body = await resp.json();
                        this.cicloescolar.id = body.id;                        
                        this.ciclosescolares.push(this.cicloescolar);

                        this.cicloescolarDialog = false;
                        this.cicloescolar = {};
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

createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 5; i++ ) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

}
