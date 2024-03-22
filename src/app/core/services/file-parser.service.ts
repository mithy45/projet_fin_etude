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
    console.log(files);
    let datas : any[] = [];
    const observer = new Observable<any[]>(observer => {
      for (let i = 0; i <= files.length; i++) {
        this.http.get('../../assets/bdd/' + files[i] + '.csv', {responseType: 'text'}).subscribe(data => {
          datas.push(this.parseCsvData(data));
          observer.next(datas);
        });
      }
    });
    return observer;
  }

  parseCsvData(data: any, x: number = 0, y: number = 1, yLabel: string = 'yLabel') {
    console.log(data);
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
    x
    return parseData;
  }
}
