import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class FileParserService {

  constructor(private http: HttpClient,
    private fileService: FileService) { }

  // Récupère le fichier, le lis et applique les autres fonctions.
  getCsvData(files: string[]): Observable<any> {
    let datas : any[] = [];
    const observer = new Observable<any[]>(observer => {
      for (let i = 0; i < files.length; i++) {
        this.http.get('../../assets/bdd/' + files[i] + '.csv', {responseType: 'text'}).subscribe(data => {
          datas.push(this.parseCsvData(data));
          if (i == files.length - 1) {
            datas = this.mergeData(datas, files);
            observer.next(datas);
          }
        });
      }
    });
    return observer;
  }

  // Lis un csv text.
  readCsvFile (data:any) {
    let response : any = {
      "column" : [],
      "data" : [],
    };
    data = data.replaceAll('\r', '');
    data = data.replaceAll(',', '.');

    let lines = data.split('\n');
    for (let i = 0; i < lines.length; i++) {
      let column = lines[i].split(";");
      if (i == 0) {
        column.shift();
        response.column = column;
      }
      else {
        response.data.push(column);
      }
    }
    return response;
  }

  // EDIT params
  // Parse un fichier.
  parseCsvData(data: any, x: number = 0, y: number = 1, yLabel: string = 'yLabel') {
  
    let dataFormat = this.readCsvFile(data);
    let parseData : any = {
      x: [],
      y: [],
      column: dataFormat.column,
    };
    
    for (let line of dataFormat.data) {
      // EDIT.
      parseData.x.push(line[0]);
      parseData.y.push(line[1]);
    }
    
    return parseData;
  }

  // Fusionne les données parsées pour chaque fichier.
  mergeData (datas: any, fileNames: any) {
    // console.log(datas);
    let parseData : any = {
      x: [],
      y: [],
      column: [],
    };

    for (let i = 0; i < datas.length; i++) {
      parseData.y.push({
        label: fileNames[i],
        data: [],
      });
      for (let j = 0; j < datas[i].column.length; j++) {
        // parseData.column.push(datas[i].column[j] + " (" + fileNames[i] + ")");
        let labels = this.formatSelectLabels(datas[i].column[j], fileNames[i]);
        parseData.column.push(labels);
      }
    }

    if (!datas) {
      return parseData;
    }

    // {
    //   label: "Nombre naissances",
    //   data: this.jsonData.y,
    //   backgroundColor: 'blue'
    // }

    datas[0].x.forEach((item: any, index: any) => {
      let isValid = true;
      let indexList = [index];
      for (let i = 1; i < datas.length; i++) {
        let indexFound = datas[i].x.indexOf(item);
        if (indexFound == -1) {
          isValid = false;
          break;
        } else {
          indexList.push(indexFound);
        }
      };
      if (!isValid) {
        return;
      }
      
      parseData.x.push(item);
      for (let i = 0; i < datas.length; i++) {
        parseData.y[i].data.push(datas[i].y[indexList[i]]);
      }
    });
    // console.log("tutu");
    // console.log(parseData);
    return parseData;
  }

  getCsvColumn(): Observable<any[]> {
    let datas : any[] = [];
    const observer = new Observable<any[]>(observer => {
      let allCsvfile = this.fileService.getFilesName();
      for (let i = 0; i < allCsvfile.length; i++) {
        this.http.get('../../assets/bdd/' + allCsvfile[i] + '.csv', {responseType: 'text'}).subscribe(data => {
          // datas.push(this.parseCsvData(data));
          // if (i == files.length - 1) {                 A FINALISER
          //   datas = this.mergeData(datas, files);
          //   observer.next(datas);
          // }
        });
      }
    });
    return observer;
  }

  formatSelectLabels (data: any, fileName:any) {
    let response = {
      label : "",
      id: "",
    }
    response.label = data + " (" + fileName + ")";
    response.id = data + "_-_" + fileName;
    return response;
  }

  parseSelectLabel (data: any) {
    let response = {
      column: "",
      fileName: "",
    }
    let tmp = data.replace(")", "");
    tmp = tmp.split("_-_");
    response.column = tmp[0];
    response.fileName = tmp[1];
    return response;
  }
}
