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
        plugins: {
          legend: {
            onClick: (e) => e.native?.stopPropagation()
          }
        }
      }
    });
  }
}
