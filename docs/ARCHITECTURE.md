# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Angular Frontend (SPA)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Models    │  │    Views    │  │      Controllers        │  │
│  │  (Data)     │◄─┤ (Templates) │◄─┤  (Components/Services)  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/REST (JSON)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Spring Boot Backend (API)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Controllers │──┤  Services   │──┤     Repositories        │  │
│  │   (REST)    │  │  (Business) │  │       (Data)            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ JDBC/SQL
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Supabase PostgreSQL                        │
│                      (Managed Database)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### Technology Stack

- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Build Tool**: Maven
- **Database Access**: Spring Data JPA / Hibernate
- **Authentication**: Spring Security + JWT

### Design Pattern: MVC + Service Layer

```
backend/
├── src/main/java/com/portfolio/
│   ├── controller/        # REST Controllers
│   ├── service/           # Business Logic
│   ├── repository/        # Data Access (JPA)
│   ├── model/             # Entity Classes
│   ├── dto/               # Data Transfer Objects
│   ├── config/            # Configuration Classes
│   ├── security/          # JWT & Auth Config
│   └── exception/         # Custom Exceptions
└── src/main/resources/
    ├── application.yml    # Configuration
    └── db/migration/      # Flyway Migrations (optional)
```

### REST Controllers

All controllers return JSON responses. No server-side HTML rendering.

```java
@RestController
@RequestMapping("/api/v1")
public class ProjectController {

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDTO>> getPublishedProjects() { }

    @GetMapping("/admin/projects")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProjectDTO>> getAllProjects() { }

    @PostMapping("/admin/projects")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO dto) { }
}
```

### API Endpoint Structure

| Method | Endpoint               | Auth   | Description             |
| ------ | ---------------------- | ------ | ----------------------- |
| GET    | `/api/v1/portfolio`    | Public | All published content   |
| GET    | `/api/v1/projects`     | Public | Published projects      |
| GET    | `/api/v1/experience`   | Public | Published experience    |
| POST   | `/api/v1/auth/login`   | Public | Admin login             |
| POST   | `/api/v1/auth/refresh` | Public | Refresh JWT token       |
| GET    | `/api/v1/admin/*`      | JWT    | Admin read operations   |
| POST   | `/api/v1/admin/*`      | JWT    | Admin create operations |
| PUT    | `/api/v1/admin/*`      | JWT    | Admin update operations |
| DELETE | `/api/v1/admin/*`      | JWT    | Admin delete operations |

### Response Format

All API responses follow a consistent structure:

**Success Response:**

```json
{
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Response:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [ ... ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Frontend Architecture

### Technology Stack

- **Framework**: Angular 17+
- **Language**: TypeScript
- **Styling**: SCSS
- **HTTP Client**: Angular HttpClient
- **State**: Services with RxJS

### Design Pattern: MVC-like Separation

The frontend follows an MVC-inspired architecture adapted for Angular:

```
frontend/
├── src/app/
│   ├── models/            # Data interfaces and types
│   │   ├── project.model.ts
│   │   ├── experience.model.ts
│   │   └── ...
│   │
│   ├── views/             # Presentational components (templates)
│   │   ├── public/        # Public portfolio views
│   │   │   ├── home/
│   │   │   ├── about/
│   │   │   └── ...
│   │   └── admin/         # Admin dashboard views
│   │       ├── login/
│   │       ├── dashboard/
│   │       └── ...
│   │
│   ├── controllers/       # Smart components and services
│   │   ├── services/      # API and business logic services
│   │   │   ├── api.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── portfolio.service.ts
│   │   └── guards/        # Route guards
│   │       └── auth.guard.ts
│   │
│   ├── shared/            # Shared utilities
│   │   ├── components/    # Reusable UI components
│   │   ├── directives/    # Custom directives
│   │   └── pipes/         # Custom pipes
│   │
│   └── core/              # Core module (singleton services)
│       ├── interceptors/  # HTTP interceptors
│       └── constants/     # App constants
│
├── src/assets/            # Static assets
├── src/styles/            # Global SCSS
└── src/environments/      # Environment configs
```

### MVC Mapping

| MVC Concept    | Angular Implementation                                  |
| -------------- | ------------------------------------------------------- |
| **Model**      | TypeScript interfaces in `models/` defining data shapes |
| **View**       | Component templates (HTML) in `views/`                  |
| **Controller** | Services in `controllers/services/` + Component classes |

### Data Flow

```
User Interaction
       │
       ▼
┌─────────────────┐
│  View Component │  (Template + Component Class)
└────────┬────────┘
         │ calls
         ▼
┌─────────────────┐
│    Service      │  (Controller logic)
└────────┬────────┘
         │ HTTP request
         ▼
┌─────────────────┐
│   Backend API   │
└────────┬────────┘
         │ JSON response
         ▼
┌─────────────────┐
│     Model       │  (TypeScript interface)
└────────┬────────┘
         │ typed data
         ▼
┌─────────────────┐
│  View Update    │  (Angular change detection)
└─────────────────┘
```

---

## Database Architecture

### Supabase PostgreSQL

- **Access**: Backend only (no direct frontend access)
- **Connection**: JDBC connection string via environment variables
- **Security**: Database credentials never exposed to client

### Why Backend-Only Access?

1. **Security**: Sensitive data and business logic stay server-side
2. **Validation**: All input validated before database operations
3. **Consistency**: Single source of truth for data access patterns
4. **Audit**: Centralized logging of all database operations

### Entity Relationship (Simplified)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    admin     │     │   project    │     │    skill     │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id           │     │ id           │     │ id           │
│ email        │     │ title        │     │ category     │
│ password_hash│     │ description  │     │ name         │
│ created_at   │     │ tech_stack   │     │ sort_order   │
└──────────────┘     │ live_url     │     └──────────────┘
                     │ github_url   │
                     │ image_url    │
                     │ is_published │
                     │ is_featured  │
                     │ sort_order   │
                     │ created_at   │
                     │ updated_at   │
                     └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  experience  │     │  education   │     │certification │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id           │     │ id           │     │ id           │
│ company      │     │ institution  │     │ name         │
│ role         │     │ degree       │     │ issuer       │
│ start_date   │     │ field        │     │ issue_date   │
│ end_date     │     │ start_year   │     │ credential_url│
│ description  │     │ end_year     │     │ badge_url    │
│ tech_stack   │     │ description  │     │ sort_order   │
│ is_published │     │ sort_order   │     └──────────────┘
│ sort_order   │     └──────────────┘
│ created_at   │
│ updated_at   │     ┌──────────────┐
└──────────────┘     │   profile    │
                     ├──────────────┤
                     │ id           │
                     │ name         │
                     │ title        │
                     │ tagline      │
                     │ bio          │
                     │ avatar_url   │
                     │ resume_url   │
                     │ email        │
                     │ github_url   │
                     │ linkedin_url │
                     │ nickname     │
                     │ updated_at   │
                     └──────────────┘
```

---

## Authentication Architecture

### JWT-Based Authentication

Admin endpoints are protected using JSON Web Tokens (JWT).

```
┌─────────┐                    ┌─────────┐                    ┌─────────┐
│ Angular │                    │ Spring  │                    │Supabase │
│Frontend │                    │ Boot    │                    │Postgres │
└────┬────┘                    └────┬────┘                    └────┬────┘
     │                              │                              │
     │  POST /api/v1/auth/login    │                              │
     │  {email, password}          │                              │
     │────────────────────────────►│                              │
     │                              │  SELECT * FROM admin        │
     │                              │  WHERE email = ?            │
     │                              │─────────────────────────────►│
     │                              │◄─────────────────────────────│
     │                              │  Verify password hash        │
     │                              │  Generate JWT                │
     │  {accessToken, expiresIn}   │                              │
     │◄────────────────────────────│                              │
     │                              │                              │
     │  GET /api/v1/admin/projects │                              │
     │  Authorization: Bearer JWT  │                              │
     │────────────────────────────►│                              │
     │                              │  Validate JWT                │
     │                              │  Extract claims              │
     │                              │─────────────────────────────►│
     │                              │◄─────────────────────────────│
     │  {projects: [...]}          │                              │
     │◄────────────────────────────│                              │
     │                              │                              │
```

### Token Strategy

| Token Type    | Storage           | Lifetime   | Usage                   |
| ------------- | ----------------- | ---------- | ----------------------- |
| Access Token  | Memory (variable) | 15 minutes | API authentication      |
| Refresh Token | HttpOnly Cookie   | 7 days     | Obtain new access token |

### Security Measures

1. **Password Hashing**: BCrypt with cost factor 12
2. **Token Signing**: HMAC-SHA256 with secure secret
3. **CORS**: Restricted to frontend origin
4. **Rate Limiting**: Login endpoint throttled
5. **HTTPS**: All traffic encrypted in production

---

## Communication Protocol

### Request/Response Flow

1. Frontend makes HTTP request to backend API
2. Backend validates request (auth, input)
3. Backend executes business logic
4. Backend queries/updates database
5. Backend returns JSON response
6. Frontend updates UI based on response

### HTTP Headers

**Request:**

```
Content-Type: application/json
Authorization: Bearer <jwt-token>  (admin routes only)
```

**Response:**

```
Content-Type: application/json
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

---

## Deployment Architecture (Future)

```
                    ┌─────────────────┐
                    │   CloudFlare    │
                    │   (CDN + DNS)   │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │  Static Host    │           │  Backend Host   │
    │  (Vercel/       │           │  (Railway/      │
    │   Netlify)      │           │   Render)       │
    │                 │           │                 │
    │  Angular SPA    │──────────►│  Spring Boot    │
    │                 │  API      │                 │
    └─────────────────┘  Calls    └────────┬────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │    Supabase     │
                                  │   PostgreSQL    │
                                  └─────────────────┘
```

---

## Development Environment

### Local Setup

| Service               | Port | URL                   |
| --------------------- | ---- | --------------------- |
| Angular Dev Server    | 4200 | http://localhost:4200 |
| Spring Boot           | 8080 | http://localhost:8080 |
| PostgreSQL (Supabase) | -    | Remote connection     |

### Environment Variables

**Backend (`application.yml`):**

```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USER}
    password: ${DATABASE_PASSWORD}

jwt:
  secret: ${JWT_SECRET}
  expiration: 900000 # 15 minutes

cors:
  allowed-origins: ${CORS_ORIGINS:http://localhost:4200}
```

**Frontend (`environment.ts`):**

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
}
```
