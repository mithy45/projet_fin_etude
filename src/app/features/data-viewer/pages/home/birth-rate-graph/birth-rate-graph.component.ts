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
  birth_rate_file: string = "Naissances";
  important_point: number[] = [1914, 1918, 1939, 1945, 1950, 1973, 1974, 1979, 1980, 1986, 1990, 1991, 1993, 2001, 2002, 2008];
  political_decision_years: number[] = [1920, 1933, 1938, 1967, 1971, 1974, 1977, 1978, 1994, 2002, 2005, 2006, 2008, 2014, 2021];

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

    const pointBackgroundColors = this.jsonData.x.map((_: any, index: number) => {
    if (this.important_point.includes(index + 1900) && this.political_decision_years.includes(index + 1900)) {
      return 'yellow';
    } else if (this.political_decision_years.includes(index + 1900)) {
      return 'green';
    } else if (this.important_point.includes(index + 1900)) {
      return 'red';
    } else {
      return 'blue';
    }
  });
    console.log(this.jsonData.y)
    this.jsonData.y[0].pointBackgroundColor = pointBackgroundColors;
    this.jsonData.y[0].pointRadius = 5;
    this.jsonData.y[0].backgroundColor = 'blue';
    this.jsonData.y[0].borderColor = '#36A2EB'
    this.chart = new Chart("Birth-Rate-Graph", {
      type: 'line',
      data: {
        labels: this.jsonData.x,
        datasets: [this.jsonData.y[0],
        {
          type: 'scatter',
          label: 'Crises majeures',
          data: [],
          backgroundColor: 'red',
          borderColor: '#36A2EB'
        },
        {
          type: 'scatter',
          label: 'décisions politiques',
          data: [],
          backgroundColor: 'green',
          borderColor: '#36A2EB'
        },
        {
          type: 'scatter',
          label: 'Crises majeures + décisions politiques',
          data: [],
          backgroundColor: 'yellow',
          borderColor: '#36A2EB'
        }],
      },
      options: {
          responsive: true,
          aspectRatio: 2.5,
          plugins: {
            legend: {
              onClick: (e) => e.native?.stopPropagation()
            },
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
                  if (context.dataIndex === 20) {
                    return ['Interdiction de toute propagande en faveur de la contraception et toute vente de matériel contraceptif', res];
                  }
                  if (context.dataIndex === 32) {
                    return ['Mise en place du sursalaires familiaux', res];
                  }
                  if (context.dataIndex === 38) {
                    return ['Création des allocations familiales indépendantes du salaire et des entreprises', res];
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
                  if (context.dataIndex === 67) {
                    return ['La "loi Neuwirth" établit le droit à la contraception', res];
                  }
                  if (context.dataIndex === 71) {
                    return ['Mise en place de l\'AAH et de l\'allocation aux mineurs handicapé', res];
                  }
                  if (context.dataIndex === 73) {
                    return ['Fin trente glorieuses', 'Début 1er choc pétrolier', res];
                  }
                  if (context.dataIndex === 74) {
                    return ['Fin 1er choc pétrolier', 'Allocation de rentrée scolaire', res];
                  }
                  if (context.dataIndex === 77) {
                    return ["Début de l'APL", res];
                  }
                  if (context.dataIndex === 78) {
                    return ["Création du complément familial marque la priorité accordée au troisième enfant", res];
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
                  if (context.dataIndex === 94) {
                    return ['Complément familial à partir du 2ème enfant', res];
                  }
                  if (context.dataIndex === 101) {
                    return ['Début du Krach', res];
                  }
                  if (context.dataIndex === 102) {
                    return ['Fin du Krach', 'Création congé paternité', res];
                  }
                  if (context.dataIndex === 105) {
                    return ['carte "famille nombreuse" offrant des réductions sur des biens et des services', res];
                  }
                  if (context.dataIndex === 106) {
                    return ['Plan "petite enfance", plus de places dans les crèches', 'répartition du congé maternel selon le souhait de la mère', res];
                  }
                  if (context.dataIndex === 108) {
                    return ['Crise de 2008', 'généralisation du RSA', res];
                  }
                  if (context.dataIndex === 114) {
                    return ['Abaissement du plafond du quotient familial', 'réduction de moitié du montant de l\'allocation de base de la Paje', res];
                  }
                  if (context.dataIndex === 118) {
                    return ['Ajout de 30000 places en crèche d\'ici 2022', res];
                  }
                  if (context.dataIndex === 121) {
                    return ['Augmentation des congés paternité', res];
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
