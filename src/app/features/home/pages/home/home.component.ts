import { Component } from '@angular/core';
import { BirthRateGraphComponent } from '../../../data-viewer/pages/home/birth-rate-graph/birth-rate-graph.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BirthRateGraphComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
