import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileParserService {

  constructor(private http: HttpClient) { }

  // {
  //   x: [],
  //   y: [
  //     [
  //       data: [],
  //       labelData
  //     ],
  //   ]
  // }

  

  getCsvData(files: string[]): Observable<any[]> {
    let datas : any[] = [];
    const observer = new Observable<any[]>(observer => {
      for (let i = 0; i < files.length; i++) {
        this.http.get('../../assets/bdd/' + files[i] + '.csv', {responseType: 'text'}).subscribe(data => {
          datas.push(this.parseCsvData(data));
          observer.next(datas);
          if (i == files.length - 1) {
            datas = this.mergeData(datas, files);
            observer.next(datas);
          }
        });
      }
    });
    return observer;
  }

  parseCsvData(data: any, x: number = 0, y: number = 1, yLabel: string = 'yLabel') {
    data = data.replaceAll('\r', '');
    data = data.replaceAll(',', '.');
    let lines = data.split('\n');
    let parseData : any = {
      x: [],
      y: [],
    };
    
    for (let line of lines) {
      let column = line.split(";");
      parseData.x.push(column[x]);
      parseData.y.push(column[y]);
    }
    
    return parseData;
  }

  mergeData (datas: any, fileNames: any) {
    let parseData : any = {
      x: [],
      y: [],
    };

    for (let i = 0; i < datas.length; i++) {
      parseData.y.push({
        label: fileNames[i],
        data: [],
      });
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
    return parseData;
  }
}
