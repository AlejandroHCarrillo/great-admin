import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { eSeverityMessages } from 'src/app/config/enums';
import { InscripcionesService } from 'src/app/services/inscripciones.service';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as moment from 'moment';
import { devOnlyGuardedExpression } from '@angular/compiler';
@Component({
  selector: 'app-incripciones-report',
  templateUrl: './incripciones-report.component.html',
  styleUrls: ['./incripciones-report.component.css']
})
export class IncripcionesReportComponent implements OnInit {

  inscripciones: any[] = [];
  inscripcionesreport: any[] = [];
  inscripcionesSelected: any[] = [];

  cols: any[] = [];
  exportColumns: any[] = [];

  constructor( 
    private messageService: MessageService,
    private inscripcionesService: InscripcionesService 
    ) { }

  ngOnInit(): void {
    this.loadInscripciones();

    this.cols = [
      { field: 'cicloescolar', header: 'Ciclo Escolar' },
      { field: 'nivel', header: 'Nivel' },
      { field: 'grado', header: 'Grado' },
      { field: 'matricula', header: 'Matricula' },
      { field: 'nombrecompleto', header: 'Nombre' }
      ];

      this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));

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

      this.inscripcionesreport = this.inscripciones.map((x) => 
        ( 
          { cicloescolar: x["cicloescolar"].nombre,
            nivel: x["alumno"].nivel,
            grado: x["alumno"].grado,
            matricula: x["alumno"].matricula,
            nombrecompleto: `${x["alumno"].nombre} ${x["alumno"].apaterno } ${x["alumno"].amaterno }`
          }
      )
      );
    });
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

    // const doc = new jsPDF();
    // const doc = new jsPDF("p", "px", "letter", true);
    const doc = new jsPDF();
    doc.setCreationDate(new Date())
    let fonts = doc.getFontList();
    console.log(fonts);
    
    const headers = [...this.cols.map( (x)=>( x.header ) )];

    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    let textWide = doc.getStringUnitWidth(title);
    let fontwide = doc.getFontSize();
    let offsetX = (textWide * fontwide)/2;

    var data = [ [] ];    
    data = this.inscripcionesreport.map((x => ( Object.values(x) ) ));

    console.log(headers);
    console.log(this.inscripcionesreport);

    console.log( Object.keys(fonts) );
    console.log( Object.values(fonts) );

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
                      columnStyles: { 1: { halign: 'left' },
                                      3: { halign: 'left'},
                                      4: { halign: 'left'}
                                     }, 
                      margin: { top: 20 },
                      head: [headers],
                      body: data,
                      foot: [["1", "2", "3", "4", "5"]],
                      didDrawCell: (data) => {
                      // console.log(data.column.index)
                      },
                    });

    // autoTable(doc, {
    //   styles: { fillColor: [255, 0, 0] },
    //   columnStyles: { 0: { halign: 'center', fillColor: [0, 255, 0] } }, // Cells in first column centered and green
    //   margin: { top: 10 },
    //   head: headers,
    //   body: data,
    //   didDrawCell: (data) => {
    //   // console.log(data.column.index)
    //   }
    // });


    doc.save('table.pdf');

  }

  exportExcel() {
      import("xlsx").then(xlsx => {
          const worksheet = xlsx.utils.json_to_sheet(this.inscripcionesreport );
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
}
