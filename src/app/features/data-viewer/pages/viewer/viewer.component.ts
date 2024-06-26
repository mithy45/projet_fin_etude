import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { FileParserService } from '../../../../core/services/file-parser.service';
import { FileService } from '../../../../core/services/file.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CorrelationChartComponent } from '../../../../shared/components/correlation-chart/correlation-chart.component';
import { ChartComponent } from '../../../../shared/components/chart/chart.component';
import {MatSliderModule} from '@angular/material/slider';
import zoomPlugin from 'chartjs-plugin-zoom'
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CorrelationChartComponent, ChartComponent, MatSliderModule, MatButtonModule],
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.scss'
})  
export class ViewerComponent {
  Object = Object;
  public chart: any;
  public jsonData: any;
  fileNamesCheckBox: any;
  public checkboxNameSelected : string[] = ["Naissances"];
  filterForm: FormGroup;
  selectXValues: any = [];
  selectYValues: any = [];
  correlationXValues: any = [];
  correlationYValues: any = [];
  currentSelectX = "je suis current select x";
  currentSelectY = "je suis current select y";
  public colorPoints: any = [];
  public sliderParams : any = {};

  selectedOption: string = 'display';

  constructor(private fileParserService: FileParserService,
    private fileService: FileService,
    private fb: FormBuilder) {
      this.filterForm = this.fb.group({
        abscisse: [],
        ordonnee: [],
        correlate: false,
        radioData: ['display']
      });
    }

  ngOnInit() {
    Chart.register(zoomPlugin);
    this.fileNamesCheckBox = this.fileService.getFilesName();
    this.init();

  }

  init () {
    this.fileParserService.getCsvData(this.checkboxNameSelected, ['correlate', 'division'].includes(this.filterForm.value.radioData)) //nb_naissance_1900_2019
    .subscribe((data:any) => {
      this.jsonData = data;
      this.selectXValues = data.column;
      this.selectYValues = data.column;

      if (this.filterForm.value.radioData !== 'display') {
        return;
      }
      // this.jsonData = this.fileParserService.parseCsvData(this.jsonData);
      this.createChart();
    });
  }

  onChange(event:any) {
    let fileName = event.target.id;
    let isChecked = event.target.checked;



    if (!isChecked && this.checkboxNameSelected.includes(fileName)) {
      this.checkboxNameSelected.splice(this.checkboxNameSelected.indexOf(fileName), 1);
    } else if (isChecked && !this.checkboxNameSelected.includes(fileName)) {
      this.checkboxNameSelected.push(fileName);
    }    

    this.init();
  }

  onChangeRadioData(event: any) {
    if (event.target.value === "display") {
      this.init()
    } else if (event.target.value === "correlate") {
      this.correlateData();
    } else if (event.target.value === "division") {
      this.divisionData();
    }
    this.setSliders();
  }

  createChart(chart = null) {
    if (this.chart) {
      this.chart.destroy();
    }
    let params: any;
    if (chart) {
      params = chart;
    } else {
      params = {
        type: 'line', //this denotes tha type of chart

        data: {// values on X-Axis
          labels: this.jsonData.x, 
          datasets: this.jsonData.y,
        },
        options: {
          aspectRatio: 2,
          plugins: {
            zoom: {
              zoom: {
                mode: 'xy', 
                drag: {
                  enabled: true,
                  borderColor: 'rgb(54, 162, 235)',
                  borderWidth: 1,
                  backgroundColor: 'rgba(54, 162, 235, 0.3)'
                },
              },
            },
          },
        }
      };
    }

    if (['correlate', 'division'].includes(this.filterForm.value.radioData)) {
      params.options.scales = {
        x: {
          type: 'linear',
        },
      };
    }
    this.chart = new Chart("MyChart", params);
    this.setSliders();
  }

  updateChart () {
    this.chart.update();
    this.setSliders();
  }

  onChangeSelectX (event: any) {
    this.currentSelectX = event.target.value;
    let { column, fileName } = this.fileParserService.parseSelectLabel(this.currentSelectX);
    this.fileParserService.getCsvData([fileName], true)
    .subscribe(data => {
      this.correlationXValues = [];
      for (let i = 0; i < data.x.length; i++) {
        this.correlationXValues.push({annee: data.x[i], data: data.y[0].data[i]});
        this.colorPoints[data.x[i]] = data.y[0].pointBackgroundColor[i];
      }
      if (this.filterForm.value.radioData === 'correlate') {
        this.correlateData();
      } else if (this.filterForm.value.radioData === 'division') {
        this.divisionData();
      }
    })
  }

  onChangeSelectY (event: any) {
    this.currentSelectY = event.target.value;
    let { column, fileName } = this.fileParserService.parseSelectLabel(this.currentSelectY);
    this.fileParserService.getCsvData([fileName], true)
    .subscribe(data => {
      this.correlationYValues = [];
      for (let i = 0; i < data.x.length; i++) {
        this.correlationYValues.push({annee: data.x[i], data: data.y[0].data[i]});
        this.colorPoints[data.x[i]] = data.y[0].pointBackgroundColor[i];
      }
      if (this.filterForm.value.radioData === 'correlate') {
        this.correlateData();
      } else if (this.filterForm.value.radioData === 'division') {
        this.divisionData();
      }
    })
  }

  onSelect () {
    // console.log(this.filterForm.value.abscisse, this.filterForm.value.ordonnee );
  }

  correlateData () {
    if (this.correlationXValues.length === 0 || this.correlationYValues.length === 0) {
      return;
    }
    let points: any[] = [];
    const correlatedDataX: any [] = [];
    const correlatedDataY: any [] = [];
    
    this.correlationXValues.forEach((d1: { annee: any; data: any; }) => {
      const d2 = this.correlationYValues.find((item: { annee: any; }) => item.annee === d1.annee);
      if (d2) {
        let decenie = this.fileParserService.getDecenie(d1.annee);
        let decenieIndex = points.findIndex((elt) => elt.decenie == decenie);

        if (decenieIndex == -1) {
          points.push({
            decenie: decenie,
            data : [],
            label : d1.annee - (d1.annee % 10),
            backgroundColor: this.fileParserService.generateColor(decenie),
          });
          decenieIndex = points.length - 1;
        }

        points[decenieIndex].data.push({
          x: d1.data,
          y: d2.data,
          year: d1.annee,
        });
        correlatedDataX.push(d1.data);
        correlatedDataY.push(d2.data);
        // if (Math.trunc(d1.annee / 10) % 2 == 0) {
        //   borderColors.push("#000");
        // } else {
        //   borderColors.push("#888");
        // }
      }
    });
    this.chart.clear();
    this.chart.config.type = 'scatter';
    this.chart.data.labels = [];
    this.chart.data.datasets = points;

    this.chart.options.plugins.tooltip = {
        callbacks: {
            label: (context: any) => {
                let x = context.parsed.x;
                let y = context.parsed.y;

                for(let i = 0; i < points.length; i++) {
                  let decenie = points[i];
                  const match = decenie.data.find((item: any) => item.x == x && item.y == y);
                  if (match) {
                    return match.year + " (" + x + " ; " + y + ")";
                  }
                };
                return "";
            }
        }
    }

    this.chart.options.scales = {};
    this.chart.options.scales.x = {
      type: 'linear',
    }
    
    this.updateChart();

  }

  divisionData() {
    if (this.correlationXValues.length === 0 || this.correlationYValues.length === 0) {
      return;
    }
    const correlatedData: {x: number, y: number}[] = [];
    this.correlationXValues.forEach((d1: any) => {
      const d2 = this.correlationYValues.find((item: any) => item.annee === d1.annee);
      if (d2) {
        correlatedData.push({
          x: d1.annee,
          y: d1.data / d2.data
        });
      }
    });
    this.chart.clear();
    this.chart.config.type = 'scatter';
    this.chart.data.labels = [];
    this.chart.data.datasets = [{data: correlatedData, label: 'Division'}];
    this.chart.options.plugins.tooltip = {
        callbacks: {
            label: (context: any) => {
                let x = context.parsed.x;
                let y = context.parsed.y;
                return "(" + x + " ; " + y + ")";
            }
        }
    }
    this.chart.options.scales = {};
    this.chart.options.scales.x = {
      type: 'linear',
    }
    this.updateChart();
  }
  
  /*** Sliders */
  formatLabel = (value: number) => {
    if (!this.chart) {
      return "";
    }
    if (this.chart.config.type == "line") {
      return this.chart.data.labels[value];
    }
    return `${value}`;
  }

  setSliders () {
    this.sliderParams.min = this.chart.scales.x.min;
    this.sliderParams.max = this.chart.scales.x.max - 1;
    this.sliderParams.currentMin = this.sliderParams.min;
    this.sliderParams.currentMax = this.sliderParams.max;
  }

  resetZoom () {
    this.chart.resetZoom();
    this.chart.update();
    this.setSliders();
  }

  zoom(event: any) {
    this.chart.zoomScale('x', {min: this.sliderParams.currentMin, max: this.sliderParams.currentMax}, 'default');

    this.chart.update();
  }

  /*** End Sliders */
}
