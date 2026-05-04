# Conch Client SDK

JavaScript SDK for sending runtime errors to the Conch backend.

## Install

```bash
npm install @mrdhanwani/conch
```

## Basic Usage

```js
import { initConch, captureException } from "@mrdhanwani/conch";

initConch({
  apiKey: "conch_xxxxx",
  endpoint: "https://your-api.com/api/ingest/event",
  appName: "dashboard",
  environment: "production",
  release: "1.0.0",
});

try {
  throw new Error("Cannot read properties of undefined");
} catch (error) {
  captureException(error, {
    codeSnippet: "user.name.toUpperCase()",
  });
}
```

## Automatic Capture

By default the SDK listens for:

```txt
window.error
window.unhandledrejection
process.uncaughtException
process.unhandledRejection
```

Disable automatic capture:

```js
initConch({
  apiKey: "conch_xxxxx",
  captureGlobalErrors: false,
  captureUnhandledRejections: false,
});
```

## API

### initConch(options)

```js
initConch({
  apiKey: "conch_xxxxx",
  endpoint: "/api/ingest/event",
  appName: "my-app",
  environment: "production",
  release: "1.0.0",
  metadata: {
    team: "frontend",
  },
  beforeSend(payload) {
    return payload;
  },
  onError(error) {
    console.error(error);
  },
});
```

### captureException(error, context)

```js
captureException(error, {
  codeSnippet: "user.name.toUpperCase()",
  metadata: {
    route: "/dashboard",
  },
});
```

### captureMessage(message, context)

```js
captureMessage("Payment failed", {
  metadata: {
    gateway: "stripe",
  },
});
```

### captureEvent(event)

```js
captureEvent({
  errorName: "TypeError",
  errorMessage: "Cannot read properties of undefined",
  stackTrace: "TypeError: ...",
  codeSnippet: "user.name.toUpperCase()",
  metadata: {
    browser: "Chrome",
    os: "Windows",
    url: "https://example.com/dashboard",
  },
});
```

## Backend Contract

The SDK sends:

```http
POST /api/ingest/event
X-API-KEY: conch_xxxxx
Content-Type: application/json
```

Payload:

```json
{
  "errorName": "TypeError",
  "errorMessage": "Cannot read properties of undefined",
  "stackTrace": "TypeError: ...",
  "codeSnippet": "user.name.toUpperCase()",
  "metadata": {
    "browser": "Chrome",
    "os": "Windows",
    "url": "https://example.com/dashboard",
    "userAgent": "Mozilla/5.0 ..."
  }
}
```
