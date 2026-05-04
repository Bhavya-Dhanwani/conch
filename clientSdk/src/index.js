const DEFAULT_ENDPOINT = "/api/ingest/event";
const SDK_NAME = "@mrdhanwani/conch";
const SDK_VERSION = "0.1.0";
const MAX_TEXT_LENGTH = 12000;

const state = {
  initialized: false,
  apiKey: "",
  endpoint: DEFAULT_ENDPOINT,
  appName: "",
  environment: "",
  release: "",
  defaultMetadata: {},
  headers: {},
  beforeSend: null,
  onError: null,
  captureGlobalErrors: true,
  captureUnhandledRejections: true,
};

const isObject = (value) => {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
};

const truncate = (value, maxLength = MAX_TEXT_LENGTH) => {
  if (value === undefined || value === null) return "";
  return String(value).slice(0, maxLength);
};

const getBrowserName = (userAgent = "") => {
  if (/edg/i.test(userAgent)) return "Edge";
  if (/chrome|chromium|crios/i.test(userAgent)) return "Chrome";
  if (/firefox|fxios/i.test(userAgent)) return "Firefox";
  if (/safari/i.test(userAgent) && !/chrome|chromium|crios/i.test(userAgent)) {
    return "Safari";
  }
  return "";
};

const getOSName = (userAgent = "") => {
  if (/windows/i.test(userAgent)) return "Windows";
  if (/android/i.test(userAgent)) return "Android";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
  if (/mac os|macintosh/i.test(userAgent)) return "macOS";
  if (/linux/i.test(userAgent)) return "Linux";
  return "";
};

const getRuntimeMetadata = () => {
  const metadata = {
    appName: state.appName,
    environment: state.environment,
    release: state.release,
    sdkName: SDK_NAME,
    sdkVersion: SDK_VERSION,
    ...state.defaultMetadata,
  };

  if (typeof window !== "undefined") {
    metadata.url = window.location?.href || "";
  }

  if (typeof navigator !== "undefined") {
    const userAgent = navigator.userAgent || "";
    metadata.userAgent = userAgent;
    metadata.browser = metadata.browser || getBrowserName(userAgent);
    metadata.os = metadata.os || getOSName(userAgent);
  }

  if (typeof process !== "undefined" && process.versions?.node) {
    metadata.os = metadata.os || process.platform || "";
    metadata.browser = metadata.browser || "node";
    metadata.userAgent = metadata.userAgent || `node/${process.versions.node}`;
  }

  return metadata;
};

const normalizeError = (errorOrMessage, context = {}) => {
  const isError = errorOrMessage instanceof Error;
  const fallbackMessage =
    typeof errorOrMessage === "string" ? errorOrMessage : "Unknown error";

  return {
    errorName: truncate(
      context.errorName || context.name || (isError ? errorOrMessage.name : "Error"),
      500,
    ),
    errorMessage: truncate(
      context.errorMessage ||
        context.message ||
        (isError ? errorOrMessage.message : fallbackMessage),
      4000,
    ),
    stackTrace: truncate(
      context.stackTrace || context.stack || (isError ? errorOrMessage.stack : ""),
    ),
    codeSnippet: truncate(
      context.codeSnippet || context.code || context.sourceCode || "",
    ),
    metadata: {
      ...getRuntimeMetadata(),
      ...(isObject(context.metadata) ? context.metadata : {}),
    },
  };
};

const reportTransportError = (error) => {
  if (typeof state.onError === "function") {
    state.onError(error);
  }
};

const sendPayload = async (payload) => {
  if (!state.apiKey) {
    throw new Error("Conch SDK apiKey is required. Call initConch({ apiKey }).");
  }

  if (typeof fetch !== "function") {
    throw new Error("Conch SDK requires fetch to send captured errors.");
  }

  let finalPayload = payload;
  if (typeof state.beforeSend === "function") {
    finalPayload = state.beforeSend(payload);
    if (!finalPayload) return null;
  }

  const response = await fetch(state.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": state.apiKey,
      ...state.headers,
    },
    body: JSON.stringify(finalPayload),
    keepalive: true,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Conch ingest request failed");
  }

  return data;
};

const captureUnhandledRejection = (event) => {
  const reason = event.reason;

  if (reason instanceof Error) {
    captureException(reason, {
      metadata: { source: "window.unhandledrejection" },
    });
    return;
  }

  captureMessage("Unhandled promise rejection", {
    metadata: {
      source: "window.unhandledrejection",
      reason:
        typeof reason === "string" ? reason : JSON.stringify(reason || null),
    },
  });
};

const captureWindowError = (event) => {
  const error =
    event.error instanceof Error ? event.error : new Error(event.message);

  captureException(error, {
    metadata: {
      source: "window.error",
      filename: event.filename || "",
      lineno: event.lineno || "",
      colno: event.colno || "",
    },
  });
};

const setupBrowserGlobalHandlers = () => {
  if (typeof window === "undefined") return;

  if (state.captureGlobalErrors) {
    window.addEventListener("error", captureWindowError);
  }

  if (state.captureUnhandledRejections) {
    window.addEventListener("unhandledrejection", captureUnhandledRejection);
  }
};

const setupNodeGlobalHandlers = () => {
  if (typeof process === "undefined" || typeof process.on !== "function") {
    return;
  }

  if (state.captureGlobalErrors) {
    process.on("uncaughtException", (error) => {
      captureException(error, {
        metadata: { source: "process.uncaughtException" },
      });
    });
  }

  if (state.captureUnhandledRejections) {
    process.on("unhandledRejection", (reason) => {
      if (reason instanceof Error) {
        captureException(reason, {
          metadata: { source: "process.unhandledRejection" },
        });
        return;
      }

      captureMessage("Unhandled promise rejection", {
        metadata: {
          source: "process.unhandledRejection",
          reason:
            typeof reason === "string" ? reason : JSON.stringify(reason || null),
        },
      });
    });
  }
};

export const initConch = (options = {}) => {
  state.apiKey = options.apiKey || options.key || "";
  state.endpoint = options.endpoint || DEFAULT_ENDPOINT;
  state.appName = options.appName || "";
  state.environment = options.environment || "";
  state.release = options.release || "";
  state.defaultMetadata = isObject(options.metadata) ? options.metadata : {};
  state.headers = isObject(options.headers) ? options.headers : {};
  state.beforeSend =
    typeof options.beforeSend === "function" ? options.beforeSend : null;
  state.onError = typeof options.onError === "function" ? options.onError : null;
  state.captureGlobalErrors = options.captureGlobalErrors !== false;
  state.captureUnhandledRejections =
    options.captureUnhandledRejections !== false;

  if (!state.initialized) {
    setupBrowserGlobalHandlers();
    setupNodeGlobalHandlers();
    state.initialized = true;
  }
};

export const captureException = async (error, context = {}) => {
  try {
    return await sendPayload(normalizeError(error, context));
  } catch (transportError) {
    reportTransportError(transportError);
    return null;
  }
};

export const captureMessage = async (message, context = {}) => {
  try {
    return await sendPayload(normalizeError(String(message), context));
  } catch (transportError) {
    reportTransportError(transportError);
    return null;
  }
};

export const captureEvent = async (event = {}) => {
  try {
    const payload = {
      errorName: truncate(event.errorName || event.name || "Error", 500),
      errorMessage: truncate(
        event.errorMessage || event.message || "Unknown error",
        4000,
      ),
      stackTrace: truncate(event.stackTrace || event.stack || ""),
      codeSnippet: truncate(event.codeSnippet || event.code || event.sourceCode || ""),
      metadata: {
        ...getRuntimeMetadata(),
        ...(isObject(event.metadata) ? event.metadata : {}),
      },
    };

    return await sendPayload(payload);
  } catch (transportError) {
    reportTransportError(transportError);
    return null;
  }
};

export const getConchConfig = () => ({
  initialized: state.initialized,
  endpoint: state.endpoint,
  appName: state.appName,
  environment: state.environment,
  release: state.release,
  hasApiKey: Boolean(state.apiKey),
});
