# Sita Portfolio

A production grade full stack portfolio platform designed with strict separation of concerns, secure API boundaries, and cloud native deployment.

The system is architected as a decoupled Angular single page application and a Spring Boot REST API backed by a managed PostgreSQL database.

Live: https://hey-sita.dev/

---

## High Level Architecture

```
Client Browser
      ↓
Angular SPA (Vercel)
      ↓ HTTPS / JSON
Spring Boot API (Render)
      ↓ JDBC
Supabase PostgreSQL
```

---

## Architectural Goals

| Goal | Description |
|----|------------|
| Separation of concerns | Frontend and backend evolve independently |
| Security | No direct client database access |
| Scalability | Stateless REST APIs |
| Maintainability | Layered backend design |
| Deployability | Cloud native hosting |

---

## Backend System Design

### Architectural Pattern

- MVC with a dedicated service layer
- DTO based API contracts
- Stateless REST architecture

### Backend Layers

| Layer | Responsibility |
|-----|----------------|
| Controller | API endpoints, validation, authorization |
| Service | Business logic orchestration |
| Repository | Data access abstraction |
| Security | JWT authentication and authorization |
| DTO | Controlled data exposure |

### Backend Structure

```
backend/
└── src/main/java/com/portfolio/
    ├── controller/
    ├── service/
    ├── repository/
    ├── model/
    ├── dto/
    ├── security/
    ├── config/
    └── exception/
```

---

## Frontend System Design

### Architectural Style

- Single Page Application
- MVC inspired separation
- Service driven data access
- Strongly typed domain models

### MVC Mapping

| Concept | Angular Implementation |
|------|------------------------|
| Model | TypeScript interfaces |
| View | Component templates |
| Controller | Services and components |

### Frontend Structure

```
frontend/
└── src/app/
    ├── models/
    ├── views/
    ├── services/
    ├── guards/
    ├── interceptors/
    ├── shared/
    └── core/
```

---

## Data Flow

```
User Action
    ↓
Angular View
    ↓
Angular Service
    ↓
REST API Call
    ↓
Spring Controller
    ↓
Service Layer
    ↓
Repository
    ↓
Database
```

All validation, authorization, and persistence logic resides on the backend.

---

## Database Design

### Characteristics

- Supabase managed PostgreSQL
- Backend only access
- Schema aligned with domain entities
- Publishing and ordering controls

### Core Domains

| Domain | Purpose |
|-----|---------|
| Profile | Personal metadata |
| Projects | Portfolio content |
| Experience | Work history |
| Education | Academic records |
| Skills | Categorized skills |
| Certifications | Professional credentials |
| Admin | Privileged access |

---

## Authentication Architecture

### Strategy

- JWT based authentication
- Stateless authorization
- Role restricted admin APIs

### Token Model

| Token | Scope | Storage |
|-----|------|---------|
| Access Token | API authorization | Memory |
| Refresh Token | Token renewal | HttpOnly cookie |

### Security Controls

- BCrypt password hashing
- Signed JWT tokens
- Centralized request filtering
- Restricted CORS policy

---

## Deployment Architecture

### Hosting Platforms

| Component | Platform |
|--------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Supabase PostgreSQL |

### Deployment Topology

```
Client
  ↓
Vercel CDN
  ↓
Angular SPA
  ↓
Render API Service
  ↓
Supabase PostgreSQL
```

Frontend and backend are independently deployable and horizontally scalable.

---

## Communication Contract

| Aspect | Design |
|-----|-------|
| Protocol | HTTPS |
| Format | JSON |
| Style | REST |
| Authentication | Bearer JWT |
| Error Handling | Centralized |

---

## License

All Rights Reserved

This repository is proprietary software.
Unauthorized copying, redistribution, or reuse is strictly prohibited.
