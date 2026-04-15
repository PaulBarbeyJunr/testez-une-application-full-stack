# Yoga App - Front-end

Application Angular 14 de gestion de sessions de yoga.

## Prérequis

- **Node.js 16+** et **npm**
- **Angular CLI** : `npm install -g @angular/cli`
- Le **back-end** doit être démarré sur `http://localhost:8080` pour les tests e2e

---

## Installation

```bash
npm install
```

---

## Lancer l'application

```bash
npm start
```

> Accessible sur `http://localhost:4200`

---

## Tests unitaires et d'intégration (Jest)

```bash
npm test
```

Avec mode watch :

```bash
npm run test:watch
```

### Rapport de couverture

```bash
npm test -- --coverage
```

> Rapport disponible dans : `coverage/jest/lcov-report/index.html`

---

## Tests end-to-end (Cypress)

> Le back-end doit être démarré sur `http://localhost:8080`.

**1. Lancer le front-end avec l'instrumentation de couverture :**

```bash
ng run yoga:serve-coverage
```

> Cette commande lance le front avec Istanbul pour collecter les données de couverture.

**2. Lancer les tests Cypress** (dans un autre terminal) :

```bash
npm run cypress:run
```

Mode interactif (interface graphique) :

```bash
npm run cypress:open
```

**3. Générer le rapport de couverture e2e :**

```bash
npm run e2e:coverage
```

> Rapport disponible dans : `coverage/lcov-report/index.html`

---

## Ressources

### Collection Postman

Importer la collection depuis :

> `ressources/postman/yoga.postman_collection.json`

### Compte administrateur par défaut

- **login** : yoga@studio.com
- **password** : test!1234
