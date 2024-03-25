import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { FileParserService } from '../../../../core/services/file-parser.service';
import { FileService } from '../../../../core/services/file.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.scss'
})  
export class ViewerComponent {
  public chart: any;
  public jsonData: any;
  fileNamesCheckBox: string[] = [];
  public checkboxNameSelected : string[] = [];

  constructor(private fileParserService: FileParserService,
    private fileService: FileService) { }

  ngOnInit() {
    this.fileNamesCheckBox = this.fileService.getFilesName();
    this.init();
  }

  init () {
    this.fileParserService.getCsvData(this.checkboxNameSelected) //nb_naissance_1900_2019
    .subscribe(data => {
      this.jsonData = data;
      console.log(this.jsonData);
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

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.jsonData.x, 
	      datasets: this.jsonData.y,
      },
      options: {
        aspectRatio:2.5
      }
      
    });
  }
}
