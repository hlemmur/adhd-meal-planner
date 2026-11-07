import { validateConfiguration } from "../supabase/functions/_shared/config.ts";

Deno.test("health configuration needs no external service credentials", () => {
  const issues = validateConfiguration("health", {});
  if (issues.length !== 0) throw new Error(JSON.stringify(issues));
});

Deno.test("planning reports only missing variable names and ignores unrelated deployment settings", () => {
  const issues = validateConfiguration("planning", {
    SUPABASE_URL: "http://127.0.0.1:54321",
    SUPABASE_SERVICE_ROLE_KEY: "test-only-role-secret",
    GEMINI_API_KEY: "test-only-model-secret",
    GEMINI_MODEL: "gemini-2.5-flash",
    SUPABASE_DB_PASSWORD: "unused-test-only-password",
  });
  if (issues.length !== 0) throw new Error(JSON.stringify(issues));
  const missing = validateConfiguration("planning", {});
  if (missing.length !== 4 || missing.some((issue) => !issue.endsWith(": required"))) {
    throw new Error("Expected exactly the four required planning variable names");
  }
});

Deno.test("webhook registration refuses a non-HTTPS public URL without echoing it", () => {
  const issues = validateConfiguration("webhook-registration", {
    TELEGRAM_BOT_TOKEN: "test-only-bot",
    TELEGRAM_WEBHOOK_SECRET: "test-only-webhook-secret",
    TELEGRAM_WEBHOOK_URL: "http://example.invalid/private-path",
  });
  if (!issues.some((issue) => issue.startsWith("TELEGRAM_WEBHOOK_URL:"))) {
    throw new Error("Telegram registration requires a public HTTPS endpoint");
  }
  if (issues.some((issue) => issue.includes("private-path"))) {
    throw new Error("Configuration errors must not echo values");
  }
});

Deno.test("scheduler refuses shared webhook and internal secrets", () => {
  const issues = validateConfiguration("scheduler", {
    SUPABASE_URL: "http://127.0.0.1:54321",
    SUPABASE_SERVICE_ROLE_KEY: "test-only-role",
    TELEGRAM_BOT_TOKEN: "test-only-bot",
    TELEGRAM_WEBHOOK_SECRET: "test-only-shared",
    INTERNAL_JOB_SECRET: "test-only-shared",
  });
  if (!issues.some((issue) => issue.startsWith("INTERNAL_JOB_SECRET:"))) {
    throw new Error("The two authentication boundaries must have distinct secrets");
  }
});

Deno.test("planning rejects a floating model alias without revealing any values", () => {
  const issues = validateConfiguration("planning", {
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "test-only-database-secret",
    GEMINI_API_KEY: "test-only-model-secret",
    GEMINI_MODEL: "gemini-flash-latest",
  });
  if (!issues.some((issue) => issue.startsWith("GEMINI_MODEL:"))) {
    throw new Error("A floating alias must not pass pinned-model validation");
  }
  if (
    issues.some((issue) => issue.includes("test-only") || issue.includes("gemini-flash-latest"))
  ) {
    throw new Error("Validation must not echo values");
  }
});
