const pingResponse = () =>
  Response.json(
    {
      success: true,
      message: "pong",
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );

export function GET() {
  return pingResponse();
}

export function POST() {
  return pingResponse();
}
