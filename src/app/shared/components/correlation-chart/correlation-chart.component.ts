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
  colorPoints: any = [];

  constructor(private fileParserService: FileParserService) {}

  ngOnInit(): void {
    this.fileParserService.getCsvData([this.xFile], true)
    .subscribe(xData => {
      const correlationXValues: {year: number, data: number}[] = [];
      for (let i = 0; i < xData.x.length; i++) {
        correlationXValues.push({
          year: xData.x[i],
          data: xData.y[0].data[i]
        });
        this.colorPoints[xData.x[i]] = xData.y[0].pointBackgroundColor[i];
      }
      this.fileParserService.getCsvData([this.yFile], true)
      .subscribe(yData => {
        const correlationYValues: {year: number, data: number}[] = [];
        for (let i = 0; i < yData.x.length; i++) {
          correlationYValues.push({
            year: yData.x[i],
            data: yData.y[0].data[i]
          });
          this.colorPoints[yData.x[i]] = yData.y[0].pointBackgroundColor[i];
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

  createCorrelateChart(correlationXValues: { year: number; data: number; }[], correlationYValues: { year: number; data: number; }[]) {
    const colors: any = [];
    const correlatedData: {x: number, y: number, year: number}[] = [];
    correlationXValues.forEach((d1) => {
      const d2 = correlationYValues.find((item) => item.year === d1.year);
      if (d2) {
        correlatedData.push({
          x: d1.data,
          y: d2.data,
          year: d1.year});
          colors.push(this.colorPoints[d1.year]);
      }
    });
    const datasets = [{data: correlatedData, label: 'Correlation', backgroundColor: colors, yAxisID: 'y'}];
    const callbacks = {
      label: (context: any) => {
        let x = context.parsed.x;
        let y = context.parsed.y;

        const match = correlatedData.find((item) => item.x == x && item.y == y);
        return match!.year + " (" + x + " ; " + y + ")";
      }
    };
    const scaleOptions = {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: this.xFile
        }
      },
      y: {
        title: {
          display: true,
          text: this.yFile,
        }
      }
    };
    this.createChart(datasets, callbacks, scaleOptions);
  }

  createDivisionChart(correlationXValues: { year: number; data: number; }[], correlationYValues: { year: number; data: number; }[]) {
    const correlatedData: {x: number, y: number}[] = [];
    correlationXValues.forEach((d1) => {
      const d2 = correlationYValues.find((item) => item.year === d1.year);
      if (d2) {
        correlatedData.push({
          x: d1.year,
          y: d1.data / d2.data
        });
      }
    });
    const datasets = [{data: correlatedData, label: 'Division'}];
    const scaleOptions = {
      x: {
        title: {
          display: true,
          text: 'Année'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Résultat correlation',
        }
      }
    };
    this.createChart(datasets, undefined, scaleOptions);
  }

  createChart(datasets: any, callbacks: any, scaleOptions: any = {}) {
    if (this.chart) {
      this.chart.destroy();
    }
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: this.chartType as keyof ChartTypeRegistry,
      data: {
        labels: [],
        datasets: datasets
      },
      options: {
        responsive: true,
        aspectRatio: 2.5,
        scales: scaleOptions,
        plugins: {
          title: {
            display: true,
            text: this.xFile + ' / ' + this.yFile
          },
          tooltip: {
            callbacks: callbacks
          },
          legend: {
            onClick: (e) => e.native?.stopPropagation()
          }
        }
      }
    });
  }
}