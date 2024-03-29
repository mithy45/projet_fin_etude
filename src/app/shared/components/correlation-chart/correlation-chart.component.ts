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
  @Input() xFile!: string;
  @Input() yFile!: string;
  @Input() id!: string;

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
        this.createCorrelateChart(correlationXValues, correlationYValues);
      });
    });
  }

  createCorrelateChart(correlationXValues: { annee: number; data: number; }[], correlationYValues: { annee: number; data: number; }[]) {
    if (this.chart) {
      this.chart.destroy();
    }
    const correlatedData: number[] = [];
    correlationXValues.forEach((d1) => {
      const d2 = correlationYValues.find((item) => item.annee === d1.annee);
      if (d2) {
        correlatedData.push(d1.data / d2.data);
      }
    });
    this.chart = new Chart(this.id, {
      type: this.chartType as keyof ChartTypeRegistry,
      data: {
        labels: [],
        datasets: [{data: correlatedData, label: 'Correlation'}]
      },
      options: {
        responsive: true,
        aspectRatio: 2.5,
        plugins: {
          tooltip: {
            // callbacks: {
            //   label: (context: any) => {
            //     let x = context.parsed.x;
            //     let y = context.parsed.y;

            //     const match = correlatedData.find((item) => item.x == x && item.y == y);
            //     return match!.year + " (" + x + " ; " + y + ")";
            //   }
            // }
          },
          legend: {
            onClick: (e) => e.native?.stopPropagation()
          }
        }
      }
    });
  }
}