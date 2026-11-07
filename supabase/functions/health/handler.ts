/** Public liveness only: deliberately does not probe dependencies or expose configuration. */
export function createHealthResponse(_request: Request): Response {
  return Response.json(
    { status: "ok", service: "adhd-meal-planner" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
