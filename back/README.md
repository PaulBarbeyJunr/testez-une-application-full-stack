# Yoga App - Back-end

API REST Spring Boot avec authentification JWT.

## Prérequis

- **Java 8+**
- **Maven 3.6+**
- **MySQL 8+**

---

## Installation de la base de données

1. Créer la base de données :

```sql
CREATE DATABASE test;
```

2. Importer le script SQL :

```bash
mysql -u root -p test < ../ressources/sql/script.sql
```

3. Configurer les accès dans `src/main/resources/application.properties` :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/test?allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=
```

---

## Installation

```bash
mvn clean install -DskipTests
```

---

## Lancer l'application

```bash
mvn spring-boot:run
```

> L'API démarre sur `http://localhost:8080`

---

## Tests (JUnit / Mockito)

```bash
mvn test
```

### Rapport de couverture (JaCoCo)

```bash
mvn clean test
```

> Rapport disponible dans : `target/site/jacoco/index.html`
