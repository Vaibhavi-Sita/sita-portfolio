# Supabase Setup Guide

Step-by-step instructions to configure Supabase PostgreSQL for the portfolio backend using the **IPv4-compatible Session Pooler**.

---

## Table of Contents

1. [Create a Supabase Project](#1-create-a-supabase-project)
2. [Get the Session Pooler Connection String](#2-get-the-session-pooler-connection-string)
3. [Create the Portfolio Schema](#3-create-the-portfolio-schema)
4. [Configure Backend Environment Variables](#4-configure-backend-environment-variables)
5. [Verify the Connection](#5-verify-the-connection)

---

## 1. Create a Supabase Project

### Step 1.1: Sign Up / Log In

1. Go to [https://supabase.com](https://supabase.com)
2. Click **Start your project** or **Sign In**
3. Sign up with GitHub, email, or SSO

### Step 1.2: Create a New Project

1. From the dashboard, click **New Project**
2. Select your organization (or create one)
3. Fill in the project details:

   | Field                 | Value                                               |
   | --------------------- | --------------------------------------------------- |
   | **Name**              | `portfolio` (or your preferred name)                |
   | **Database Password** | Generate a strong password and **save it securely** |
   | **Region**            | Choose the region closest to your users             |
   | **Pricing Plan**      | Free tier is sufficient for development             |

4. Click **Create new project**
5. Wait 1-2 minutes for provisioning to complete

> ⚠️ **IMPORTANT**: Save the database password immediately. You cannot retrieve it later.

---

## 2. Get the Session Pooler Connection String

We use the **Session Pooler** connection string because it's **IPv4 compatible** and works reliably on all networks, including those without IPv6 support.

### Step 2.1: Navigate to Connection Settings

1. In your Supabase project dashboard, click **Connect** (top right button)
2. Or go to **Project Settings** → **Database**

### Step 2.2: Get the JDBC Session Pooler URL

1. In the connection dialog, configure:

   | Setting    | Value              |
   | ---------- | ------------------ |
   | **Type**   | `JDBC`             |
   | **Source** | `Primary Database` |
   | **Method** | `Session pooler`   |

2. You will see a connection string like:

```
jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:5432/postgres?user=postgres.yourprojectref&password=[YOUR-PASSWORD]
```

3. **Copy this entire URL** — this is your `SPRING_DATASOURCE_URL`

### Why Session Pooler?

| Connection Type      | IPv4 | IPv6 | Best For                            |
| -------------------- | ---- | ---- | ----------------------------------- |
| Direct Connection    | ❌   | ✅   | IPv6 networks only                  |
| **Session Pooler** ✓ | ✅   | ✅   | **Most networks (recommended)**     |
| Transaction Pooler   | ✅   | ✅   | Serverless, short-lived connections |

> 🌐 **IPv4 Compatibility**: The Session Pooler uses `aws-0-<region>.pooler.supabase.com` which resolves to IPv4 addresses, ensuring connectivity on networks that don't support IPv6.

### Session Pooler URL Components

| Component    | Example Value                         | Description                     |
| ------------ | ------------------------------------- | ------------------------------- |
| **Host**     | `aws-0-us-east-1.pooler.supabase.com` | IPv4-compatible pooler host     |
| **Port**     | `5432`                                | Standard PostgreSQL port        |
| **Database** | `postgres`                            | Default database                |
| **User**     | `postgres.abcdefghijkl`               | Pooler format: `postgres.<ref>` |
| **Password** | Your database password                | Set during project creation     |

> 📝 **Note**: The user format `postgres.<project-ref>` is specific to the pooler and is different from direct connections. This is normal.

---

## 3. Create the Portfolio Schema

### Step 3.1: Open the SQL Editor

1. In the left sidebar, click **SQL Editor**
2. Click **New query**

### Step 3.2: Create the Schema

Run the following SQL:

```sql
-- Create the portfolio schema
CREATE SCHEMA IF NOT EXISTS portfolio;

-- Verify the schema was created
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name = 'portfolio';
```

Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`).

You should see one row returned with `portfolio` as the schema name.

### Step 3.3: Grant Permissions (Optional - For Custom User)

For production, consider creating a dedicated backend user with minimal privileges:

```sql
-- Create a dedicated user for the backend application
CREATE ROLE portfolio_backend WITH
    LOGIN
    PASSWORD 'your_secure_password_here'
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    NOREPLICATION;

-- Grant schema permissions
GRANT USAGE ON SCHEMA portfolio TO portfolio_backend;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA portfolio TO portfolio_backend;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA portfolio TO portfolio_backend;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA portfolio
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO portfolio_backend;
ALTER DEFAULT PRIVILEGES IN SCHEMA portfolio
    GRANT USAGE, SELECT ON SEQUENCES TO portfolio_backend;
```

> 💡 **Tip**: For development, using the default `postgres` user via the Session Pooler is fine.

---

## 4. Configure Backend Environment Variables

### Step 4.1: Create Local Environment File

In the **backend** directory:

```bash
cd backend
cp .env.example .env
```

### Step 4.2: Fill in the Values

Edit `backend/.env` with your actual values:

```env
# Spring Profile
SPRING_PROFILES_ACTIVE=dev

# Database - Paste your JDBC Session Pooler URL here
# IMPORTANT: Use the Session Pooler URL for IPv4 compatibility
# Get from: Supabase Dashboard -> Connect -> JDBC -> Session pooler
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:5432/postgres?user=postgres.abcdefghijkl&password=YourActualPasswordHere

# JWT Secret - Generate a secure random string (min 32 characters)
JWT_SECRET=your-64-character-random-string-here

# CORS - Frontend URL (no trailing slash)
CORS_ALLOWED_ORIGIN=http://localhost:4200
```

### Step 4.3: Generate a JWT Secret

Use one of these methods to generate a secure JWT secret:

**Option A: Using OpenSSL (Linux/macOS/Git Bash)**

```bash
openssl rand -base64 48
```

**Option B: Using PowerShell (Windows)**

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

**Option C: Using Node.js**

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

### Step 4.4: Verify .env is Gitignored

Confirm `.env` will not be committed:

```bash
git check-ignore backend/.env
```

This should output `backend/.env`, confirming it's ignored.

---

## 5. Verify the Connection

### Step 5.1: Start the Backend

```bash
cd backend
./mvnw spring-boot:run
```

Or on Windows:

```cmd
cd backend
mvnw.cmd spring-boot:run
```

### Step 5.2: Check Startup Logs

On successful startup, you should see:

```
═══════════════════════════════════════════════════════════════
  Portfolio API started successfully
  ─────────────────────────────────────────────────────────────
  Profile:    dev
  Database:   aws-0-us-east-1.pooler.supabase.com:5432/postgres
  Flyway:     v2 (seed_minimal_data)
  Server:     http://localhost:8080
  Health:     http://localhost:8080/api/public/health
═══════════════════════════════════════════════════════════════
```

> ✅ **No credentials appear in the logs** — only the host and database name are shown.

### Step 5.3: Test the Health Endpoint

```bash
curl http://localhost:8080/api/public/health
```

Expected response:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/public/health",
  "data": {
    "status": "UP",
    "database": "UP",
    "version": "1.0.0"
  }
}
```

| Field           | Description                        |
| --------------- | ---------------------------------- |
| `timestamp`     | ISO 8601 timestamp of the response |
| `path`          | Request path                       |
| `data.status`   | Overall application status         |
| `data.database` | Database connection status         |
| `data.version`  | API version                        |

---

## Troubleshooting

### "Connection refused" or Timeout Error

**Cause**: Network cannot reach Supabase (often an IPv6 issue on IPv4-only networks)

**Solution**:

1. Ensure you're using the **Session Pooler** URL (starts with `aws-...pooler.supabase.com`)
2. Do NOT use the direct connection URL (`db.<project-ref>.supabase.co`)
3. Verify your network allows outbound connections on port 5432

### "SPRING_DATASOURCE_URL is not set" Error

**Cause**: Environment variable not loaded

**Solution**:

1. Verify `backend/.env` file exists
2. Check the variable name is exactly `SPRING_DATASOURCE_URL`
3. Ensure no typos in the JDBC URL
4. Restart the application after creating/modifying `.env`

### "Password authentication failed" Error

**Cause**: Incorrect password in URL

**Solution**:

1. Check for special characters in password that may need URL encoding
2. Verify the password matches your Supabase database password
3. Regenerate the connection string from Supabase dashboard

### "Schema 'portfolio' does not exist" Error

**Cause**: Schema not created or Flyway hasn't run

**Solution**:

1. Run `CREATE SCHEMA IF NOT EXISTS portfolio;` in Supabase SQL Editor
2. Restart the backend to trigger Flyway migrations
3. Check Flyway logs for migration errors

### Supabase Project Paused

Free-tier projects pause after 7 days of inactivity:

1. Log into Supabase dashboard
2. Your paused project will show a **Restore** button
3. Click to restore (takes ~1 minute)

### Special Characters in Password

If your password contains special characters, they may need URL encoding:

| Character | URL Encoded |
| --------- | ----------- |
| `@`       | `%40`       |
| `#`       | `%23`       |
| `$`       | `%24`       |
| `%`       | `%25`       |
| `&`       | `%26`       |
| `+`       | `%2B`       |
| `/`       | `%2F`       |
| `=`       | `%3D`       |
| `?`       | `%3F`       |

**Example**: If your password is `P@ss#123`, the URL should have `password=P%40ss%23123`

---

## Security Checklist

- [ ] `backend/.env` file is listed in `.gitignore`
- [ ] Database password is not committed anywhere in the repository
- [ ] JWT secret is at least 32 characters and randomly generated
- [ ] Connection string is not hardcoded in source files
- [ ] Credentials do not appear in startup logs
- [ ] Using **Session Pooler** URL for IPv4 compatibility
- [ ] Production uses a dedicated database user with minimal privileges
