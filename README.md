# ADHD Meal Planner

An ADHD-aware Telegram meal planner for an invited adult pilot in Sweden. The MVP
targets ICA Kvantum BEA, fresh varied meals, calculated maintenance nutrition and
a grocery cart aiming at 80% of a strict weekly maximum.

**Current state:** CAR-151 repository foundation only. A real Supabase health
function and configuration validator work; the Telegram bot, ICA collection,
nutrition planning, scheduling and model integrations are later tasks. There is
no runtime mock mode and no fabricated live data.

## Architecture and references

- TypeScript in Supabase Edge Functions (Deno); PostgreSQL stores durable state.
- Supabase Cron dispatches due work; Queues provide persistent planning/delivery tasks.
- The planned `@google/genai` adapter calls a pinned stable Gemini Flash model with
  verified free quota. The application validates nutrition and budget independently.
- [Canonical specification](docs/mvp-spec.md), [task requirements](docs/implementation-tasks.md),
  [original full plan](MVP_PLAN.md), [Linear parent CAR-150](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner).

```text
supabase/functions/health/       Public liveness handler + runtime entry point
supabase/functions/_shared/      Operation-specific configuration validation
supabase/migrations/             Future schema migrations
scripts/                        Config check and localhost-only smoke probe
tests/                          Deterministic code tests
evals/                          Future explicit live model evals (CAR-168/169)
docs/                           Product spec and implementation requirements
```

## Prerequisites and checks

Install Node.js 22 or newer, npm, and Docker Desktop (or a compatible local Docker
daemon). The lockfile installs project-local **Deno 2.9.6** and **Supabase CLI 3.0.0**;
no global CLI installation is needed. Check versions on upgrade against Supabase's
supported Edge Runtime. Install downloads require network access once.

```sh
npm ci
npm run check
npm run config:check -- health
```

`check` runs formatting, lint, TypeScript checking and deterministic tests. It
requires neither external credentials, Docker nor integration network access.
Tests use fixtures/mock boundaries only where necessary. Deno tests have no
network, environment or filesystem permissions by default.

Other commands: `npm run format`, `npm run lint`, `npm run typecheck`, `npm test`.
GitHub Actions runs the same gate on PRs and pushes to `main`, without secrets.

## Run real local Supabase

Start Docker, then in one terminal:

```sh
npm run local:start
npm run local:serve
```

The initial start downloads Supabase images and creates local database volumes.
`local:serve` remains running with hot reload. In another terminal:

```sh
npm run smoke:local
curl --fail http://127.0.0.1:54321/functions/v1/health
```

Expected JSON: `{"status":"ok","service":"adhd-meal-planner"}`. This endpoint is
public and reports liveness only, not database/Telegram/Gemini readiness. Its
`verify_jwt=false` setting applies only to health; future ingress validates the
Telegram secret separately. No integration credentials are needed for this probe.

Local Studio is available at `http://127.0.0.1:54323`. Inspect local credentials
with `npm run supabase -- status` and keep its output private. Stop function serve
with Ctrl+C and stop containers with `npm run local:stop`. Local volumes persist;
do not use destructive database-reset flags to work around unrelated failures.

If ports 54321–54324 are occupied by another project, stop only the conflicting
stack you own or update this project's port configuration and fixed smoke target.
If startup fails, inspect Docker and container health rather than ignoring checks.

## Environment configuration

```sh
cp .env.example .env
npm run config:check -- planning
```

Fill the private `.env` for the operation being used. The example deliberately
leaves secrets/model/hosted identifiers empty. `config:check` loads `.env`, validates
only the selected operation, makes no external requests and reports names/fixed
reasons without echoing values. Passing the check is not authentication, quota
verification or proof of integration readiness.

| Variable                    | Scope / consumer                           | Source / handling                                                             |
| --------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------- |
| `SUPABASE_URL`              | Webhook, planning, scheduler               | Non-secret local status URL or hosted API settings; injected into functions   |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only database access                | Secret from local status / hosted API settings; never give to clients         |
| `TELEGRAM_BOT_TOKEN`        | Webhook, scheduler, registration           | Secret from Telegram `@BotFather`                                             |
| `TELEGRAM_WEBHOOK_SECRET`   | Webhook / registration                     | Independently generated secret for Telegram webhook authentication            |
| `TELEGRAM_WEBHOOK_URL`      | Registration tooling                       | Non-secret public HTTPS function URL; not needed for local health             |
| `GEMINI_API_KEY`            | Planning / explicit live evals             | Secret from Google AI Studio, using a free-quota project                      |
| `GEMINI_MODEL`              | Planning / explicit live evals             | Explicit stable Flash model ID; confirm project availability/free quota first |
| `INTERNAL_JOB_SECRET`       | Scheduler / consumers                      | Separate generated secret, also stored in Vault for scheduled invocations     |
| `DEFAULT_TIMEZONE`          | Future onboarding default                  | Non-secret `Europe/Stockholm`; saved user choice takes precedence             |
| `LOG_LEVEL`                 | Future runtime logging                     | Non-secret `info`; never log secret values or personal payloads               |
| `SUPABASE_PROJECT_REF`      | Hosted deployment tooling only             | Non-secret dashboard project reference                                        |
| `SUPABASE_ACCESS_TOKEN`     | Hosted CLI authentication only             | Secret from Supabase account access-token settings                            |
| `SUPABASE_DB_PASSWORD`      | Hosted DB operations if required           | Secret project database password                                              |
| `DATABASE_URL`              | Direct SQL / export / restore tooling only | Secret connection string from project Connect settings                        |
| `EVAL_MAX_MODEL_CALLS`      | Future explicit live eval runner           | Non-secret suggested bound 20; enforced by CAR-168                            |
| `EVAL_CONCURRENCY`          | Future explicit live eval runner           | Non-secret suggested bound 1; enforced by CAR-168                             |

Available validator operations: `health`, `webhook`, `webhook-registration`,
`planning`, `scheduler`, `eval`, `deploy`, `backup`. Optional deployment/database
fields are not required to run tests or local health. Validate a pinned model ID
without `latest`/preview aliases; free quota must still be checked manually in AI Studio.
No ICA API key is invented before its actual access method is established in CAR-156.

### Loading function secrets safely

The root `.env` is for the config CLI/tooling; it is not automatically a hosted
function secret store. The Supabase local CLI normally reads
`supabase/functions/.env`; an explicit `--env-file` selects another file. For
future real functions, create an ignored `.env.functions` containing **only custom
function secrets** needed by those functions, then:

```sh
npm run supabase -- functions serve --env-file .env.functions
```

Do not copy `SUPABASE_*` values into custom secret commands. Supabase reserves
that prefix and injects platform values such as `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` itself. Local status values are not hosted credentials.

Real `.env` files at any depth, logs, generated eval results and backups are
ignored; `.env.example` is tracked. Do not place actual credentials in shell
arguments, issue descriptions or public CI logs.

### Hosted setup (later deployment task; not run by checks)

Use an existing authorised free EU-region project. After privately supplying the
tooling credentials and reviewing the target, the operator can link and apply
custom function secrets:

```sh
npm run supabase -- link --project-ref YOUR_PROJECT_REF
npm run supabase -- secrets set --env-file .env.functions --project-ref YOUR_PROJECT_REF
```

The file must contain no reserved `SUPABASE_*` names. Do not deploy, apply hosted
migrations or register the Telegram webhook automatically from install/tests.
Operational deployment/queues/cron are CAR-171; Telegram registration is CAR-152.

When scheduler authentication is implemented, store its function URL and
`INTERNAL_JOB_SECRET` in Supabase Vault via the authenticated dashboard or a
private operator session. Use placeholders in committed SQL, for example:

```sql
-- Operator template only; never commit the populated statements.
select vault.create_secret('<PRIVATE_INTERNAL_SECRET>', 'internal_job_secret');
select vault.create_secret('<CONSUMER_FUNCTION_URL>', 'consumer_function_url');
```

Cron should read those values from Vault and invoke the consumer with the
expected authentication header. Never grant client access to decrypted Vault
secrets. The function must validate the secret before processing jobs. Task #0
does not create Vault records or schedules.

## Free-tier limits and next work

No paid fallback or model alias is enabled. Free quotas change: recheck
[Supabase limits](https://supabase.com/docs/guides/functions/limits) and
[Gemini quota/pricing](https://ai.google.dev/gemini-api/docs/pricing) before launch.
The approved design budgets for 2 seconds active CPU per function request and a
150-second free worker lifetime; long work uses persisted stages, not detached
promises. Free projects may pause after inactivity and automatic database backups
are not included. CAR-170 covers retention, private exports and restore drills.
Reminders cannot promise uninterrupted service while a free project is paused.

CAR-152 implements Telegram ingress; CAR-156 establishes actual BEA data access.
Missing retailer facts remain explicit; price estimates do not guarantee checkout
prices or stock. Live evals in CAR-168/169 remain opt-in, quota-bounded and use
synthetic profiles; ordinary CI never calls the model.

## Contributing

Read [AGENTS.md](AGENTS.md) and the live Linear issue. One task per branch/PR,
behaviour-first TDD, scoped validation and descriptive commits. External approval
of the current head and green required checks are mandatory before merge.

Technical references: [local Supabase](https://supabase.com/docs/guides/local-development),
[function environment](https://supabase.com/docs/guides/functions/secrets),
[Deno](https://docs.deno.com/runtime/),
[official Gemini SDK](https://ai.google.dev/gemini-api/docs/libraries).
