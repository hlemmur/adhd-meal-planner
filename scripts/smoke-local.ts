/** Fixed localhost target: cannot accidentally probe or mutate a hosted project. */
const response = await fetch("http://127.0.0.1:54321/functions/v1/health", {
  signal: AbortSignal.timeout(10_000),
});
if (!response.ok) throw new Error(`Local health probe returned HTTP ${response.status}`);
const body = await response.json();
if (body.status !== "ok" || body.service !== "adhd-meal-planner") {
  throw new Error("Unexpected local health response");
}
console.log("Local Supabase health smoke passed.");
