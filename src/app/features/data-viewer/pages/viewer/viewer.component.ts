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

      console.log(this.selectXValues);

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

  onChangeSelectX (event: any) {
    this.currentSelectX = event.target.value;
    let response = this.fileParserService.parseSelectLabel(this.currentSelectX);
  }

  onChangeSelectY (event: any) {
    this.currentSelectY = event.target.value;
    let response = this.fileParserService.parseSelectLabel(this.currentSelectY);
    console.log(response);

  }

  onChangeCorrelate (event : any) {
    console.log("x", this.currentSelectX);
    console.log("y", this.currentSelectY);
    // event.target.value.X;Y 

    // { fichier,X colonne } = service.parseSelectLabel(va.xl)
    // { fichier,Y colonne } = service.parseSelectLabel(val;y)

    

    if (event.target.checked) {
      // on récup les 
    }
  }

  onSelect () {
    console.log(this.filterForm.value.abscisse, this.filterForm.value.ordonnee );
  }

  correlateData () {
    console.log("CorrelateData");
  }
}
