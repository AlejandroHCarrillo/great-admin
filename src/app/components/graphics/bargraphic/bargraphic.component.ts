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
  @Input() graphTypeInput: ChartType = 'bar';

  // Grafica  
    public barChartOptions: ChartOptions = {
      responsive: true,
      legend: {
        position: 'top',
      },
      // We use these empty structures as placeholders for dynamic theming.
      scales: { xAxes: [{}], 
                yAxes: [{ ticks: { beginAtZero: true } }] 
              },
      plugins: {
        datalabels: {
          display:true,
          formatter: (value, ctx) =>{
            console.log("formatter.value: ", value);
            
            let dataArr = this.barChartData;
            let total = sumArrayNumeric(dataArr);     // sum from lodash        
            let percentage = (value * 100 / total).toFixed(2) + "%";
            return percentage;

          //   // const label = ctx.chart.data.labels[ctx.dataIndex];
          //   // return label;
          },
          anchor: 'center',
          align: 'center',
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

      this.barChartType = this.graphTypeInput;

      this.barChartLabels = this.labelsInput;      
      this.barChartData = [
        {
          label: this.graphTitle,
          data: this.dataInput, 
          // backgroundColor:  'rgba(75, 192, 192, 0.3)',
          // borderColor: [ 'rgba(75, 192, 192, 0.8)' ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.3)',
            'rgba(255, 99, 132, 0.3)',
            'rgba(54, 162, 235, 0.3)',
            'rgba(255, 206, 86, 0.3)',
            'rgba(153, 102, 255, 0.3)',
            'rgba(255, 159, 64, 0.3)',
            'rgba(75, 192, 192, 0.3)',
            'rgba(255, 99, 132, 0.3)',
            'rgba(54, 162, 235, 0.3)',
            'rgba(255, 206, 86, 0.3)',
            'rgba(153, 102, 255, 0.3)',
            'rgba(255, 159, 64, 0.3)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ],
          hoverBackgroundColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          hoverBorderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],

          borderWidth: 2
        }
      ];

      if(this.barChartOptions.plugins && this.barChartOptions.plugins.datalabels){
        this.barChartOptions.plugins.datalabels.formatter;
      }
  }

  // changeLegendPosition(): void {
  //   this.barChartOptions.legend.position = this.barChartOptions?.legend?.position === 'left' ? 'top' : 'left';
  // }

}
