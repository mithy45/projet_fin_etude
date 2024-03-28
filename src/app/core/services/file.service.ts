import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor() { }

  getFilesName(): any {
    return {
      "Démographie": [
        'Naissances',
        'Indice de fécondite',
        'Mortalite infantile',
        'Décès',
        'Population française',
        'Taux 65 ans et plus',
      ],
      "Economie" : [
        'Croissance PIB',
        'Pouvoir d\'achat des ménages',
        'Taux d\'inflation',
        'Taux de smic',
        'Taux de pauvreté',
        'Taux de chomage'
      ],
      "Autre" : [

      ],
      // Ajoutez d'autres noms de fichiers CSV ici
    };
  }
}
