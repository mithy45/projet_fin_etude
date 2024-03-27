import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { FileParserService } from '../../../../core/services/file-parser.service';
import { FileService } from '../../../../core/services/file.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.scss'
})  
export class ViewerComponent {
  public chart: any;
  public jsonData: any;
  fileNamesCheckBox: string[] = [];
  public checkboxNameSelected : string[] = [];
  filterForm: FormGroup;
  selectXValues: any = [];
  selectYValues: any = [];
  correlationXValues: any = [];
  correlationYValues: any = [];
  currentSelectX = "je suis current select x";
  currentSelectY = "je suis current select y";
  public correlate = false;

  constructor(private fileParserService: FileParserService,
    private fileService: FileService,
    private fb: FormBuilder) {
      this.filterForm = this.fb.group({
        abscisse: [],
        ordonnee: [],
        correlate: false,
      });
    }

  ngOnInit() {
    this.fileNamesCheckBox = this.fileService.getFilesName();
    this.init();
  }

  init () {
    this.fileParserService.getCsvData(this.checkboxNameSelected) //nb_naissance_1900_2019
    .subscribe((data:any) => {
      this.jsonData = data;
      this.selectXValues = data.column;
      this.selectYValues = data.column;

      // console.log(this.selectXValues);

      // console.log("json data", this.jsonData);
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

  onChangeSelectX (event: any) {
    this.currentSelectX = event.target.value;
    let { column, fileName } = this.fileParserService.parseSelectLabel(this.currentSelectX);
    this.fileParserService.getCsvData([fileName])
    .subscribe(data => {
      this.correlationXValues = [];
      for (let i = 0; i < data.x.length; i++) {
        this.correlationXValues.push({annee: data.x[i], data: data.y[0].data[i]});
      }
      this.correlationXValues.sort((a: { data: number; }, b: { data: number; }) => a.data - b.data);
      this.correlateData();
    })
  }

  onChangeSelectY (event: any) {
    this.currentSelectY = event.target.value;
    let { column, fileName } = this.fileParserService.parseSelectLabel(this.currentSelectY);
    this.fileParserService.getCsvData([fileName])
    .subscribe(data => {
      this.correlationYValues = [];
      for (let i = 0; i < data.x.length; i++) {
        this.correlationYValues.push({annee: data.x[i], data: data.y[0].data[i]});
      }
      this.correlateData();
    })
  }

  onChangeCorrelate (event : any) {
    // event.target.value.X;Y 

    // { fichier,X colonne } = service.parseSelectLabel(va.xl)
    // { fichier,Y colonne } = service.parseSelectLabel(val;y)

    if (event.target.checked) {
      this.correlateData();
    }
    else {
      this.createChart();
    }
  }

  onSelect () {
    console.log(this.filterForm.value.abscisse, this.filterForm.value.ordonnee );
  }

  correlateData () {
    if (this.correlationXValues.length === 0 || this.correlationYValues.length === 0) {
      return;
    }
    const correlatedDataX: any [] = [];
    const correlatedDataY: any [] = [];
    this.correlationXValues.forEach((d1: { annee: any; data: any; }) => {
      const d2 = this.correlationYValues.find((item: { annee: any; }) => item.annee === d1.annee);
      if (d2) {
        correlatedDataX.push(d1.data);
        correlatedDataY.push(d2.data)
      }
    });
    this.chart.clear();
    this.chart.config.type = 'scatter';
    this.chart.data.labels = correlatedDataX;
    this.chart.data.datasets = [{data:correlatedDataY, label: 'Correlation'}];
    this.chart.update();
    // console.log(correlatedDataX)
    // console.log(correlatedDataY)
  }
}
