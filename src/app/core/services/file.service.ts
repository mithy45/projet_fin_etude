import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor() { }

  getFilesName(): string[] {
    return [
      'naissances',
      'mortalite_infantile',
      'indice de fécondite',
      'deces',
      'population_francaise',
      // Ajoutez d'autres noms de fichiers CSV ici
    ];
  }
}
