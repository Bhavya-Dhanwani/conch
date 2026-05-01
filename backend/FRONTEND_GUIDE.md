# Conch Frontend Integration Guide

Ye guide frontend developer ke liye hai, taaki wo backend ke current flow ko easily samajh kar UI bana sake.

Backend base URL example:

```txt
http://localhost:8080/api
```

Frontend app ko cookies ke saath requests bhejni hongi:

```js
fetch(url, {
  credentials: "include"
});
```

Axios use kar rahe ho to:

```js
axios.defaults.withCredentials = true;
```

## App Ka Main Idea

Conch ek smart incident response platform hai.

Flow:

```txt
Manager signup/login
  -> Manager employees create karta hai
  -> Manager projects create karta hai
  -> Har project ki apiKey hoti hai
  -> Client SDK us apiKey se errors backend ko bhejta hai
  -> Backend logs save karta hai
  -> AI root-cause report generate karta hai
  -> Team incidents create/update karti hai
  -> Project group chat me team discuss karti hai
  -> Public status API outage/status page ke liye data deti hai
```

## User Roles

Do roles hain:

```txt
MANAGER
EMPLOYEE
```

Manager:

```txt
signup/login kar sakta hai
employees create/update/delete kar sakta hai
projects create kar sakta hai
logs dekh sakta hai
incidents manage kar sakta hai
project group chat use kar sakta hai
```

Employee:

```txt
login kar sakta hai
apne manager ke projects dekh sakta hai
logs dekh sakta hai
incidents manage kar sakta hai
project group chat use kar sakta hai
```

Current access model:

```txt
Manager ke employees ko manager ke saare projects ka access hai.
Project-level employee permissions abhi nahi hain.
```

## Suggested Frontend Screens

### Auth Screens

```txt
/signup
/login
```

Use APIs:

```txt
POST /api/signup
POST /api/login
GET  /api/me
POST /api/logout
```

### Dashboard Home

Show:

```txt
current user
projects summary
recent logs
active incidents
```

Use APIs:

```txt
GET /api/me
GET /api/projects
```

### Employees Page

Manager-only screen.

Show:

```txt
employee list
create employee form
edit employee
delete employee
```

Use APIs:

```txt
POST   /api/employees
GET    /api/employees
PATCH  /api/employees/:employeeId
DELETE /api/employees/:employeeId
```

### Projects Page

Show all accessible projects.

Manager can create project.

Use APIs:

```txt
POST /api/projects
GET  /api/projects
GET  /api/projects/:projectId
```

Project card me show karo:

```txt
project name
apiKey
open logs button
open incidents button
open chat button
public status link/button
```

### Project Logs Page

Route example:

```txt
/projects/:projectId/logs
```

Use API:

```txt
GET /api/logs/project/:projectId
```

Show:

```txt
errorName
errorMessage
metadata.url
metadata.browser
metadata.os
status: PENDING / ANALYZED / FAILED
aiReport.severity
createdAt
```

When user opens one log:

```txt
GET /api/logs/:logId
```

Show AI report:

```txt
analysis
solution
rootCause
where
fixSteps
correctedCode
prevention
confidence
```

Important:

```txt
AI report immediately nahi aayegi.
Pehle status PENDING ho sakta hai.
Frontend polling kar sakta hai ya refresh button de sakta hai.
```

### Incidents Page

Route example:

```txt
/projects/:projectId/incidents
```

Use APIs:

```txt
POST  /api/incidents
GET   /api/incidents/project/:projectId
GET   /api/incidents/:incidentId
PATCH /api/incidents/:incidentId
```

Incident fields:

```txt
title
description
severity: LOW / MEDIUM / HIGH / CRITICAL
status: OPEN / INVESTIGATING / IDENTIFIED / MONITORING / RESOLVED
publicStatus: OPERATIONAL / DEGRADED / PARTIAL_OUTAGE / MAJOR_OUTAGE
responders
updates
timeline
postmortem
```

Create incident body example:

```js
{
  projectId: "...",
  sourceLog: "...",
  title: "Checkout is failing",
  description: "Users cannot complete payment.",
  severity: "HIGH",
  status: "INVESTIGATING",
  publicStatus: "PARTIAL_OUTAGE",
  responders: ["employeeId"]
}
```

### Incident Detail Page

Use:

```txt
GET /api/incidents/:incidentId
```

Show sections:

```txt
incident overview
assigned responders
live updates
timeline
linked source log
postmortem
```

Actions:

```txt
PATCH /api/incidents/:incidentId
POST  /api/incidents/:incidentId/responders
POST  /api/incidents/:incidentId/updates
POST  /api/incidents/:incidentId/postmortem
```

Add update body:

```js
{
  message: "We identified payment gateway timeout.",
  isPublic: true
}
```

Generate AI postmortem:

```txt
POST /api/incidents/:incidentId/postmortem
```

Postmortem me show:

```txt
summary
impact
rootCause
resolution
prevention
generatedBy
generatedAt
```

### Public Status Page

Public route example:

```txt
/status/:projectId
```

Use API:

```txt
GET /api/status/public/projects/:projectId
```

No login needed.

Show:

```txt
project name
currentStatus
active public incidents
public updates only
```

Possible status:

```txt
OPERATIONAL
DEGRADED
PARTIAL_OUTAGE
MAJOR_OUTAGE
```

## Project Group Chat

Har project ki alag group chat hai.

REST APIs:

```txt
GET  /api/chat/projects/:projectId/messages
POST /api/chat/projects/:projectId/messages
```

Message body:

```js
{
  message: "I am checking the logs."
}
```

GET query params:

```txt
limit=50
before=2026-05-01T12:00:00.000Z
```

### Socket.io Setup

Install frontend dependency:

```bash
npm install socket.io-client
```

Connect:

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
  auth: {
    token: "JWT_TOKEN"
  },
  withCredentials: true
});
```

If token cookie already set hai, cookie ke through bhi auth ho sakta hai.

Join project chat:

```js
socket.emit("project_chat:join", { projectId }, (res) => {
  console.log(res);
});
```

Send message:

```js
socket.emit(
  "project_chat:message",
  {
    projectId,
    message: "Any update on this incident?"
  },
  (res) => {
    console.log(res);
  }
);
```

Listen for new messages:

```js
socket.on("project_chat:new_message", (payload) => {
  console.log(payload.projectId);
  console.log(payload.message);
});
```

Leave room:

```js
socket.emit("project_chat:leave", { projectId });
```

Frontend chat UI:

```txt
on page load:
  GET old messages
  socket join project room

on send:
  socket emit project_chat:message

on receive:
  append message to chat window

on page unmount:
  socket leave project room
```

## Client SDK Usage

SDK folder:

```txt
clientSdk
```

Frontend/user app me use:

```js
import { initConch, captureException } from "@conch/client-sdk";

initConch({
  apiKey: "conch_xxxxx",
  endpoint: "http://localhost:8080/api/ingest/event",
  appName: "my-app",
  environment: "production"
});

try {
  throw new Error("Cannot read properties of undefined");
} catch (error) {
  captureException(error, {
    codeSnippet: "user.name.toUpperCase()"
  });
}
```

SDK automatically capture kar sakta hai:

```txt
window.error
window.unhandledrejection
process.uncaughtException
process.unhandledRejection
```

## Important Frontend Rules

Always send credentials for dashboard APIs:

```js
credentials: "include"
```

For ingestion API:

```txt
Cookie auth nahi chahiye.
X-API-KEY use hoti hai.
```

For Socket.io:

```txt
JWT token auth ya cookie auth required hai.
Project join/send se pehle backend project access check karta hai.
```

For AI:

```txt
AI async hai.
Logs pe aiReport instantly nahi aa sakti.
Incident postmortem generate endpoint call karne par AI response save hota hai.
```

For employees:

```txt
Employee ko manager ke saare projects ka access hai.
Abhi project-specific employee permission nahi hai.
```

## Quick API Map

Auth:

```txt
POST /api/signup
POST /api/login
GET  /api/me
POST /api/logout
```

Employees:

```txt
POST   /api/employees
GET    /api/employees
PATCH  /api/employees/:employeeId
DELETE /api/employees/:employeeId
```

Projects:

```txt
POST /api/projects
GET  /api/projects
GET  /api/projects/:projectId
```

Logs:

```txt
GET /api/logs/project/:projectId
GET /api/logs/:logId
```

Incidents:

```txt
POST  /api/incidents
GET   /api/incidents/project/:projectId
GET   /api/incidents/:incidentId
PATCH /api/incidents/:incidentId
POST  /api/incidents/:incidentId/responders
POST  /api/incidents/:incidentId/updates
POST  /api/incidents/:incidentId/postmortem
```

Project Chat:

```txt
GET  /api/chat/projects/:projectId/messages
POST /api/chat/projects/:projectId/messages
```

Public:

```txt
GET /api/status/public/projects/:projectId
```

Ingestion:

```txt
POST /api/ingest/event
```

## Suggested Build Order For Frontend

1. Auth pages.
2. Project list/create project.
3. Employee management.
4. Logs list and log detail with AI report.
5. Incidents list/detail.
6. Project group chat.
7. Public status page.
8. SDK demo/test integration.
