import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { FileParserService } from '../../../../../core/services/file-parser.service';

@Component({
  selector: 'app-birth-rate-graph',
  standalone: true,
  imports: [],
  templateUrl: './birth-rate-graph.component.html',
  styleUrl: './birth-rate-graph.component.scss'
})
export class BirthRateGraphComponent {
  public chart: any;
  public jsonData: any;
  birth_rate_file: string = "naissances";
  important_point: number[] = [1914, 1918, 1939, 1945, 1950, 1973, 1974, 1979, 1980, 1986, 1990, 1991, 1993, 2001, 2002, 2008]

  constructor(private fileParserService: FileParserService) {}

  ngOnInit() {
    this.fileParserService.getCsvData([this.birth_rate_file])
    .subscribe(data => {
      this.jsonData = data;
      this.createChart();
    })
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }



    const pointBackgroundColors = this.jsonData.x.map((_: any, index: number) => this.important_point.includes(index + 1900) ? 'red' : 'blue');
    this.jsonData.y[0].pointBackgroundColor = pointBackgroundColors;
    this.jsonData.y[0].pointRadius = 5;
    console.log(this.jsonData.y)
    this.chart = new Chart("Birth-Rate-Graph", {
      type: 'line',

      data: {
        labels: this.jsonData.x,
        datasets: this.jsonData.y,
      },
      options: {
          aspectRatio: 2.5,
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: (context) => {
                  // context.datasetIndex === 0 -> There is only the birth_date so datasetIndex is always equals to 0
                  const res = context.dataset.label + ': ' + context.parsed.y;
                  if (context.dataIndex === 14) {
                    return ['Début 1ère guerre mondiale', res];
                  }
                  if (context.dataIndex === 18) {
                    return ['Fin 1ère guerre mondiale', res];
                  }
                  if (context.dataIndex === 39) {
                    return ['Début 2ème guerre mondiale', res];
                  }
                  if (context.dataIndex === 45) {
                    return ['Fin 2ème guerre mondiale', res];
                  }
                  if (context.dataIndex === 50) {
                    return ['Début trente glorieuses', res];
                  }
                  if (context.dataIndex === 73) {
                    return ['Fin trente glorieuses', 'Début 1er choc pétrolier', res];
                  }
                  if (context.dataIndex === 74) {
                    return ['Fin 1er choc pétrolier', res];
                  }
                  if (context.dataIndex === 79) {
                    return ['Début 2ème choc pétrolier', res];
                  }
                  if (context.dataIndex === 80) {
                    return ['Fin 2ème choc pétrolier', res];
                  }
                  if (context.dataIndex === 86) {
                    return ['Début contre choc pétrolier', res];
                  }
                  if (context.dataIndex === 90) {
                    return ['Fin contre choc pétrolier', res];
                  }
                  if (context.dataIndex === 91) {
                    return ['Début guerre du Golfe', res];
                  }
                  if (context.dataIndex === 93) {
                    return ['Fin guerre du Golfe', res];
                  }
                  if (context.dataIndex === 101) {
                    return ['Début du Krach', res];
                  }
                  if (context.dataIndex === 102) {
                    return ['Fin du Krach', res];
                  }
                  if (context.dataIndex === 108) {
                    return ['Crise de 2008', res];
                  }
                  return res;
                }
              }
            }
          }
      }
    })
  }
}
