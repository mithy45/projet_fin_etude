import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import Chart, { ChartTypeRegistry } from 'chart.js/auto';
import { FileParserService } from '../../../core/services/file-parser.service';

@Component({
  selector: 'app-correlation-chart',
  standalone: true,
  imports: [],
  templateUrl: './correlation-chart.component.html',
  styleUrl: './correlation-chart.component.scss'
})
export class CorrelationChartComponent {
  @ViewChild('correlationChartCanvas') chartCanvas!: ElementRef;

  @Input() chartType: string = 'scatter';
  @Input() method: string = 'correlation';
  @Input() xFile!: string;
  @Input() yFile!: string;

  chart!: Chart;

  constructor(private fileParserService: FileParserService) {}

  ngOnInit(): void {
    this.fileParserService.getCsvData([this.xFile])
    .subscribe(xData => {
      const correlationXValues: {annee: number, data: number}[] = [];
      for (let i = 0; i < xData.x.length; i++) {
        correlationXValues.push({
          annee: xData.x[i],
          data: xData.y[0].data[i]
        })
      }
      this.fileParserService.getCsvData([this.yFile])
      .subscribe(yData => {
        const correlationYValues: {annee: number, data: number}[] = [];
        for (let i = 0; i < yData.x.length; i++) {
          correlationYValues.push({
            annee: yData.x[i],
            data: yData.y[0].data[i]
          })
        }
        if (this.method == "correlation") {
          this.createCorrelateChart(correlationXValues, correlationYValues);
        }
        else if (this.method == "division") {
          this.createDivisionChart(correlationXValues, correlationYValues);
        }
      });
    });
  }

  createCorrelateChart(correlationXValues: { annee: number; data: number; }[], correlationYValues: { annee: number; data: number; }[]) {
    const correlatedData: {x: number, y: number, annee: number}[] = [];
    correlationXValues.forEach((d1) => {
      const d2 = correlationYValues.find((item) => item.annee === d1.annee);
      if (d2) {
        correlatedData.push({
          x: d1.data,
          y: d2.data,
          annee: d1.annee});
      }
    });
    const callbacks = {
      label: (context: any) => {
        let x = context.parsed.x;
        let y = context.parsed.y;

        const match = correlatedData.find((item) => item.x == x && item.y == y);
        return match!.annee + " (" + x + " ; " + y + ")";
      }
    }
    const scaleOptions = {
      x: {
        type: 'linear',
      },
    };
    this.createChart(correlatedData, callbacks, scaleOptions);
  }

  createDivisionChart(correlationXValues: { annee: number; data: number; }[], correlationYValues: { annee: number; data: number; }[]) {
    const correlatedData: {x: number, y: number}[] = [];
    correlationXValues.forEach((d1) => {
      const d2 = correlationYValues.find((item) => item.annee === d1.annee);
      if (d2) {
        correlatedData.push({
          x: d1.annee,
          y: d1.data / d2.data
        });
      }
    });
    this.createChart(correlatedData, undefined, undefined);
  }

  createChart(correlatedData: any, callbacks: any, scaleOptions: any) {
    if (this.chart) {
      this.chart.destroy();
    }
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: this.chartType as keyof ChartTypeRegistry,
      data: {
        labels: [],
        datasets: [{data: correlatedData, label: 'Correlation'}]
      },
      options: {
        responsive: true,
        aspectRatio: 2.5,
        scales: scaleOptions,
        plugins: {
          tooltip: {
            callbacks: callbacks
          },
          legend: {
            onClick: (e) => e.native?.stopPropagation()
          }
        }
      }
    });
    console.log(this.chart)
  }
}