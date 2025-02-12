# Student Management

## 1. Description

A backend service that helps teachers manage the students

## 2. Features

- Teacher can register students under any teacher.
- Teacher can retrieve the list of students common to a given list of teachers.
- Teacher can suspend a specified student.
- Teacher can retrieve the list of students who can received a given notification.

## 3. Technology

- **Backend Framework**: ExpressJS
- **Database**: MySQL (with TypeORM)

## 4. Setup Guide

### 4.1. Clone the project

```bash
git clone git@github.com:SonDo580/be-assessment-feb-2024.git
```

### 4.2. Install dependencies

```bash
cd be-assessment-feb-2024
npm i
```

### 4.3. Setup environment variables

Create a `.env` file in the root folder. See `.env.example`.

### 4.4. Start the database container

```bash
docker compose up
```

### 4.5. Start the application in development mode

```bash
npm run dev
```

### 4.6. Apply database migrations

```bash
npm run migration:run
```

### 4.7. Start making requests