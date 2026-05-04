const SDK_NAME = "conch";
const SDK_VERSION = "0.1.0";
const DEFAULT_ENDPOINT = "/api/ingest/event";

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
  statusEndpoint: "",
  projectId: "",
  statusMessage: "Service is temporarily unavailable. Our developers are working on it.",
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
    errorMessage: isError
      ? errorOrMessage.message || "Unknown error"
      : String(errorOrMessage || "Unknown error"),
    name: isError ? errorOrMessage.name : "Error",
    errorName: isError ? errorOrMessage.name : "Error",
    level: context.level || "error",
    stack: isError ? errorOrMessage.stack : undefined,
    stackTrace: isError ? errorOrMessage.stack : undefined,
    codeSnippet: context.codeSnippet || context.code || "",
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
    metadata: {
      browser: context.browser || "",
      os: context.os || "",
      url: typeof window !== "undefined" ? window.location.href : context.url || "",
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : context.userAgent || "",
      ...(isObject(context.metadata) ? context.metadata : {}),
    },
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
      ...(state.projectKey ? { "X-API-KEY": state.projectKey } : {}),
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
  state.projectId = options.projectId || "";
  state.statusEndpoint = options.statusEndpoint || "";
  state.statusMessage = options.statusMessage || state.statusMessage;
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

export class ConchStatusBanner {
  constructor(options = {}) {
    this.projectId = options.projectId || state.projectId;
    this.endpoint =
      options.endpoint ||
      state.statusEndpoint ||
      (this.projectId ? `/api/status/public/projects/${this.projectId}` : "");
    this.target = options.target || null;
    this.message = options.message || state.statusMessage;
    this.refreshMs = options.refreshMs || 60000;
    this.timer = null;
  }

  async getStatus() {
    if (!this.endpoint || typeof fetch !== "function") {
      return { currentStatus: "UNKNOWN", message: this.message, incidents: [] };
    }

    const response = await fetch(this.endpoint);
    const data = await response.json();
    const status = data.status || data;

    return {
      ...status,
      message: this.getMessage(status.currentStatus),
    };
  }

  getMessage(status) {
    if (status === "MAJOR_OUTAGE" || status === "PARTIAL_OUTAGE") {
      return this.message;
    }

    if (status === "DEGRADED") {
      return "Some features are slower than expected. Our developers are working on it.";
    }

    return "All systems operational.";
  }

  render(statusPayload) {
    if (typeof document === "undefined") return;

    const target =
      typeof this.target === "string"
        ? document.querySelector(this.target)
        : this.target || document.body;

    if (!target) return;

    let banner = target.querySelector("[data-conch-status-banner]");
    if (!banner) {
      banner = document.createElement("div");
      banner.setAttribute("data-conch-status-banner", "true");
      banner.style.cssText =
        "position:fixed;inset:auto 16px 16px;z-index:2147483647;padding:14px 18px;border-radius:10px;background:#fff3d8;color:#3b2a03;border:1px solid #f3c86a;box-shadow:0 16px 40px rgba(40,32,12,.16);font:600 14px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;";
      target.appendChild(banner);
    }

    banner.textContent = statusPayload.message;
    banner.style.display =
      statusPayload.currentStatus && statusPayload.currentStatus !== "OPERATIONAL"
        ? "block"
        : "none";
  }

  async refresh() {
    const status = await this.getStatus();
    this.render(status);
    return status;
  }

  start() {
    this.stop();
    this.refresh();
    this.timer = setInterval(() => this.refresh(), this.refreshMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
