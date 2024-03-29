import { Component } from '@angular/core';
import { BirthRateGraphComponent } from '../../../data-viewer/pages/home/birth-rate-graph/birth-rate-graph.component';
import { ChartComponent } from '../../../../shared/components/chart/chart.component';
import { CorrelationChartComponent } from '../../../../shared/components/correlation-chart/correlation-chart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BirthRateGraphComponent, ChartComponent, CorrelationChartComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
