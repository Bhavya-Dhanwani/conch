export type ConchMetadata = Record<string, unknown>;

export type ConchInitOptions = {
  apiKey?: string;
  key?: string;
  endpoint?: string;
  appName?: string;
  environment?: string;
  release?: string;
  metadata?: ConchMetadata;
  headers?: Record<string, string>;
  beforeSend?: (payload: ConchPayload) => ConchPayload | null | undefined;
  onError?: (error: Error) => void;
  captureGlobalErrors?: boolean;
  captureUnhandledRejections?: boolean;
};

export type ConchPayload = {
  errorName?: string;
  name?: string;
  errorMessage?: string;
  message?: string;
  stackTrace?: string;
  stack?: string;
  codeSnippet?: string;
  code?: string;
  sourceCode?: string;
  metadata?: ConchMetadata;
};

export type ConchCaptureContext = {
  errorName?: string;
  name?: string;
  errorMessage?: string;
  message?: string;
  stackTrace?: string;
  stack?: string;
  codeSnippet?: string;
  code?: string;
  sourceCode?: string;
  metadata?: ConchMetadata;
};

export type ConchConfig = {
  initialized: boolean;
  endpoint: string;
  appName: string;
  environment: string;
  release: string;
  hasApiKey: boolean;
};

export function initConch(options?: ConchInitOptions): void;
export function captureException(
  error: Error,
  context?: ConchCaptureContext,
): Promise<unknown>;
export function captureMessage(
  message: string,
  context?: ConchCaptureContext,
): Promise<unknown>;
export function captureEvent(event?: ConchPayload): Promise<unknown>;
export function getConchConfig(): ConchConfig;
