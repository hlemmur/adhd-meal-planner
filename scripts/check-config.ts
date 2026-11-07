import { requiredVariables, validateConfiguration } from "../supabase/functions/_shared/config.ts";
import type { Operation } from "../supabase/functions/_shared/config.ts";

const operation = Deno.args[0];
if (!operation || !Object.hasOwn(requiredVariables, operation) || Deno.args.length !== 1) {
  console.error(`Usage: npm run config:check -- ${Object.keys(requiredVariables).join("|")}`);
  Deno.exit(2);
}
const issues = validateConfiguration(operation as Operation, Deno.env.toObject());
if (issues.length > 0) {
  console.error(issues.join("\n"));
  Deno.exit(1);
}
console.log(`Configuration valid for ${operation}; no external requests made.`);
