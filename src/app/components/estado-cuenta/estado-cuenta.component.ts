import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { eSeverityMessages } from 'src/app/config/enums';
import { CargosService } from 'src/app/services/cargos.service';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as moment from 'moment';
import { AlumnosListComponent } from '../alumnos/alumnos-list/alumnos-list.component';
import { Alumno } from 'src/app/interfaces/alumno';
import { DialogService } from 'primeng/dynamicdialog';
import { PagosService } from 'src/app/services/pagos.service';
import { EstadocuentaItem } from 'src/app/interfaces/estadocuenta-item.model';
import { element } from 'protractor';

@Component({
  selector: 'app-estado-cuenta',
  templateUrl: './estado-cuenta.component.html',
  styleUrls: ['./estado-cuenta.component.css']
})


export class EstadoCuentaComponent implements OnInit {
  fileName = "estadodecuenta";

  alumnoSelected: any;
  searchtext: string = "";
  searchResultMsg = "";

  cargos: any[] = [];
  cargosSelected: any[] = [];

  estadocuentareport: EstadocuentaItem[] = [];

  pagos: any[] = [];

  cols: any[] = [];
  exportColumns: any[] = [];

  saldo : number = 0;

  constructor( 
    private messageService: MessageService,
    private dialogService: DialogService,
    private cargosService: CargosService,
    private pagosService: PagosService
    ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'fecha', header: 'Fecha' },
      // { field: 'tipo', header: 'Tipo' },
      // { field: 'estatus', header: 'Estatus' },
      { field: 'concepto', header: 'Concepto' },
      { field: 'cargo', header: 'Cargo' },
      { field: 'abono', header: 'Abono' },
      { field: 'saldo', header: 'Saldo' },
      ];

      this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));

  }

  // loadCargos(){
  //   this.cargosService.getCargosByAlumno("6050fc972a99ae688413d942")
  //   .then(async (resp)=>{
  //     // console.log(resp);
  //     const body = await resp.json();
  //     console.log(body);

  //     if(!body.ok){
  //       // console.log("No cargos");
  //       this.showToastMessage("Cargos", "No hay cargos", eSeverityMessages.error);
  //       return;        
  //     }
  //     this.cargos = [ ...body.cargos ];
  //     this.mapCargosToReport(body.cargos);
  //   });
  // }

  // loadPagos(){
  //   this.pagosService.getPagosByAlumno("6050fc972a99ae688413d942")
  //   .then(async (resp)=>{
  //     // console.log(resp);
  //     const body = await resp.json();
  //     console.log(body);

  //     if(!body.ok){
  //       // console.log("No pagos");
  //       this.showToastMessage("Pagos", "No hay pagos", eSeverityMessages.error);
  //       return;        
  //     }
  //     this.pagos = [ ...body.pagos ];
  //     this.mapPagosToReport(body.pagos);
  //   });
  // }

  mapCargosToReport(data: any[]){
    this.estadocuentareport = [
      ...this.estadocuentareport, 
      ...data.map((cargo) => 
    ( 
      new EstadocuentaItem("", "cargo", 
        moment( cargo.fechavencimiento ).format("DD/MM/yyyy"), 
        cargo.concepto, cargo.tipocargo, cargo.monto, 0, cargo.estatus)
    )
    )];

  }

  mapPagosToReport(data: any[]){
    this.estadocuentareport = [
      ...this.estadocuentareport, 
      ...data.map((abono) => 
    ( 
      new EstadocuentaItem("", "abono", 
        moment( abono.fechapago ).format("DD/MM/yyyy"), 
        "Pago en " + String(abono.formapago).toLocaleLowerCase(), abono.formapago , 0, abono.montopagado, abono.estatus)
    )
    )];

  }

  showToastMessage(title: string = "", text: string = "", tipo: string = "success"){
    this.messageService.add( {
            key: 'tmKey', 
            severity: tipo || 'success', 
            summary: title || 'Titulo', 
            detail: `${text}` || 'Texto'});
  }

  exportPdf() {
    let title = "Reporte de Cargos";
    let footer = `Reporte generado el ${ moment(new Date() ).toString() }`;

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
    // data = this.estadocuentareport.map((x => ( Object.values(x) ) ));

    console.log("OJO: no esta mapeando aqui");
    
    // data = [ [this.estadocuentareport ] ];


    console.log(headers);
    console.log(this.estadocuentareport);

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
                                      2: { halign: 'left', cellWidth: 500 },
                                      3: { halign: 'right' },
                                      4: { halign: 'right' },
                                      5: { halign: 'right' }
                                      }, 
                      margin: { top: 20 },
                      head: [headers],
                      body: data,
                      foot: [["", "", "", "", ""]],
                    });

    doc.save(`${this.fileName}.pdf`);

  }

  exportExcel() {
      import("xlsx").then(xlsx => {
          const worksheet = xlsx.utils.json_to_sheet(this.estadocuentareport );
          const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, this.fileName);
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

  showAlumnosList() {
    const ref = this.dialogService.open(AlumnosListComponent, {
      header: 'Seleccione un alumno',
      width: '70%',
      data: {
        searchtext: this.searchtext
      }
    });

    ref.onClose.subscribe(async(alumno: Alumno) => {
        // console.log("Alumno seleccionado: ", alumno);
        if (!alumno) {
          this.cargos = [];
          return
        };
        this.alumnoSelected = { ...alumno };
        this.messageService.add({severity:'info', summary: 'Alumno seleccionado', detail:'matricula:' + alumno.matricula });
        
        this.estadocuentareport = [];

        this.cargos = await this.cargosService.findCargosByAlumno( alumno.id );
        this.mapCargosToReport(this.cargos);

        this.pagos = await this.pagosService.findPagosPorAlumno( alumno.id );
        this.mapPagosToReport(this.pagos);

        this.estadocuentareport.sort(this.comparefechas)
        this.calcularSaldos();
    });
  }

  private comparefechas(a:any, b:any) {
    return moment(a.fecha).diff(b.fecha, "day") < 0 ? -1 : 1;
    // if (a.fecha > b.fecha) return 1;
    // if (b.fecha > a.fecha) return -1;  
    // return 0;
  }

  private calcularSaldos() {
    let saldo = 0;
    for (let i = 0; i < this.estadocuentareport.length; i++) {
      // const element = this.estadocuentareport[i];
      saldo += this.estadocuentareport[i].cargo;
      saldo -= this.estadocuentareport[i].abono;

      this.estadocuentareport[i].saldo = saldo;

      // console.log(this.estadocuentareport[i].saldo);      
    }

    this.saldo = saldo;

  }

}
