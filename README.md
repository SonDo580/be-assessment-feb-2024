# Student Management

# Table of Contents

- [Description](#description)
- [Features](#features)
- [Technology](#technology)
- [Setup Guide](#setup-guide)
- [Documentation](#documentation)
- [Testing](#testing)
- [Database Updates](#database-updates)
- [DB Tables Diagram](#db-tables-diagram)
- [Source Code Structure](#source-code-structure)

---

## Description:

A backend service that helps teachers manage their students

## Features:

- Teacher can register students under any teacher (In real app, they probably can only register their own students).
- Teacher can retrieve the list of students common to a given list of teachers.
- Teacher can suspend a specified student.
- Teacher can retrieve the list of students who can received a given notification.

## Technology:

- **Backend Framework**: ExpressJS
- **Database**: MySQL (with TypeORM)
- **Testing**: Jest

## Setup Guide:

1. Clone the project

```bash
git clone git@github.com:SonDo580/be-assessment-feb-2024.git
```

2. Install dependencies

```bash
cd be-assessment-feb-2024
npm i
```

3. Setup environment variables

Create a `.env` file in the root folder. See `.env.example`.

4. Start the docker containers

This will start the MySQL database then start the application in development mode

```bash
docker compose up
```

5. Apply database migrations

```bash
npm run migration:run
```

6. (Optional) Seeding

```bash
npm run seed
```

## Documentation:

This project uses `Swagger` to generate documentation.

After going through [Setup Guide](#setup-guide), go to http://localhost:5000/docs in your browser

## Testing:

This project uses Jest for testing.

1. To run the tests:

```bash
npm test
```

2. To generate a test coverage report

```bash
npm run test:coverage
```

3. View the HTML report in your browser (after generation)

```bash
open coverage/lcov-report/index.html
```

4. Test coverage evidence
   ![Test Coverage](assets/coverage.png)

## Database Updates

1. To generate migration after updating entities

```bash
npm run migration:generate <MigrationName>
```

2. To apply the migration

```bash
npm run migration:run
```

3. To revert the migration

```bash
npm run migration:revert
```

## DB Tables Diagram

[Database Diagram](assets/db-tables.png)

## Source Code Structure

```
src/
│── config/         # Configuration files (get environment variables,...)
│── constants/      # Constant values (error message, API document tags, ...)
│── controllers/    # API controllers (handling HTTP requests)
│── core/           # Base classes (Base Response, HTTP Exceptions)
│── database/       # Database connection utilities and migration files
│── docs/           # API documentation (generator and register files)
│── entities/       # TypeORM entity definitions
│── middlewares/    # Express middlewares (validation, error handling,...)
│── routes/         # API route definitions
│── schemas/        # Validation schemas (request, response)
│── services/       # Main business logic
│── utils/          # Helper functions
```
