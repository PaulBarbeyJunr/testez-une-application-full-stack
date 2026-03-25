# Yoga App - Full Stack Testing Project

Application de gestion de sessions de yoga avec authentification JWT.

## Prérequis

- **Java 8+**
- **Maven 3.6+**
- **Node.js 16+** et **npm**
- **MySQL 8+**
- **Angular CLI** : `npm install -g @angular/cli`

---

## 1. Installation de la base de données

1. Démarrer votre serveur MySQL
2. Créer la base de données et importer le script SQL :

```sql
CREATE DATABASE test;
```

```bash
mysql -u root -p test < ressources/sql/script.sql
```

> La base de données s'appelle `test` par défaut.
> Les identifiants sont configurés dans `back/src/main/resources/application.properties` :
> - **username** : `root`
> - **password** : *(vide par défaut)*

---

## 2. Installation de l'application

### Back-end (Spring Boot)

```bash
cd back
mvn clean install -DskipTests
```

### Front-end (Angular)

```bash
cd front
npm install
```

---

## 3. Lancer l'application

### Back-end

```bash
cd back
mvn spring-boot:run
```

> L'API démarre sur `http://localhost:8080`

### Front-end

```bash
cd front
npm start
```

> L'application est accessible sur `http://localhost:4200`

---

## 4. Lancer les tests

### Tests back-end (JUnit / Mockito)

```bash
cd back
mvn test
```

### Tests front-end (Jest)

```bash
cd front
npx jest
```

### Tests end-to-end (Cypress)

> Le back-end et le front-end doivent être démarrés avant de lancer les tests e2e.

```bash
cd front

# Mode interactif (interface graphique)
npx cypress open

# Mode headless (ligne de commande)
npx cypress run
```

---

## 5. Générer les rapports de couverture

### Couverture back-end (JaCoCo)

```bash
cd back
mvn clean test
```

> Le rapport est généré dans : `back/target/site/jacoco/index.html`

### Couverture front-end (Jest / Istanbul)

```bash
cd front
npx jest --coverage
```

> Le rapport est généré dans : `front/coverage/jest/lcov-report/index.html`

### Couverture e2e (Cypress / Istanbul / nyc)

1. Lancer les tests e2e avec couverture :

```bash
cd front
npx cypress run
```

2. Générer le rapport :

```bash
cd front
npm run e2e:coverage
```

> Le rapport HTML est généré dans : `front/coverage/lcov-report/index.html`
