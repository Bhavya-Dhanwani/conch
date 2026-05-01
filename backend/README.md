# Conch Backend Documentation

This README tracks the backend work done so far and should be updated whenever a new backend feature, API, model, or flow is added.

## Current Goal

The backend currently supports the first version of the error ingestion pipeline:

1. Manager creates a project.
2. Backend generates a unique API key for that project.
3. Client SDK sends error data to the ingestion endpoint with that API key.
4. Backend validates the API key.
5. Backend saves the error event in MongoDB.
6. Dashboard APIs allow manager/employees to fetch projects and logs.

AI report generation and the npm SDK will be added after this base pipeline.

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT auth
- Cookie-based dashboard auth
- `X-API-KEY` based ingestion auth

## Main Folders

```txt
src/
  Configs/
  Controllers/
  Middlewares/
  Models/
  Routes/
  Services/
  Utilities/
```

## Existing Auth System

The project already had manager and employee auth before the ingestion work.

### User Roles

```txt
MANAGER
EMPLOYEE
```

### User Grouping

For now, employees are linked directly to their manager using:

```js
managerId
```

Because of this, a separate `Organization` model has not been added yet. Current project/log access is based on the manager relationship:

- Manager owns projects.
- Employee can access projects/logs owned by their `managerId`.

## Models

### User

File:

```txt
src/Models/user.model.js
```

Important fields:

```js
{
  name,
  email,
  password,
  role: "MANAGER" | "EMPLOYEE",
  managerId,
  work,
  employmentStartsAt,
  employmentEndsAt
}
```

Notes:

- Password is hidden by default using `select: false`.
- Employees are linked to managers by `managerId`.
- `employmentEndsAt` has a TTL index.

### Project

File:

```txt
src/Models/project.model.js
```

Purpose:

Each project represents one website/app whose errors will be tracked.

Fields:

```js
{
  name,
  apiKey,
  owner,
  isActive
}
```

Notes:

- `apiKey` is unique.
- `apiKey` is hidden by default using `select: false`.
- `owner` references the manager user.
- Employees access projects through their manager.

### Log

File:

```txt
src/Models/log.model.js
```

Purpose:

Stores error events received from the client SDK.

Fields:

```js
{
  projectId,
  owner,
  errorName,
  errorMessage,
  stackTrace,
  metadata: {
    browser,
    os,
    url,
    userAgent
  },
  status,
  aiReport
}
```

Status values:

```txt
PENDING
ANALYZED
FAILED
```

AI report shape:

```js
{
  analysis,
  solution,
  severity: "LOW" | "MEDIUM" | "HIGH"
}
```

Notes:

- `aiReport` exists in the schema but is not generated yet.
- New ingested logs are saved with `status: "PENDING"`.

## Services Added

### Project Service

File:

```txt
src/Services/project.service.js
```

Responsibilities:

- Create projects.
- Generate project API keys.
- Fetch projects for manager/employee.
- Validate project access for a logged-in user.

Important functions:

```js
createProject(user, payload)
getProjects(user)
getProjectForUser(user, projectId)
```

### Log Service

File:

```txt
src/Services/log.service.js
```

Responsibilities:

- Fetch logs for a project.
- Fetch a single log.
- Ensure the logged-in user has access to the project before returning logs.

Important functions:

```js
getProjectLogs(user, projectId)
getLogById(user, logId)
```

### Ingest Service

File:

```txt
src/Services/ingest.service.js
```

Responsibilities:

- Read and validate API key.
- Find active project by API key.
- Normalize error payload.
- Save log in MongoDB.

Important function:

```js
ingestEvent(apiKey, payload)
```

## Controllers Added

```txt
src/Controllers/project.controller.js
src/Controllers/log.controller.js
src/Controllers/ingest.controller.js
```

These controllers call service functions and return JSON responses.

## Routes Added

```txt
src/Routes/project.route.js
src/Routes/log.route.js
src/Routes/ingest.route.js
```

Registered in:

```txt
src/Routes/index.js
```

## API Documentation

Base prefix:

```txt
/api
```

## Auth APIs

These already existed and are still active.

### Signup Manager

```http
POST /api/signup
POST /api/auth/signup
```

Body:

```json
{
  "name": "Manager Name",
  "email": "manager@example.com",
  "password": "password"
}
```

Creates a manager account and sets auth cookie.

### Login

```http
POST /api/login
POST /api/auth/login
```

Body:

```json
{
  "email": "manager@example.com",
  "password": "password"
}
```

Logs user in and sets auth cookie.

### Get Current User

```http
GET /api/me
GET /api/auth/me
```

Auth required.

### Logout

```http
POST /api/logout
POST /api/auth/logout
```

Clears auth cookie.

## Employee APIs

Only managers can manage employees.

### Create Employee

```http
POST /api/employees
POST /api/auth/employees
```

Auth:

```txt
MANAGER
```

Body:

```json
{
  "name": "Employee Name",
  "email": "employee@example.com",
  "work": "Frontend",
  "employmentStartsAt": "2026-05-01",
  "employmentEndsAt": "2026-12-31"
}
```

Creates an employee linked to the logged-in manager.

### Get Employees

```http
GET /api/employees
GET /api/auth/employees
```

Auth:

```txt
MANAGER
```

Returns employees created by the logged-in manager.

### Update Employee

```http
PATCH /api/employees/:employeeId
PATCH /api/auth/employees/:employeeId
```

Auth:

```txt
MANAGER
```

Editable fields:

```txt
name
work
employmentStartsAt
employmentEndsAt
```

### Delete Employee

```http
DELETE /api/employees/:employeeId
DELETE /api/auth/employees/:employeeId
```

Auth:

```txt
MANAGER
```

Deletes an employee owned by the logged-in manager.

## Project APIs

### Create Project

```http
POST /api/projects
```

Auth:

```txt
MANAGER
```

Body:

```json
{
  "name": "My Website"
}
```

Response includes generated `apiKey`:

```json
{
  "success": true,
  "message": "Project created successfully",
  "project": {
    "_id": "...",
    "name": "My Website",
    "apiKey": "conch_xxxxx",
    "owner": "...",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Get Projects

```http
GET /api/projects
```

Auth:

```txt
MANAGER or EMPLOYEE
```

Access rules:

- Manager gets projects owned by them.
- Employee gets projects owned by their manager.

### Get Single Project

```http
GET /api/projects/:projectId
```

Auth:

```txt
MANAGER or EMPLOYEE
```

Returns project only if the logged-in user has access.

## Ingestion APIs

These APIs are used by the future npm client SDK.

### Ingest Error Event

```http
POST /api/ingest/event
```

Auth:

```txt
X-API-KEY header
```

Headers:

```http
X-API-KEY: conch_xxxxx
Content-Type: application/json
```

Body:

```json
{
  "errorName": "TypeError",
  "errorMessage": "Cannot read properties of undefined",
  "stackTrace": "TypeError: Cannot read properties of undefined\n    at ...",
  "metadata": {
    "browser": "Chrome",
    "os": "Windows",
    "url": "https://example.com/dashboard",
    "userAgent": "Mozilla/5.0 ..."
  }
}
```

Alternate accepted payload fields:

```txt
errorMessage or message or error.message
errorName or name or error.name
stackTrace or stack or error.stack
```

Success response:

```json
{
  "success": true,
  "message": "Event received successfully",
  "logId": "..."
}
```

Failure cases:

```txt
401 - X-API-KEY header is required
401 - Invalid API key
400 - errorMessage is required
```

Notes:

- This route does not use cookies.
- This route has open CORS so browser SDKs can send logs from any website.
- Security depends on API key validation.

## Log APIs

### Get Project Logs

```http
GET /api/logs/project/:projectId
```

Auth:

```txt
MANAGER or EMPLOYEE
```

Returns latest 100 logs for the project.

Access rules:

- Manager can fetch logs for their own projects.
- Employee can fetch logs for their manager's projects.

### Get Single Log

```http
GET /api/logs/:logId
```

Auth:

```txt
MANAGER or EMPLOYEE
```

Returns one log only if the logged-in user has access to that log's project.

## Current Ingestion Flow

```txt
Client SDK / test client
  -> POST /api/ingest/event
  -> X-API-KEY validation
  -> Project lookup
  -> Log creation
  -> Response with logId
```

Saved log example:

```js
{
  projectId: "...",
  owner: "...",
  errorName: "TypeError",
  errorMessage: "Cannot read properties of undefined",
  stackTrace: "...",
  metadata: {
    browser: "Chrome",
    os: "Windows",
    url: "https://example.com/dashboard",
    userAgent: "Mozilla/5.0 ..."
  },
  status: "PENDING",
  aiReport: null
}
```

## CORS Behavior

Dashboard APIs:

```txt
Allowed origin = process.env.CLIENT_URL or http://localhost:5173
Credentials = true
```

Ingestion API:

```txt
Origin = *
Credentials = false
```

Reason:

The future npm package must be able to send logs from any client website, but dashboard APIs should remain cookie-based and restricted to the frontend app.

## Validation And Authorization Rules

### Dashboard Auth

Dashboard routes use:

```js
isAuthenticated
```

Some manager-only routes also use:

```js
restrictTo("MANAGER")
```

### Project Access

Centralized in:

```txt
src/Services/project.service.js
```

Current logic:

```txt
If user is MANAGER:
  owner = user._id

If user is EMPLOYEE:
  owner = user.managerId
```

Then project is queried by:

```js
{
  _id: projectId,
  owner,
  isActive: true
}
```

## Environment Variables

Known environment variables used by the backend:

```txt
PORT
CLIENT_URL
RESEND_API_KEY
```

There may also be database/JWT variables used by config/util files. Keep this section updated when those files are changed.

## Verification Done

The following checks were run after adding ingestion/project/log code:

```txt
node --check conch/backend/src/Routes/index.js
node --check conch/backend/src/Services/ingest.service.js
node --check conch/backend/src/Models/log.model.js
node -e "import('dotenv/config').then(() => import('./src/app.js')).then(() => console.log('app import ok'))"
```

Result:

```txt
App import ok with dotenv loaded.
```

Note:

Importing the app without `dotenv/config` can fail if `RESEND_API_KEY` is missing because the email utility initializes Resend at import time.

## Next Backend Work

### Immediate Next Steps

1. Add AI processing service.
2. Trigger AI analysis after a log is created.
3. Update the same log document with `aiReport`.
4. Add `status: "ANALYZED"` or `status: "FAILED"` depending on AI result.
5. Add rate limiting for ingestion endpoint.
6. Add stricter payload sanitization for stack traces and metadata.

### Later Improvements

1. Add Organization model if team/company structure becomes bigger.
2. Add separate Report collection if AI reports need versioning/history.
3. Add Socket.io for real-time dashboard updates.
4. Add API key rotation for projects.
5. Add project delete/archive endpoint.
6. Add project-level employee permissions.
7. Add pagination/filtering for logs.
8. Add severity filters and error grouping.

## Documentation Rule

Whenever backend work is added or changed, update this README with:

1. New/changed models.
2. New/changed services.
3. New/changed routes.
4. Request/response examples for APIs.
5. Auth and authorization rules.
6. Any verification/testing done.
