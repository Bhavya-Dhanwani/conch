const SDK_NAME = "conch";
const SDK_VERSION = "0.1.0";
const DEFAULT_ENDPOINT = "/api/errors/ingest";

const state = {
  initialized: false,
  endpoint: DEFAULT_ENDPOINT,
  environment: "",
  release: "",
  appName: "",
  projectKey: "",
  defaultTags: {},
  defaultExtra: {},
  headers: {},
  beforeSend: null,
};

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeError(errorOrMessage, context = {}) {
  const isError = errorOrMessage instanceof Error;
  const nowIso = new Date().toISOString();

  const payload = {
    message: isError
      ? errorOrMessage.message || "Unknown error"
      : String(errorOrMessage || "Unknown error"),
    name: isError ? errorOrMessage.name : "Error",
    level: context.level || "error",
    stack: isError ? errorOrMessage.stack : undefined,
    source: context.source || "manual",
    environment: state.environment || undefined,
    release: state.release || undefined,
    appName: state.appName || undefined,
    projectKey: state.projectKey || undefined,
    tags: {
      ...state.defaultTags,
      ...(isObject(context.tags) ? context.tags : {}),
    },
    extra: {
      ...state.defaultExtra,
      ...(isObject(context.extra) ? context.extra : {}),
    },
    sdk: {
      name: SDK_NAME,
      version: SDK_VERSION,
    },
    occurredAt: nowIso,
    url: typeof window !== "undefined" ? window.location.href : undefined,
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  };

  return payload;
}

async function transport(payload) {
  if (typeof fetch !== "function") {
    return;
  }

  let data = payload;
  if (typeof state.beforeSend === "function") {
    data = state.beforeSend(payload);
    if (!data) {
      return;
    }
  }

  await fetch(state.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...state.headers,
    },
    body: JSON.stringify(data),
    keepalive: true,
  });
}

function setupBrowserGlobalHandlers() {
  if (typeof window === "undefined") {
    return;
  }

  window.addEventListener("error", (event) => {
    const error = event.error instanceof Error ? event.error : new Error(event.message);
    captureException(error, { source: "window.error" });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;

    if (reason instanceof Error) {
      captureException(reason, { source: "window.unhandledrejection" });
      return;
    }

    captureMessage("Unhandled promise rejection", {
      source: "window.unhandledrejection",
      extra: { reason },
      level: "error",
    });
  });
}

function setupNodeGlobalHandlers() {
  if (typeof process === "undefined" || !process.on) {
    return;
  }

  process.on("uncaughtException", (error) => {
    captureException(error, { source: "process.uncaughtException" });
  });

  process.on("unhandledRejection", (reason) => {
    if (reason instanceof Error) {
      captureException(reason, { source: "process.unhandledRejection" });
      return;
    }

    captureMessage("Unhandled promise rejection", {
      source: "process.unhandledRejection",
      extra: { reason },
      level: "error",
    });
  });
}

export function initConch(options = {}) {
  state.endpoint = options.endpoint || DEFAULT_ENDPOINT;
  state.environment = options.environment || "";
  state.release = options.release || "";
  state.appName = options.appName || "";
  state.projectKey = options.projectKey || "";
  state.defaultTags = isObject(options.defaultTags) ? options.defaultTags : {};
  state.defaultExtra = isObject(options.defaultExtra) ? options.defaultExtra : {};
  state.headers = isObject(options.headers) ? options.headers : {};
  state.beforeSend = typeof options.beforeSend === "function" ? options.beforeSend : null;

  if (options.captureGlobalErrors !== false && !state.initialized) {
    setupBrowserGlobalHandlers();
    setupNodeGlobalHandlers();
  }

  state.initialized = true;
}

export async function captureException(error, context = {}) {
  const payload = normalizeError(error, context);
  await transport(payload);
}

export async function captureMessage(message, context = {}) {
  const payload = normalizeError(message, context);
  await transport(payload);
}
