# Sita Portfolio

A full-stack portfolio application with a Spring Boot backend and Angular frontend.

## Project Structure

```
├── backend/          # Spring Boot REST API
├── frontend/         # Angular SPA
└── README.md
```

## Prerequisites

- **Backend**: Java 17+, Maven 3.8+
- **Frontend**: Node.js 18+, npm 9+, Angular CLI

## Getting Started

### Backend (Spring Boot)

```bash
cd backend

# Install dependencies and run
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd spring-boot:run
```

The API will be available at `http://localhost:8080`

### Frontend (Angular)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
ng serve
```

The application will be available at `http://localhost:4200`

## Development

### Running Both Services

For local development, run both services in separate terminals:

**Terminal 1 - Backend:**

```bash
cd backend && ./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**

```bash
cd frontend && ng serve
```

## Build for Production

### Backend

```bash
cd backend
./mvnw clean package
java -jar target/*.jar
```

### Frontend

```bash
cd frontend
ng build --configuration production
```

## License

MIT
