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
        'Âge moyen de la mère à l\'accouchement',
        'Décès',
        'Population française',
        'Taux 65 ans et plus',
      ],
      "Economie" : [
        'Croissance PIB',
        'Pouvoir d\'achat des ménages',
        'Évolution de la dépense des ménages',
        'Taux d\'inflation',
        'Taux de smic',
        'Taux de pauvreté',
        'Taux de chomage',
      ],
      "Autre" : [
        "Nombre d'ivg",
      ],
      // Ajoutez d'autres noms de fichiers CSV ici
    };
  }
}
