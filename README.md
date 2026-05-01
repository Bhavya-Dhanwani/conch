# This is CONCH and we are building it.

## Conch SDK package

A publishable SDK package is available at `package/conch`.

### Basic usage

```js
import { initConch, captureException } from "conch";

initConch({
  endpoint: "https://your-conch-app.com/api/errors/ingest",
  appName: "my-app",
  environment: "production",
  release: "1.0.0",
  projectKey: "demo-project",
});

try {
  throw new Error("Something broke");
} catch (err) {
  captureException(err);
}
```

### Backend ingestion endpoint

The main app now accepts SDK events at:

`POST /api/errors/ingest`
