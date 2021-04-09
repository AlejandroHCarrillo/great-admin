import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { eSeverityMessages } from 'src/app/config/enums';
import { InscripcionesService } from 'src/app/services/inscripciones.service';

@Component({
  selector: 'app-incripciones-report',
  templateUrl: './incripciones-report.component.html',
  styleUrls: ['./incripciones-report.component.css']
})
export class IncripcionesReportComponent implements OnInit {

  inscripciones: any[] = [];

  constructor( 
    private messageService: MessageService,
    private inscripcionesService: InscripcionesService 
    ) { }

  ngOnInit(): void {
    this.loadInscripciones();
  }

  loadInscripciones(){
    this.inscripcionesService.getInscripciones()
    .then(async (resp)=>{
      // console.log(resp);
      const body = await resp.json();
      // console.log(body);

      if(!body.ok){
        // console.log("No hay ciclos escolares");
        this.showToastMessage("Incripciones", "No hay inscripciones", eSeverityMessages.error);
        return;        
      }
      this.inscripciones = [ ...body.inscripciones ];
      // this.cicloSelected = body.ciclosescolares[0];
    });
  }

  showToastMessage(title: string = "", text: string = "", tipo: string = "success"){
    this.messageService.add( {
            key: 'tmKey', 
            severity: tipo || 'success', 
            summary: title || 'Titulo', 
            detail: `${text}` || 'Texto'});
  }


}
