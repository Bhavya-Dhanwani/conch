import ErrorEvent from "@/models/error-event.model";
import ExpressError from "@/utils/ExpressError.util";
import { NextResponse } from "next/server";

function getClientIp(req) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.headers.get("x-real-ip") || "";
}

export async function handleIngestError(req) {
  const payload = await req.json();

  if (!payload || typeof payload !== "object") {
    throw new ExpressError(400, "Invalid error payload");
  }

  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  if (!message) {
    throw new ExpressError(400, "Error message is required");
  }

  const event = new ErrorEvent({
    message,
    name: typeof payload.name === "string" ? payload.name : undefined,
    level: typeof payload.level === "string" ? payload.level : "error",
    stack: typeof payload.stack === "string" ? payload.stack : undefined,
    source: typeof payload.source === "string" ? payload.source : undefined,
    environment:
      typeof payload.environment === "string" ? payload.environment : undefined,
    release: typeof payload.release === "string" ? payload.release : undefined,
    appName: typeof payload.appName === "string" ? payload.appName : undefined,
    projectKey:
      typeof payload.projectKey === "string" ? payload.projectKey : undefined,
    sdk:
      payload.sdk && typeof payload.sdk === "object"
        ? {
            name: typeof payload.sdk.name === "string" ? payload.sdk.name : undefined,
            version:
              typeof payload.sdk.version === "string"
                ? payload.sdk.version
                : undefined,
          }
        : undefined,
    tags:
      payload.tags && typeof payload.tags === "object" && !Array.isArray(payload.tags)
        ? payload.tags
        : {},
    extra:
      payload.extra && typeof payload.extra === "object" ? payload.extra : {},
    url: typeof payload.url === "string" ? payload.url : undefined,
    userAgent:
      typeof payload.userAgent === "string" ? payload.userAgent : undefined,
    occurredAt: payload.occurredAt ? new Date(payload.occurredAt) : undefined,
    ipAddress: getClientIp(req),
    rawPayload: payload,
  });

  await event.save();

  return NextResponse.json(
    {
      success: true,
      message: "Error event received",
      data: { id: event._id.toString() },
    },
    { status: 201 }
  );
}
