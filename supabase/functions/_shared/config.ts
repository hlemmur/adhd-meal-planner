export type Environment = Readonly<Record<string, string | undefined>>;

/** Each command validates only what it consumes; offline health/tests have no secrets. */
export const requiredVariables = {
  health: [],
  webhook: [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "TELEGRAM_BOT_TOKEN",
    "TELEGRAM_WEBHOOK_SECRET",
  ],
  "webhook-registration": ["TELEGRAM_BOT_TOKEN", "TELEGRAM_WEBHOOK_SECRET", "TELEGRAM_WEBHOOK_URL"],
  planning: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "GEMINI_API_KEY", "GEMINI_MODEL"],
  scheduler: [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "TELEGRAM_BOT_TOKEN",
    "INTERNAL_JOB_SECRET",
  ],
  eval: ["GEMINI_API_KEY", "GEMINI_MODEL"],
  deploy: ["SUPABASE_PROJECT_REF", "SUPABASE_ACCESS_TOKEN"],
  backup: ["DATABASE_URL"],
} as const;

export type Operation = keyof typeof requiredVariables;

/** Returns variable names and fixed reasons only, never configuration values. */
export function validateConfiguration(operation: Operation, env: Environment): string[] {
  const issues = requiredVariables[operation].filter((name) => !env[name]?.trim()).map((name) =>
    `${name}: required`
  );
  if (operation === "webhook-registration" && env.TELEGRAM_WEBHOOK_URL?.trim()) {
    try {
      const url = new URL(env.TELEGRAM_WEBHOOK_URL);
      if (url.protocol !== "https:" || url.username || url.password) throw new Error();
    } catch {
      issues.push("TELEGRAM_WEBHOOK_URL: use an HTTPS URL without embedded credentials");
    }
  }
  if (operation === "planning" || operation === "eval") {
    const model = env.GEMINI_MODEL?.trim();
    if (model && (!/^gemini-\d+(?:\.\d+)*-flash(?:-\d+)?$/.test(model))) {
      issues.push("GEMINI_MODEL: use an explicit stable Flash model ID, not an alias or preview");
    }
  }
  if (
    operation === "scheduler" && env.INTERNAL_JOB_SECRET?.trim() &&
    env.INTERNAL_JOB_SECRET.trim() === env.TELEGRAM_WEBHOOK_SECRET?.trim()
  ) {
    issues.push("INTERNAL_JOB_SECRET: must differ from TELEGRAM_WEBHOOK_SECRET");
  }
  return issues;
}
