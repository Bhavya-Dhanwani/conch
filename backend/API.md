# Conch Backend API Reference

This file is the living API index for `conch/backend`. Update it whenever a backend API is added, changed, or removed.

Base URL:

```txt
/api
```

## Rate Limiting

Rate limits are applied before route handlers.

```txt
General /api routes        -> default 600 requests / 15 minutes
Auth login/signup routes   -> default 30 requests / 15 minutes
Ingestion routes           -> default 120 requests / 1 minute
Public status routes       -> default 120 requests / 1 minute
```

Ingestion rate limiting uses `X-API-KEY` when present, otherwise it falls back to the request IP. This protects the public SDK endpoint without requiring cookies.

429 response shape:

```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

## Auth APIs

### Signup Manager

```http
POST /api/signup
POST /api/auth/signup
```

Creates a manager account, generates a JWT, and sets the auth cookie.

Body:

```json
{
  "name": "Manager Name",
  "email": "manager@example.com",
  "password": "password"
}
```

### Login

```http
POST /api/login
POST /api/auth/login
```

Logs in a manager or employee, generates a JWT, and sets the auth cookie.

Body:

```json
{
  "email": "manager@example.com",
  "password": "password"
}
```

### Get Current User

```http
GET /api/me
GET /api/auth/me
```

Returns the currently logged-in user.

Auth:

```txt
Cookie token or Bearer token required
```

### Logout

```http
POST /api/logout
POST /api/auth/logout
```

Clears the auth cookie and logs the user out.

## Employee APIs

These APIs are manager-only.

### Create Employee

```http
POST /api/employees
POST /api/auth/employees
```

Creates an employee under the logged-in manager. Backend generates a password and emails it to the employee.

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

### Get Employees

```http
GET /api/employees
GET /api/auth/employees
```

Returns employees created by the logged-in manager.

Auth:

```txt
MANAGER
```

### Update Employee

```http
PATCH /api/employees/:employeeId
PATCH /api/auth/employees/:employeeId
```

Updates one employee owned by the logged-in manager.

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

Deletes one employee owned by the logged-in manager.

Auth:

```txt
MANAGER
```

## Project APIs

### Create Project

```http
POST /api/projects
```

Creates a project for the logged-in manager and generates a unique API key for SDK ingestion.

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

### Get Projects

```http
GET /api/projects
```

Returns active projects accessible to the logged-in user.

Access:

```txt
Manager  -> own projects
Employee -> manager's projects
```

### Get Single Project

```http
GET /api/projects/:projectId
```

Returns one project only if the logged-in user has access.

## Project Chat APIs

These APIs power the project group chat. Manager and employees can use the same chat if they have access to the project.

### Get Project Chat Messages

```http
GET /api/chat/projects/:projectId/messages
```

Returns recent project chat messages.

Auth:

```txt
MANAGER or EMPLOYEE
```

Query params:

```txt
limit  -> max messages to return, default 50, max 100
before -> optional ISO date for older messages
```

### Send Project Chat Message

```http
POST /api/chat/projects/:projectId/messages
```

Saves a project chat message through REST. Socket.io can also be used for realtime sending.

Auth:

```txt
MANAGER or EMPLOYEE
```

Body:

```json
{
  "message": "I am checking the payment gateway logs."
}
```

## Project Chat Socket Events

Socket.io is attached to the same backend server.

Client authentication options:

```js
io("http://localhost:8080", {
  auth: {
    token: "JWT_TOKEN"
  },
  withCredentials: true
});
```

The socket also accepts the normal `token` cookie or `Authorization: Bearer <token>` header.

### Join Project Chat

```txt
emit: project_chat:join
```

Payload:

```js
{
  projectId: "..."
}
```

### Leave Project Chat

```txt
emit: project_chat:leave
```

Payload:

```js
{
  projectId: "..."
}
```

### Send Message

```txt
emit: project_chat:message
```

Payload:

```js
{
  projectId: "...",
  message: "Any update?"
}
```

### Receive Message

```txt
listen: project_chat:new_message
```

Payload:

```js
{
  projectId: "...",
  message: {
    _id,
    projectId,
    owner,
    sender,
    message,
    createdAt,
    updatedAt
  }
}
```

## Ingestion API

This API is used by the client SDK and external apps. It does not use cookie auth.

### Ingest Error Event

```http
POST /api/ingest/event
```

Validates the project API key, saves the error log, and triggers background AI analysis.

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
  "codeSnippet": "user.name.toUpperCase()",
  "metadata": {
    "browser": "Chrome",
    "os": "Windows",
    "url": "https://example.com/dashboard",
    "userAgent": "Mozilla/5.0 ..."
  }
}
```

Accepted alternate fields:

```txt
errorMessage or message or error.message
errorName or name or error.name
stackTrace or stack or error.stack
codeSnippet or code or sourceCode
```

Flow:

```txt
API key validate
-> project find
-> log save with status PENDING
-> AI analysis queued
-> response returns logId
```

## Log APIs

### Get Project Logs

```http
GET /api/logs/project/:projectId
```

Returns the latest logs for a project. Logs include `aiReport` once AI analysis is done.

Auth:

```txt
MANAGER or EMPLOYEE
```

Access:

```txt
Manager  -> logs for own projects
Employee -> logs for manager's projects
```

### Get Single Log

```http
GET /api/logs/:logId
```

Returns one log only if the logged-in user has access to that log's project.

Auth:

```txt
MANAGER or EMPLOYEE
```

Log AI statuses:

```txt
PENDING  -> log saved, AI pending/running
ANALYZED -> AI report generated
FAILED   -> AI analysis failed
```

## Incident APIs

These APIs power the smart incident response workflow.

### Create Incident

```http
POST /api/incidents
```

Creates a production incident/outage for a project. Can optionally link the incident to a source log.

Auth:

```txt
MANAGER or EMPLOYEE
```

Body:

```json
{
  "projectId": "...",
  "sourceLog": "...",
  "title": "Checkout is failing",
  "description": "Users cannot complete payment.",
  "severity": "HIGH",
  "status": "INVESTIGATING",
  "publicStatus": "PARTIAL_OUTAGE",
  "responders": ["..."]
}
```

### Get Project Incidents

```http
GET /api/incidents/project/:projectId
```

Returns incidents for a project, including responders, updates, timeline, source log, and postmortem.

Auth:

```txt
MANAGER or EMPLOYEE
```

### Get Single Incident

```http
GET /api/incidents/:incidentId
```

Returns one incident if the logged-in user has access to its project.

Auth:

```txt
MANAGER or EMPLOYEE
```

### Update Incident

```http
PATCH /api/incidents/:incidentId
```

Updates incident fields and records status changes in the timeline.

Auth:

```txt
MANAGER or EMPLOYEE
```

Editable fields:

```txt
title
description
severity
status
publicStatus
```

Status values:

```txt
OPEN
INVESTIGATING
IDENTIFIED
MONITORING
RESOLVED
```

### Assign Responders

```http
POST /api/incidents/:incidentId/responders
```

Assigns manager/team employees as responders and adds a timeline entry.

Auth:

```txt
MANAGER or EMPLOYEE
```

Body:

```json
{
  "responders": ["..."]
}
```

### Post Live Update

```http
POST /api/incidents/:incidentId/updates
```

Adds a live incident update and records it in the timeline.

Auth:

```txt
MANAGER or EMPLOYEE
```

Body:

```json
{
  "message": "We identified the payment gateway timeout.",
  "isPublic": true
}
```

Notes:

```txt
isPublic: true  -> visible on public status API
isPublic: false -> internal dashboard only
```

### Generate Incident Postmortem

```http
POST /api/incidents/:incidentId/postmortem
```

Uses Gemini to generate and save an incident postmortem based on incident data, timeline, updates, and linked source log.

Auth:

```txt
MANAGER or EMPLOYEE
```

Generated fields:

```txt
summary
impact
rootCause
resolution
prevention
generatedBy
generatedAt
```

## Public Status APIs

These APIs are public and do not use cookie auth.

### Get Public Project Status

```http
GET /api/status/public/projects/:projectId
```

Returns active public incidents and public updates for a project.

Returned active incident statuses:

```txt
OPEN
INVESTIGATING
IDENTIFIED
MONITORING
```

Public status values:

```txt
OPERATIONAL
DEGRADED
PARTIAL_OUTAGE
MAJOR_OUTAGE
```

Response shape:

```js
{
  project,
  currentStatus,
  incidents
}
```

## Current Challenge Coverage

```txt
Manager/Employee auth             -> done
Projects with API keys            -> done
Client SDK ingestion              -> done
Error logs                        -> done
AI probable root-cause reports    -> done
Incident creation                 -> done
Responder assignment              -> done
Live updates                      -> done
Incident timeline                 -> done
AI postmortems                    -> done
Public status API                 -> done
Project group chat                -> done
```
