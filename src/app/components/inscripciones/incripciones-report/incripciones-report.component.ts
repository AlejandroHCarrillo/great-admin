import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ddNiveles, eSeverityMessages } from 'src/app/config/enums';
import { InscripcionesService } from 'src/app/services/inscripciones.service';

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as moment from 'moment';
import { sumArrayNumeric } from 'src/app/helpers/tools';
import { DropDownItem } from 'src/app/interfaces/drop-down-item';
import { CiclosescolaresService } from 'src/app/services/ciclosescolares.service';
import { CicloEscolar } from 'src/app/interfaces/cicloescolar';
@Component({
  selector: 'app-incripciones-report',
  templateUrl: './incripciones-report.component.html',
  styleUrls: ['./incripciones-report.component.css']
})
export class IncripcionesReportComponent implements OnInit {
  sum = sumArrayNumeric;
  ciclosescolares : DropDownItem[] = [];
  cicloescolarSelected: DropDownItem = new DropDownItem("", "6089bd91f9c0f20f9821e9ec");

  niveles : DropDownItem[] = ddNiveles;
  nivelSelected: DropDownItem = ddNiveles[1];

  inscripciones: any[] = [];
  inscripcionesreport: any[] = [];
  inscripcionesSelected: any[] = [];

  cols: any[] = [];
  exportColumns: any[] = [];

  dataGraph: any[] = [];
  dataG: any[] = [];

  strlabels: string[] = [];
  showGraphic: boolean = false;
  graphTitle: string = "Incripciones NIVEL - CICLO";

  constructor( 
    private messageService: MessageService,
    private inscripcionesService: InscripcionesService,
    private ciclosEscolaresService: CiclosescolaresService
    ) { }

  ngOnInit(): void {

    this.loadCiclosEscolares();

    this.loadInscripciones();

    this.loadInscripcionesReport( this.nivelSelected.name );

    this.cols = [
      { field: 'cicloescolar', header: 'Ciclo Escolar' },
      { field: 'matricula', header: 'Matricula' },
      { field: 'nombrecompleto', header: 'Nombre' },
      { field: 'nivel', header: 'Nivel' },
      { field: 'grado', header: 'Grado' },
      ];

      this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));

  }

  loadCiclosEscolares(){
    this.ciclosEscolaresService.getCiclosEscolares()
    .then(async (resp)=>{
      const body = await resp.json();
      console.log(body.ciclosescolares);

      if(!body.ok){
        // console.log("No hay ciclos escolares");
        this.showToastMessage("Ciclos escoleres", "No hay ciclos escolares", eSeverityMessages.error);
        return;        
      }

      let ddciclos: any[] = (body.ciclosescolares as CicloEscolar[])
                            .filter((x:CicloEscolar)=>( x.activo === true ))
                            .map((x:CicloEscolar)=>( { name: x.nombre, code: x.id } ));

      this.cicloescolarSelected = ddciclos[0];
      this.ciclosescolares = ddciclos;

    });
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

      // console.log(this.inscripciones);
      
      this.inscripcionesreport = this.inscripciones.map((x) => 
        ( 
          { cicloescolar: x["cicloescolar"].nombre,
            matricula: x["alumno"].matricula,
            nombrecompleto: `${x["alumno"].nombre} ${x["alumno"].apaterno } ${x["alumno"].amaterno }`,
            nivel: x["alumno"].nivel,
            grado: x["alumno"].grado
          }
      )
      );
    });
  }

  loadInscripcionesReport(nivel: string){
    this.showGraphic = false;

    const urlQueryParams = `nivel=${nivel}`;
    this.inscripcionesService.getInscripcionesReport(this.cicloescolarSelected.code, urlQueryParams)
    .then(async (resp)=>{

      // console.log(resp);
      const body = await resp.json();
      // console.log(body);

      if(!body.ok){
        // console.log("No hay ciclos escolares");
        this.showToastMessage("Incripciones", "No hay inscripciones", eSeverityMessages.error);
        return;        
      }
      this.dataGraph = [ ...body.reporte ];
      this.dataGraph.sort(this.sortByGrado);

      this.graphTitle = `Inscripciones ${ this.nivelSelected.name } ${ this.cicloescolarSelected.name }`
      this.strlabels = this.dataGraph.map((x)=>(`Grado ${x._id.grado}º`));
      this.dataG = this.dataGraph.map((x)=>( x.count ));

      console.log("dataGraph: ", this.dataGraph );
      this.showGraphic = true;
    });
  }

  private sortByGrado(a:any, b:any) {
    // sort by grado
    return a._id.grado < b._id.grado  ? -1 : 1;
  }

  showToastMessage(title: string = "", text: string = "", tipo: string = "success"){
    this.messageService.add( {
            key: 'tmKey', 
            severity: tipo || 'success', 
            summary: title || 'Titulo', 
            detail: `${text}` || 'Texto'});
  }

  exportPdf() {
    let title = "Reporte de Inscripciones";
    let footer = `Reporte generado el ${ moment(new Date() ).toString() }`;
    const filename = "reporteInscripciones.pdf";

    // const doc = new jsPDF();
    // const doc = new jsPDF("p", "px", "letter", true);
    const doc = new jsPDF();
    doc.setCreationDate(new Date())
    
    const headers = [...this.cols.map( (x)=>( x.header ) )];

    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    let textWide = doc.getStringUnitWidth(title);
    let fontwide = doc.getFontSize();
    let offsetX = (textWide * fontwide)/2;

    var data = [ [] ];    
    data = this.inscripcionesreport.map((x => ( Object.values(x) ) ));

    // console.log(headers);
    // console.log(this.inscripcionesreport);

    doc.setFont( "times", "italic", 500);
    doc.setTextColor("navy");
    doc.setFontSize(14);

    doc.text(title, (pageWidth / 2) - title.length , 10 );

    doc.setFont("Helvetica", "italic", 200);
    doc.setTextColor("gray");
    doc.setFontSize(8);

    textWide = doc.getStringUnitWidth(footer);
    fontwide = doc.getFontSize();
    offsetX = (textWide * fontwide)/2;

    doc.text(footer, pageWidth - offsetX, pageHeight - 10);

    autoTable(doc, {
                      // styles: { fillColor: [188, 188, 188], textColor: [0,0,0] },
                      styles: { halign: 'center' },
                      columnStyles: { 0: { halign: 'left' },
                                      1: { halign: 'left' },
                                      2: { halign: 'left' },
                                      3: { halign: 'left' }
                                     }, 
                      margin: { top: 20 },
                      head: [headers],
                      body: data,
                      foot: [["", "", "", "", ""]],
                      // didDrawCell: (data) => {
                      // console.log(data.column.index)
                      // },
                    });

    // const htmltable = document.getElementById("reporttable");
    // const strtable = htmltable?.innerText || "";
    // console.log(strtable );

    // doc.html(strtable, {
    //   callback: (doc)=>{
    //     doc.save(filename);
    //   }, 
    //   margin: 300,      
    // });
    doc.save(filename);

  }

  exportExcel() {
      import("xlsx").then(xlsx => {
          const worksheet = xlsx.utils.json_to_sheet( this.inscripcionesreport );
          const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, "inscripciones");
      });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
      import("file-saver").then(FileSaver => {
          let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          let EXCEL_EXTENSION = '.xlsx';
          const data: Blob = new Blob([buffer], {
              type: EXCEL_TYPE
          });
          FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      });
  }

  onChangeNivel(event: any){
    this.loadInscripcionesReport(this.nivelSelected.code);
  }

  onChangeCicloEscolar(event: any){    
    this.loadInscripcionesReport(this.nivelSelected.code);
  }

}
