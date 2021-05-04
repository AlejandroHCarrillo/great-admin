import { Component, OnInit } from '@angular/core';
import { getMes, sumArrayNumeric } from 'src/app/helpers/tools';
import { CargosService } from 'src/app/services/cargos.service';
import { DropDownItem } from 'src/app/interfaces/drop-down-item';

@Component({
  selector: 'app-cargos-report',
  templateUrl: './cargos-report.component.html',
  styleUrls: ['./cargos-report.component.css']
})
export class CargosReportComponent implements OnInit {
  datareport: any[] = [];
  grantotal: number = 0;
  totalrecords: number = 0;
  
  dropDownYears: DropDownItem[] = [];
  ddYearSelected: DropDownItem = new DropDownItem();
  // yearSelected: string = "2022";
  yearSelected: DropDownItem = new DropDownItem();

  // barChartData: any[] = [];
  // barChartLabels: any[] = [];
  // barChartOptions: any[] = [];

  // dataGraph: any[] = [];
  dataG: any[] = [];

  strlabels: string[] = [];
  showGraphic: boolean = false;
  graphTitle: string = "Ingresos año";

  constructor( private cargosService: CargosService ) {

   }

  ngOnInit(): void {
    this.populateDropDownYears();
    this.getDataGraph();
  }

  getDataGraph(){
    this.cargosService.getCargosReport(this.yearSelected.code)
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
    
      this.completeData();

      this.strlabels = this.datareport.map((x)=>( getMes( (x._id).substr(-2) ) ));
      this.dataG = this.datareport.map((x)=>(x.montototal));

      this.graphTitle = `Ingresos estimados ${ this.yearSelected.name }`;
      this.showGraphic = true;

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
    // this.yearSelected = event.value.code; 
    this.getDataGraph();
  }
}
