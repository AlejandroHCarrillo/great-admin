import { Component, OnInit } from '@angular/core';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

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

  public barChartDataByFormaPago: ChartDataSets[] = [{ 
    label: '',
    data: [], 
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 1
  }];
  
  dropDownYears: DropDownItem[] = [];
  ddYearSelected: DropDownItem = new DropDownItem();
  // yearSelected: string = "2022";
  yearSelected: DropDownItem = new DropDownItem();

  // barChartData: any[] = [];
  // barChartLabels: any[] = [];
  // barChartOptions: any[] = [];

  // Configurar grafica
  barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], 
              yAxes: [{ ticks: { beginAtZero: true } }] 
            },
    plugins: {
      datalabels: {
        formatter: (value, ctx) =>{
          let dataArr = this.barChartData;
          let total = sumArrayNumeric(dataArr);     // sum from lodash        
          let percentage = (value * 100 / total).toFixed(2) + "%";
          return percentage;
        },
        anchor: 'end',
        align: 'end',
      }
    }
  };

  barChartOptionsByFormaPago: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], 
              yAxes: [{ ticks: { beginAtZero: true } }] 
            },
    plugins: {
      datalabels: {
        formatter: (value, ctx) =>{
          let dataArr = this.barChartDataByFormaPago;
          let total = sumArrayNumeric(dataArr);     // sum from lodash        
          let percentage = (value * 100 / total).toFixed(2) + "%";
          return percentage;
        },
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public barChartLabels: Label[] = [];
  public barChartLabelsByFormaPago: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [{ 
    label: '',
    data: [], 
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 1
  }];

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
    
      this.completeData();

      this.barChartLabels = this.datareport.map((x)=>( getMes( (x._id).substr(-2) ) ));

      let data = this.datareport.map((x)=>(x.montototal));

      this.barChartData = [
        {
          label: `Ingresos`,
          data: data, 
          backgroundColor:  'rgba(75, 192, 192, 0.3)',
          borderColor: [ 'rgba(75, 192, 192, 0.8)' ],
          borderWidth: 2
        }
      ];

    });
  }

  getDatabyFormaPagoGraph(){
    console.log("Cargando reportes por forma de pago");
    
    this.pagosService.getPagosByFormaPagoReport(this.yearSelected.code)
    .then(async (resp)=>{
      // console.log(resp);
      const body = await resp.json();
      // console.log(body);

      if(!body.ok){
        // console.log("No hay ciclos escolares");
        // this.showToastMessage("Incripciones", "No hay inscripciones", eSeverityMessages.error);
        return;        
      }
      this.dataByFormaPagoReport = [ ...body.reporte ];

      this.totalrecordsFormaPago = body.totalcount || 0;
      this.grantotalFormaPago = body.totalamount || 0;
    
      const labels = this.dataByFormaPagoReport.map((x)=>( getFormaPago( x._id ) ));
      this.barChartLabelsByFormaPago = [...(labels as Label[])];
      
      let data = this.dataByFormaPagoReport.map((x)=>(x.montototal));

      this.barChartDataByFormaPago = [
        {
          label: `Ingresos por forma de pago`,
          data: data, 
          backgroundColor:  'rgba(75, 192, 250, 0.3)',
          borderColor: [ 'rgba(75, 192, 250, 0.8)' ],
          borderWidth: 2
        }
      ];

    });
  }

  completeData(){
    for (let i = 0; i < 12; i++) {      
      const dataId = `${this.yearSelected.code}-${ ('0' + (i+1)).substr(-2) }`
      // console.log("dataId: ", dataId);
      const found = this.datareport.find((x)=>(x._id === dataId))
      // console.log(found);
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
    // years: DropDownItem[] = [];
    const currYear = new Date().getFullYear();
    for (let i = currYear-3; i <= currYear + 2; i++) {
      this.dropDownYears.push(
        new DropDownItem(i.toString(), i.toString())
      );
    }
    this.yearSelected = new DropDownItem(currYear.toString(), currYear.toString());
  }

  onChangeDDYears(event: any){
    this.getDataGraph();
    this.getDatabyFormaPagoGraph();
  }
}
