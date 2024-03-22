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
  fileNames: string[] = [];
  public datas : string[] = [];

  constructor(private fileParserService: FileParserService,
    private fileService: FileService) { }

  ngOnInit() {
    this.fileNames = this.fileService.getFilesName();
    this.init();
  }

  init () {
    this.fileParserService.getCsvData(this.datas) //nb_naissance_1900_2019
    .subscribe(data => {
      console.log(data);
      this.jsonData = data;
      console.log(this.jsonData);
      // this.jsonData = this.fileParserService.parseCsvData(this.jsonData);
      this.createChart();
    });
  }

  onChange(event:any) {
    let fileName = event.target.id;
    let isChecked = event.target.checked;

    if (!isChecked && this.datas.includes(fileName)) {
      this.datas.splice(this.datas.indexOf(fileName), 1);
    } else if (isChecked && !this.datas.includes(fileName)) {
      this.datas.push(fileName);
    }
    this.init();
  }

  createChart() {
  
    console.log(this.jsonData.x, this.jsonData.y);
    
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.jsonData.x, 
	       datasets: [
          {
            label: "Nombre naissances",
            data: this.jsonData.y,
            backgroundColor: 'blue'
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });
  }
}
