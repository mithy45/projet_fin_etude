import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart, ChartTypeRegistry } from 'chart.js/auto';
import { FileParserService } from '../../../core/services/file-parser.service';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  @Input() chartType: string = 'line';
  @Input() fileList: string[] = [];
  @Input() smooth: boolean = true;

  chart!: Chart;

  constructor(private fileParserService: FileParserService) {}

  ngOnInit(): void {
    this.fileParserService.getCsvData(this.fileList)
    .subscribe(data => {
      this.createChart(data);
    });
  }

  createChart(data: any) {
    if (this.chart) {
      this.chart.destroy();
    }
    const scaleOptions: any = {};
    if (this.fileList.length == 1) {
      scaleOptions.x = {
        title: {
          display: true,
          text: data.column.length > 1 ? data.column[0].id.split('_-_')[0] : "Année"
        }
      }
      scaleOptions.y0 = {
        title: {
          display: true,
          text: data.column.length > 1 ? data.column[1].id.split('_-_')[0] : data.column[0].id.split('_-_')[0]
        }
      }
    } else {
      scaleOptions.x = {
        title: {
          display: true,
          text: "Année"
        }
      }
      for (let i = 0; i < data.y.length; i++) {
        scaleOptions["y" + i] = {
          title: {
            display: true,
            text: data.column[i].id.split('_-_')[0]
          }
        }
      }
    }
    if (this.smooth) {
      scaleOptions.x.type = 'linear';
    }
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: this.chartType as keyof ChartTypeRegistry,
      data: {
        labels: data.x,
        datasets: data.y
      },
      options: {
        responsive: true,
        aspectRatio: 2.5,
        scales: scaleOptions,
        plugins: {
          title: {
            display: true,
            text: this.fileList.join(', ')
          },
          legend: {
            onClick: (e) => e.native?.stopPropagation()
          }
        }
      }
    });
  }
}
