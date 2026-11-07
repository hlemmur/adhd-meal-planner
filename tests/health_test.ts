import { createHealthResponse } from "../supabase/functions/health/handler.ts";

Deno.test("health probe responds without integration credentials or personal data", async () => {
  const response = createHealthResponse(new Request("http://localhost/health"));
  if (response.status !== 200) throw new Error(`Unexpected status: ${response.status}`);
  const body = await response.json();
  if (JSON.stringify(body) !== JSON.stringify({ status: "ok", service: "adhd-meal-planner" })) {
    throw new Error("Health response must contain only the public service status");
  }
  if (response.headers.get("Cache-Control") !== "no-store") {
    throw new Error("Health status must not be cached");
  }
});
