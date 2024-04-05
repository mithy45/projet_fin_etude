# Projet fin d'étude
4 avril 2024 - Expert 3 - EXP24

**Sujet**: *Comment expliquer les variations de la natalité en France depuis 1900, et faut-il s’inquiéter du déclin de ces 10 dernières années*

## Auteurs
* Théo BILLET
* Brice DUMONT
* Quentin GUYOT

# Informations sur le projet
Ce projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

## Pré-requis

* [Nodejs](https://nodejs.org/en/download) (Ex: v18.18.0)
* Npm (Ex: 9.8.1, inclu avec nodejs)

Tester les pré-requis : ```node -v && npm -v```, qui devrait afficher la version des deux outils.

## Lancer l'application en local

Installer les dépendences du projet si ce n'est pas déjà fait:

Se placer à la racine du projet et lancer la commande suivante :
``` npm install ```

Puis lancer `ng serve` pour démarrer le serveur. Naviguer sur `http://localhost:4200/` une fois le serveur démarré et fonctionnel.

### Ajout de données

Si besoin d'ajouter des données, il suffit d'ajouter le fichier dans le répertoire [/src/assets/bdd](/src/assets/bdd). Il faut ensuite modifier le fichier [/src/app/core/services/file.service.ts](/src/app/core/services/file.service.ts) pour ajouter le nom du fichier.

#### Conditions sur le fichier:
- Doit être de type **csv** avec un séparateur point-virgule (;)
- La première colonne doit être la date
- Seule la deuxième colonne est interprétée (si plusieurs données dans un fichier, il faut le décomposer).

## Build
**Remarque**: Lors de ce projet, seul le lancement en local était utilisé. L'application n'a pas été herbergé sur un site static.

Commande pour construire le projet (si besoin de l'héberger) `ng build`. Les artefacts de build seront stockés dans le
dossier `dist/`.
