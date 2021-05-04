import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { sumArrayNumeric } from 'src/app/helpers/tools';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-bargraphic',
  templateUrl: './bargraphic.component.html',
  styleUrls: ['./bargraphic.component.css']
})
export class BargraphicComponent implements OnInit {
  @Input() graphTitle: string = "Titulo no recibido";
  @Input() labelsInput: string[] = [];
  @Input() dataInput: any[] = [];

  // [datasets]="barChartData"
  // [labels]="barChartLabels"
  // [options]="barChartOptions"
  // [legend]="barChartLegend"
  // [chartType]="barChartType"

    // Grafica  
    public barChartOptions: ChartOptions = {
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
  
    public barChartLabels: Label[] = [];
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    public barChartPlugins = [pluginDataLabels];
  
    public barChartData: ChartDataSets[] = [{ 
      label: 'Ponga el titulo aqui',
      data: [], 
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }];
  
  constructor() { }

  ngOnInit(): void {
    // Fake input variables
    // this.barChartLabels = ["Grado 1", "Grado 3"];
    // this.barChartData[0].label = this.graphTitle;
    // this.barChartData[0].data = [1, 1];

    
    // setTimeout(() => {
      this.barChartLabels = this.labelsInput;
      console.log("llenar los datos de la grafica: ", this.dataInput);
      
      this.barChartData = [
        {
          label: this.graphTitle,
          data: this.dataInput, 
          backgroundColor:  'rgba(75, 192, 192, 0.3)',
          borderColor: [ 'rgba(75, 192, 192, 0.8)' ],
          borderWidth: 2
        }
      ];      
    // }, 3500);




  }

}
