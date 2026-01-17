# Portfolio Backend API

Spring Boot REST API for the portfolio application.

## Quick Start

### Prerequisites

- Java 17+
- Maven 3.8+
- PostgreSQL (Supabase)

### Setup

1. **Copy environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Configure database:**

   Edit `.env` and set your Supabase Session Pooler URL:

   ```env
   SPRING_DATASOURCE_URL=jdbc:postgresql://your_url/host?user=postgres.yourref&password=yourpassword
   ```

3. **Generate JWT secret:**

   ```bash
   # Linux/macOS
   openssl rand -base64 48

   # Windows PowerShell
   [Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
   ```

4. **Run the application:**

   ```bash
   ./mvnw spring-boot:run
   ```

   Or on Windows:

   ```cmd
   mvnw.cmd spring-boot:run
   ```

## Default Admin Credentials

> ⚠️ **IMPORTANT: Change these credentials immediately after first login!**

| Field    | Value                   |
| -------- | ----------------------- |
| Email    | `admin@portfolio.local` |
| Password | `ChangeMe123!`          |

### How to Change Password

1. Log in with the default credentials
2. Use the admin dashboard to change your password
3. Or update directly in the database:

```sql
-- Generate a new BCrypt hash (cost factor 12)
-- Use an online BCrypt generator or your application
UPDATE portfolio.admin_user
SET password_hash = '$2a$12$YOUR_NEW_BCRYPT_HASH_HERE',
    updated_at = NOW()
WHERE email = 'admin@portfolio.local';
```

### Generate BCrypt Hash

## API Endpoints

### Public Endpoints (No Authentication)

| Method | Endpoint             | Description  |
| ------ | -------------------- | ------------ |
| GET    | `/api/public/health` | Health check |
| POST   | `/api/auth/login`    | Admin login  |

### Admin Endpoints (Requires JWT)

| Method | Endpoint               | Description       |
| ------ | ---------------------- | ----------------- |
| GET    | `/api/admin/me`        | Current user info |
| GET    | `/api/admin/dashboard` | Dashboard access  |

### Authentication

1. **Login to get a token:**

   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@portfolio.local", "password": "nah!"}'
   ```

   Response:

   ```json
   {
     "timestamp": "2024-01-15T10:30:00Z",
     "path": "/api/auth/login",
     "data": {
       "accessToken": "eyJhbGciOiJIUzI1NiIs...",
       "expiresIn": 900,
       "tokenType": "Bearer"
     }
   }
   ```

2. **Use the token for admin requests:**

   ```bash
   curl http://localhost:8080/api/admin/me \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
   ```

## Configuration

### Environment Variables

| Variable                 | Description                         | Required |
| ------------------------ | ----------------------------------- | -------- |
| `SPRING_PROFILES_ACTIVE` | Active profile (dev, prod)          | No       |
| `SPRING_DATASOURCE_URL`  | JDBC URL for Supabase               | Yes      |
| `JWT_SECRET`             | Secret key for JWT signing (min 32) | Yes      |
| `CORS_ALLOWED_ORIGIN`    | Frontend URL for CORS               | No       |

### Profiles

- **dev**: Verbose logging, detailed errors
- **prod**: Minimal logging, no sensitive data in errors

```bash
# Run with dev profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Run with prod profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

## Development

### Run Tests

```bash
./mvnw test
```

### Project Structure

```
src/main/java/com/sita/portfolio/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── exception/       # Exception handling
├── model/
│   ├── dto/         # Data Transfer Objects
│   │   ├── request/ # Request DTOs
│   │   └── response/# Response DTOs
│   └── entity/      # JPA entities
├── repository/      # Data access
├── security/        # JWT & authentication
└── service/         # Business logic
```

## Security Notes

- JWT tokens expire after 15 minutes (configurable)
- Passwords are hashed with BCrypt (cost factor 12)
- All admin endpoints require valid JWT with ROLE_ADMIN
- CORS is configured for the specified frontend origin only
