import { Component, OnInit } from '@angular/core';

import { getFormaPago, getMes, sumArrayNumeric } from 'src/app/helpers/tools';
import { DropDownItem } from 'src/app/interfaces/drop-down-item';
import { PagosService } from 'src/app/services/pagos.service';

@Component({
  selector: 'app-pagos-report',
  templateUrl: './pagos-report.component.html',
  styleUrls: ['./pagos-report.component.css']
})
export class PagosReportComponent implements OnInit {
  sum = sumArrayNumeric;
  getFormaPago = getFormaPago;
  
  datareport: any[] = [];
  grantotal: number = 0;
  totalrecords: number = 0;
  
  dataByFormaPagoReport: any[] = [];
  grantotalFormaPago: number = 0;
  totalrecordsFormaPago: number = 0;
  
  dropDownYears: DropDownItem[] = [];
  yearSelected: DropDownItem = new DropDownItem();

  dataG: any[] = [];
  strlabels: string[] = [];
  showGraphic: boolean = false;
  graphTitle: string = "Cobranza";

  dataGXFormaPago: any[] = [];
  strlabelsXFormaPago: string[] = [];
  showGraphicXFormaPago: boolean = false;
  graphTitleXFormaPago: string = "Cobranza por forma de pago";

  constructor( private pagosService: PagosService ) {

   }

  ngOnInit(): void {
    this.populateDropDownYears();
    this.getDataGraph();
    this.getDatabyFormaPagoGraph();
  }

  getDataGraph(){
    this.pagosService.getPagosReport(this.yearSelected.code)
    .then(async (resp)=>{
      this.showGraphic = false;

      // console.log(resp);
      const body = await resp.json();
      // console.log(body);

      if(!body.ok){
        // console.log("No hay ciclos escolares");
        // this.showToastMessage("Incripciones", "No hay inscripciones", eSeverityMessages.error);
        return;        
      }
      this.datareport = [ ...body.reporte ];

      this.totalrecords = body.totalcount || 0;
      this.grantotal = body.totalamount || 0;
    
      this.completeMonthsData();

      // this.barChartLabels = this.datareport.map((x)=>( getMes( (x._id).substr(-2) ) ));
      this.strlabels = this.datareport.map((x)=>( getMes( (x._id).substr(-2) ) ));
      this.dataG = this.datareport.map((x)=>(x.montototal));

      this.graphTitle = `Cobranza ${ this.yearSelected.name }`;
      this.showGraphic = true;

    });
  }

  getDatabyFormaPagoGraph(){
    console.log("Cargando reportes por forma de pago");
    
    this.pagosService.getPagosByFormaPagoReport(this.yearSelected.code)
    .then(async (resp)=>{
      this.showGraphicXFormaPago = false;
      const body = await resp.json();
      // console.log(body);

      if(!body.ok){
        console.log("No hay ciclos escolares");
        // this.showToastMessage("Incripciones", "No hay inscripciones", eSeverityMessages.error);
        return;        
      }
      this.dataByFormaPagoReport = [ ...body.reporte ];

      this.totalrecordsFormaPago = body.totalcount || 0;
      this.grantotalFormaPago = body.totalamount || 0;
    
      const labels: any[] = this.dataByFormaPagoReport.map((x)=>( getFormaPago( x._id ) ));
      
      this.strlabelsXFormaPago = labels;

      this.dataGXFormaPago = this.dataByFormaPagoReport.map((x)=>(x.montototal));
      
      this.graphTitleXFormaPago = `Cobranza por forma de pago ${ this.yearSelected.name }`;
      this.showGraphicXFormaPago = true;

    });
  }

  completeMonthsData(){
    for (let i = 0; i < 12; i++) {      
      const dataId = `${this.yearSelected.code}-${ ('0' + (i+1)).substr(-2) }`
      const found = this.datareport.find((x)=>(x._id === dataId))
      if(!found){
        this.datareport.push( {
          _id: dataId,
          count: 0,
          montototal: 0
        });
      }
    }
    this.datareport.sort(this.sortDataByYearMonth);
  }

  sortDataByYearMonth(a: any, b: any){
    return a._id < b._id  ? -1 : 1;
  }

  populateDropDownYears(){
    const currYear = new Date().getFullYear();
    for (let i = currYear-3; i <= currYear + 2; i++) {
      this.dropDownYears.push(
        new DropDownItem(i.toString(), i.toString())
      );
    }
    // this.yearSelected = new DropDownItem(currYear.toString(), currYear.toString());
    this.yearSelected = new DropDownItem("2020", "2020");
  }

  onChangeDDYears(event: any){
    this.getDataGraph();
    this.getDatabyFormaPagoGraph();
  }
}
