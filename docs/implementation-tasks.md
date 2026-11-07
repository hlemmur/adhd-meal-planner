# Implementation tasks

Snapshot of the approved Linear child requirements. Linear remains the live execution tracker; this snapshot preserves the acceptance criteria available when CAR-151 was implemented. The old ticketing-session statements refer to planning, not an ongoing prohibition on authorised implementation.

## CAR-151 — #0 — Create the public GitHub repository and executable project foundation

[Live issue](https://linear.app/radical-creation/issue/CAR-151/0-create-the-public-github-repository-and-executable-project)

Milestone: Repository and working Telegram onboarding

Blocked by: None

### What to build

Create public adhd-meal-planner under the authenticated personal GitHub account. Initialise the existing local git repository and establish TypeScript/Supabase structure; commit and push the foundation.

### Components owned

Repository configuration, README, CI, developer tooling and specification. Keep changes scoped; add only migrations/modules needed by this behaviour. Do not revert others' work.

### Acceptance criteria

- [ ] Public repository, main branch, initial commit and correct local remote exist; do not overwrite an existing conflicting repository.
- [ ] Include supabase/functions, supabase/migrations, tests, evals and docs. README covers architecture, setup, real credentials, commands, deployment and free-tier limitations.
- [ ] Copy parent and child requirements into docs/mvp-spec.md; project AGENTS.md records Tracking: Linear and delivery rules.
- [ ] .gitignore excludes credentials, local configuration, dumps, logs and generated outputs; .env.example contains placeholders only.
- [ ] Formatting, lint, typecheck and deterministic test commands pass in GitHub Actions without secrets.
- [ ] Verify and document Supabase local startup and a minimal function smoke check. No runtime mock mode.
- [ ] Bootstrap initial main commit is allowed; subsequent work uses reviewed PRs.

### Environment template requirements

Task #0 must commit a root `.env.example` with documented placeholders and safe non-secret defaults. No real keys, tokens, connection strings or user identifiers.

Required runtime configuration:

- `SUPABASE_URL`: local or hosted project API URL.
- `SUPABASE_SERVICE_ROLE_KEY`: privileged server-only credential; never expose to Telegram users or future browser clients.
- `TELEGRAM_BOT_TOKEN`: secret issued by BotFather.
- `TELEGRAM_WEBHOOK_SECRET`: separate random secret validated on incoming updates.
- `TELEGRAM_WEBHOOK_URL`: public HTTPS webhook endpoint for registration tooling.
- `GEMINI_API_KEY`: server-only Gemini Developer API key.
- `GEMINI_MODEL`: explicit pinned stable Flash model ID, selected after verifying free quota; no floating latest alias.
- `INTERNAL_JOB_SECRET`: separate secret for authenticated Cron/consumer invocation; never reuse the Telegram secret.
- `DEFAULT_TIMEZONE=Europe/Stockholm`: onboarding default only; persisted user timezone takes precedence.
- `LOG_LEVEL=info`: logs must redact personal payloads and secrets.

Tooling-only variables, clearly marked optional unless that operation is used:

- `SUPABASE_PROJECT_REF`, `SUPABASE_ACCESS_TOKEN`: hosted CLI deployment/linking; not required for offline tests.
- `SUPABASE_DB_PASSWORD`: only for hosted database operations requiring it.
- `DATABASE_URL`: only for direct SQL/export/restore tooling; not a client-side value.
- `EVAL_MAX_MODEL_CALLS`, `EVAL_CONCURRENCY`: documented bounded defaults for explicit live evals; no automatic live calls in ordinary CI.

Supabase-hosted functions may already receive platform-provided Supabase variables. README must distinguish those from local placeholders and custom function secrets, explain reserved-name restrictions, and show local loading, function-secret setup and Vault setup without committing values. Do not set reserved platform variables through custom-secret commands.

Acceptance:

- [ ] Every environment variable read by committed code/tooling appears in the example with purpose, requirement scope and secret/non-secret classification; remove speculative unused values as implementation settles.
- [ ] README explains obtaining each credential, which component consumes it, and how to run without external credentials for deterministic tests.
- [ ] Ignore real .env files (including local/function variants) while explicitly allowing .env.example to be tracked.
- [ ] Configuration validation reports missing required variable names without logging their values; validate only the operation being invoked.
- [ ] No MOCK_MODE variable or fabricated runtime fallback; no mandatory ICA API key until a real authorised integration requires one.
- [ ] Preserve existing root MVP_PLAN.md and its local commit when bootstrapping GitHub; do not reinitialise destructively or overwrite the approved reference.

### Verification

Verify a clean checkout can install, start local Supabase and run the documented CI commands. Inspect staged content for secrets before the initial commit.

### Dependencies and overlap

None; can start immediately.
Dependencies provide contracts/state or protect shared workflow/schema edits; milestone alone is not an execution gate.

### Definition of done

- [ ] Behaviour-first TDD where applicable; red → green → refactor. Appropriate unit/integration tests and scoped live checks pass.
- [ ] Use fixtures/mocked external boundaries only for code-level tests. No runtime mock mode or fabricated production fallback. Offline CI has no secrets; live checks/evals are explicit and quota-bounded.
- [ ] Relevant formatting, lint, typecheck and tests pass; inspect git status and staged diff for unrelated/sensitive data; descriptive scoped commits.
- [ ] One isolated codex/<ticket-id>-<short-description> branch and reviewable PR (task #0 bootstrap exception applies).
- [ ] Address valid feedback/conflicts, require independent external current-head approval plus green required checks and resolved blocking threads before agent merge; verify merge. No auto-merge/bypass/self-approval.

### Specification

Approved source: [CAR-150: MVP: ADHD-aware Telegram Meal Planner](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner). Canonical repo path after task #0: docs/mvp-spec.md. Tracking: Linear.

This ticket is planned work, not an instruction to start implementation during the ticketing session.

---

## CAR-152 — #1 — Authenticate Telegram webhooks and persist incoming work

[Live issue](https://linear.app/radical-creation/issue/CAR-152/1-authenticate-telegram-webhooks-and-persist-incoming-work)

Milestone: Repository and working Telegram onboarding

Blocked by: CAR-151

### What to build

Implement a real Telegram webhook Edge Function that authenticates updates and durably enqueues work before acknowledging.

### Components owned

Telegram ingress, incoming update/job persistence migrations. Keep changes scoped; add only migrations/modules needed by this behaviour. Do not revert others' work.

### Acceptance criteria

- [ ] Invalid secret is rejected without processing; Telegram update ID is unique so repeated delivery produces one job.
- [ ] Return success only after persistence; unsupported update types are safely ignored.
- [ ] Queue consumer sends a real /start response; never rely on work continuing after a successful HTTP acknowledgement without durable state.
- [ ] Tests cover malformed, duplicate, unauthorised and database-failure paths.

### Verification

Red: replay one Telegram update and assert a single response job. Integration-test ingress with local Supabase and mocked Telegram transport; explicitly smoke-test a real Telegram account.

### Dependencies and overlap

Task #0: <issue id="58ddb880-55a2-4bdc-a7b7-f45cfe55d282" label="CAR-151" href="https://linear.app/radical-creation/issue/CAR-151/0-create-the-public-github-repository-and-executable-project" />
Dependencies provide contracts/state or protect shared workflow/schema edits; milestone alone is not an execution gate.

### Definition of done

- [ ] Behaviour-first TDD where applicable; red → green → refactor. Appropriate unit/integration tests and scoped live checks pass.
- [ ] Use fixtures/mocked external boundaries only for code-level tests. No runtime mock mode or fabricated production fallback. Offline CI has no secrets; live checks/evals are explicit and quota-bounded.
- [ ] Relevant formatting, lint, typecheck and tests pass; inspect git status and staged diff for unrelated/sensitive data; descriptive scoped commits.
- [ ] One isolated codex/<ticket-id>-<short-description> branch and reviewable PR (task #0 bootstrap exception applies).
- [ ] Address valid feedback/conflicts, require independent external current-head approval plus green required checks and resolved blocking threads before agent merge; verify merge. No auto-merge/bypass/self-approval.

### Specification

Approved source: [CAR-150: MVP: ADHD-aware Telegram Meal Planner](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner). Canonical repo path after task #0: docs/mvp-spec.md. Tracking: Linear.

This ticket is planned work, not an instruction to start implementation during the ticketing session.

---

## CAR-153 — #2 — Implement durable quiz navigation and basic profile onboarding

[Live issue](https://linear.app/radical-creation/issue/CAR-153/2-implement-durable-quiz-navigation-and-basic-profile-onboarding)

Milestone: Repository and working Telegram onboarding

Blocked by: CAR-152

### What to build

Build a resumable one-question-per-message quiz using buttons, numeric inputs, multi-select Done, Back and Pause.

### Components owned

Onboarding workflow, profile migration, quiz messages. Keep changes scoped; add only migrations/modules needed by this behaviour. Do not revert others' work.

### Acceptance criteria

- [ ] Collect consent, adult eligibility, timezone, age, height, weight and activity.
- [ ] Explain sex parameter used for the calculation separately from optional gender identity.
- [ ] Minors, pregnancy/breastfeeding and condition-specific planning do not enter automated nutrition planning.
- [ ] Save after each answer; interrupted sessions resume; stale/repeated buttons do not advance twice.
- [ ] Back/edit invalidates dependent answers and user data is isolated.

### Verification

Red: interrupt onboarding and resume at the saved question. Test observable Telegram conversations, validation, edits and duplicate callbacks.

### Dependencies and overlap

Task <pull-request id="a3fde015-3d5a-46bb-93ba-557f66d57b9c" label="hlemmur/meaningful-work-transition-diagnostic#1" href="https://linear.app/radical-creation/review/scaffold-nextjs-mock-mode-foundation-car-6-705e54ea37fc" />: <issue id="cbac8cdb-ac7a-4d59-9515-55bbdf39112e" label="CAR-152" href="https://linear.app/radical-creation/issue/CAR-152/1-authenticate-telegram-webhooks-and-persist-incoming-work" />
Dependencies provide contracts/state or protect shared workflow/schema edits; milestone alone is not an execution gate.

### Definition of done

- [ ] Behaviour-first TDD where applicable; red → green → refactor. Appropriate unit/integration tests and scoped live checks pass.
- [ ] Use fixtures/mocked external boundaries only for code-level tests. No runtime mock mode or fabricated production fallback. Offline CI has no secrets; live checks/evals are explicit and quota-bounded.
- [ ] Relevant formatting, lint, typecheck and tests pass; inspect git status and staged diff for unrelated/sensitive data; descriptive scoped commits.
- [ ] One isolated codex/<ticket-id>-<short-description> branch and reviewable PR (task #0 bootstrap exception applies).
- [ ] Address valid feedback/conflicts, require independent external current-head approval plus green required checks and resolved blocking threads before agent merge; verify merge. No auto-merge/bypass/self-approval.

### Specification

Approved source: [CAR-150: MVP: ADHD-aware Telegram Meal Planner](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner). Canonical repo path after task #0: docs/mvp-spec.md. Tracking: Linear.

This ticket is planned work, not an instruction to start implementation during the ticketing session.

---

## CAR-154 — #3 — Confirm BEA and collect food, budget, and schedule preferences

[Live issue](https://linear.app/radical-creation/issue/CAR-154/3-confirm-bea-and-collect-food-budget-and-schedule-preferences)

Milestone: Repository and working Telegram onboarding

Blocked by: CAR-153

### What to build

Extend onboarding with official BEA identity confirmation and manageable taste/schedule rounds.

### Components owned

Onboarding workflow and preference schema. Keep changes scoped; add only migrations/modules needed by this behaviour. Do not revert others' work.

### Acceptance criteria

- [ ] Resolve BEA using verified identity, official URL and address; ask for confirmation. Unsupported preferred stores get an explicit BEA-only limitation.
- [ ] Collect allergies/exclusions, proteins, vegetables, carbs, cuisines, textures, spice, example meals, equipment and cooking tolerance.
- [ ] Collect weekly maximum budget, shopping day/time, morning and meal times, and confirmed pantry quantities.
- [ ] Usually 4–5 choices per question, multi-select where helpful and free-text correction; avoid one overwhelming questionnaire.
- [ ] Show editable summary and persist confirmation.

### Verification

Red: unsupported store cannot silently become BEA. Test resumed rounds, invalid budget, exclusions, conflicting answers and time validation.

### Dependencies and overlap

Task <pull-request id="2cecc1df-cd49-43b3-854c-f60d5d4d4ddc" label="hlemmur/meaningful-work-transition-diagnostic#2" href="https://linear.app/radical-creation/review/encode-questionnairev2-and-enginev2-contracts-car-7-8c1046a51cad" />: <issue id="2a282e00-6e00-4617-b841-18d2cc7398b9" label="CAR-153" href="https://linear.app/radical-creation/issue/CAR-153/2-implement-durable-quiz-navigation-and-basic-profile-onboarding" />
Dependencies provide contracts/state or protect shared workflow/schema edits; milestone alone is not an execution gate.

### Definition of done

- [ ] Behaviour-first TDD where applicable; red → green → refactor. Appropriate unit/integration tests and scoped live checks pass.
- [ ] Use fixtures/mocked external boundaries only for code-level tests. No runtime mock mode or fabricated production fallback. Offline CI has no secrets; live checks/evals are explicit and quota-bounded.
- [ ] Relevant formatting, lint, typecheck and tests pass; inspect git status and staged diff for unrelated/sensitive data; descriptive scoped commits.
- [ ] One isolated codex/<ticket-id>-<short-description> branch and reviewable PR (task #0 bootstrap exception applies).
- [ ] Address valid feedback/conflicts, require independent external current-head approval plus green required checks and resolved blocking threads before agent merge; verify merge. No auto-merge/bypass/self-approval.

### Specification

Approved source: [CAR-150: MVP: ADHD-aware Telegram Meal Planner](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner). Canonical repo path after task #0: docs/mvp-spec.md. Tracking: Linear.

This ticket is planned work, not an instruction to start implementation during the ticketing session.

---

## CAR-155 — #4 — Calculate and explain maintenance nutrition targets

[Live issue](https://linear.app/radical-creation/issue/CAR-155/4-calculate-and-explain-maintenance-nutrition-targets)

Milestone: Repository and working Telegram onboarding

Blocked by: CAR-154

### What to build

Implement deterministic adult maintenance calculations, then present estimated daily and meal targets for confirmation/edit.

### Components owned

Nutrition target module, versioned target persistence. Keep changes scoped; add only migrations/modules needed by this behaviour. Do not revert others' work.

### Acceptance criteria

- [ ] Use Mifflin–St Jeor with documented numeric activity multipliers and version the calculation.
- [ ] Protein/fat/carbohydrate energy split 20/30/50%; convert with 4/9/4 kcal per gram.
- [ ] Breakfast/lunch/dinner allocation 25/35/40%; persist calories and all macro grams.
- [ ] Daily tolerance ±10%; meal tolerance ±15%; explain these are estimated nutritional targets.
- [ ] Parameter edits invalidate old targets and affected proposals.

### Verification

Red: fixed profiles yield independently calculated expected targets. Cover units, invalid inputs, allocation totals and recalculation.

### Dependencies and overlap

Task <pull-request id="fe8b82e6-029c-4885-9323-b1977f0a9d37" label="hlemmur/meaningful-work-transition-diagnostic#3" href="https://linear.app/radical-creation/review/prove-mock-purchase-to-approved-report-tracer-car-8-a6b3a84a38ac" />: <issue id="8bf522db-393d-4336-9af0-3db0b598ed1b" label="CAR-154" href="https://linear.app/radical-creation/issue/CAR-154/3-confirm-bea-and-collect-food-budget-and-schedule-preferences" />
Dependencies provide contracts/state or protect shared workflow/schema edits; milestone alone is not an execution gate.

### Definition of done

- [ ] Behaviour-first TDD where applicable; red → green → refactor. Appropriate unit/integration tests and scoped live checks pass.
- [ ] Use fixtures/mocked external boundaries only for code-level tests. No runtime mock mode or fabricated production fallback. Offline CI has no secrets; live checks/evals are explicit and quota-bounded.
- [ ] Relevant formatting, lint, typecheck and tests pass; inspect git status and staged diff for unrelated/sensitive data; descriptive scoped commits.
- [ ] One isolated codex/<ticket-id>-<short-description> branch and reviewable PR (task #0 bootstrap exception applies).
- [ ] Address valid feedback/conflicts, require independent external current-head approval plus green required checks and resolved blocking threads before agent merge; verify merge. No auto-merge/bypass/self-approval.

### Specification

Approved source: [CAR-150: MVP: ADHD-aware Telegram Meal Planner](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner). Canonical repo path after task #0: docs/mvp-spec.md. Tracking: Linear.

This ticket is planned work, not an instruction to start implementation during the ticketing session.

---

## CAR-156 — #5 — Establish permitted BEA data access and document coverage

[Live issue](https://linear.app/radical-creation/issue/CAR-156/5-establish-permitted-bea-data-access-and-document-coverage)

Milestone: Traceable BEA prices and nutrition data

Blocked by: CAR-151

### What to build

Investigate official BEA store, offers and shopping surfaces; document the actual integration rather than assume a public complete API.

### Components owned

ICA source contract and coverage evidence. Keep changes scoped; add only migrations/modules needed by this behaviour. Do not revert others' work.

### Acceptance criteria

- [ ] Verify store identity and URLs, online/in-store price channels, offer eligibility and observable stock fields.
- [ ] Record source access method, refresh/validity behaviour, permitted use and authentication requirements.
- [ ] Define normalised StoreProvider contract and traceable estimate inputs.
- [ ] Document missing catalogue/stock coverage and any launch blocker; do not infer available stock from promotions.
- [ ] Do not bypass authentication or introduce paid scraping.

### Verification

Provide timestamped source evidence and field-level examples without secrets. A coding agent can implement <pull-request id="e2f9015b-f3bc-4d52-987f-385392f833e0" label="hlemmur/meaningful-work-transition-diagnostic#6" href="https://linear.app/radical-creation/review/add-adaptive-checkpoints-a-d-and-a-safety-overlay-car-11-d76942905a2d" /> from the contract; unresolved access constraints remain explicit.

### Dependencies and overlap

Task #0: <issue id="58ddb880-55a2-4bdc-a7b7-f45cfe55d282" label="CAR-151" href="https://linear.app/radical-creation/issue/CAR-151/0-create-the-public-github-repository-and-executable-project" />
Dependencies provide contracts/state or protect shared workflow/schema edits; milestone alone is not an execution gate.

### Definition of done

- [ ] Behaviour-first TDD where applicable; red → green → refactor. Appropriate unit/integration tests and scoped live checks pass.
- [ ] Use fixtures/mocked external boundaries only for code-level tests. No runtime mock mode or fabricated production fallback. Offline CI has no secrets; live checks/evals are explicit and quota-bounded.
- [ ] Relevant formatting, lint, typecheck and tests pass; inspect git status and staged diff for unrelated/sensitive data; descriptive scoped commits.
- [ ] One isolated codex/<ticket-id>-<short-description> branch and reviewable PR (task #0 bootstrap exception applies).
- [ ] Address valid feedback/conflicts, require independent external current-head approval plus green required checks and resolved blocking threads before agent merge; verify merge. No auto-merge/bypass/self-approval.

### Specification

Approved source: [CAR-150: MVP: ADHD-aware Telegram Meal Planner](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner). Canonical repo path after task #0: docs/mvp-spec.md. Tracking: Linear.

This ticket is planned work, not an instruction to start implementation during the ticketing session.

---

## CAR-157 — #6 — Ingest BEA product and offer observations

[Live issue](https://linear.app/radical-creation/issue/CAR-157/6-ingest-bea-product-and-offer-observations)

Milestone: Traceable BEA prices and nutrition data

Blocked by: CAR-156

### What to build

Implement live BEA ingestion against the contract from <pull-request id="cfafc05f-5782-4c0a-8c6d-fb5b9414f97f" label="hlemmur/meaningful-work-transition-diagnostic#5" href="https://linear.app/radical-creation/review/complete-v2-questionnaire-ui-with-branching-and-autosave-car-10-c023921977e4" />.

### Components owned

StoreProvider adapter, observations migrations, ingestion functions. Scope changes to this behaviour; do not revert others' work.

### Acceptance criteria

- [ ] Persist product/store/pack/units/source/observed time/channel/price/offer conditions/validity.
- [ ] Separate ordinary, conditional and estimated observations. Availability is available/unavailable/unknown.
- [ ] Refresh is idempotent and preserves provenance; failures never inject fake data.
- [ ] Parse multi-buy, purchase limits, membership and self-scanning conditions.
- [ ] Explicit live smoke command retrieves real BEA observations; tests use saved representative source fixtures.

### How to verify

Red: fixture with self-scanning promotion retains eligibility rather than becoming a universal price. Test malformed/changed source data and repeated refreshes.

### Dependencies and overlap

<issue id="1110acce-f179-49e0-80b8-929bcca20dd8" label="CAR-156" href="https://linear.app/radical-creation/issue/CAR-156/5-establish-permitted-bea-data-access-and-document-coverage" /> provide required contracts/state or protect shared schema/workflow edits. Milestone ordering alone is not a blocker.

### Definition of done

- [ ] Behaviour-first TDD: red → green → refactor; appropriate unit/integration coverage and scoped validation.
- [ ] Fixtures/mocked external boundaries only in code-level tests. No runtime mock mode or fabricated live fallback. Offline CI requires no credentials; live checks/evals are explicit and quota-bounded.
- [ ] Formatting, lint, typecheck and relevant tests pass. Inspect git status/staged diff, exclude sensitive/unrelated data, commit descriptively.
- [ ] One codex/<ticket-id>-<short-description> branch and reviewable PR; valid feedback/conflicts addressed.
- [ ] Independent external approval applies to current head; checks green and blocking threads resolved before verified agent merge. No auto-merge, bypass or self-approval.

No implementation is authorised during this ticketing session.

### Specification

[CAR-150: approved MVP specification](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner); canonical repository path after #0: docs/mvp-spec.md. Tracking: Linear.

---

## CAR-158 — #7 — Add price freshness, estimates, and source-failure handling

[Live issue](https://linear.app/radical-creation/issue/CAR-158/7-add-price-freshness-estimates-and-source-failure-handling)

Milestone: Traceable BEA prices and nutrition data

Blocked by: CAR-157

### What to build

Choose usable prices with conservative traceable estimates when verified observations are missing.

### Components owned

Price selection and estimate-confidence module. Scope changes to this behaviour; do not revert others' work.

### Acceptance criteria

- [ ] Stale after 24h unless explicit validity supports reuse; expired offers cannot price a future shopping date.
- [ ] Estimate basis is a documented observation or curated reference, never generated by Gemini.
- [ ] Missing estimate basis is unpriceable, not zero; channel/store mismatch is rejected.
- [ ] Outages preserve historical evidence but label it stale. Unavailable products cannot silently remain guaranteed purchases.
- [ ] Each chosen price exposes provenance, basis and confidence.

### How to verify

Red: expired discount is not applied. Cover stale observations, unknown stock, no basis, channel mismatches and outages.

### Dependencies and overlap

<issue id="a9601440-c245-4249-b099-6a0ba440ef59" label="CAR-157" href="https://linear.app/radical-creation/issue/CAR-157/6-ingest-bea-product-and-offer-observations" /> provide required contracts/state or protect shared schema/workflow edits. Milestone ordering alone is not a blocker.

### Definition of done

- [ ] Behaviour-first TDD: red → green → refactor; appropriate unit/integration coverage and scoped validation.
- [ ] Fixtures/mocked external boundaries only in code-level tests. No runtime mock mode or fabricated live fallback. Offline CI requires no credentials; live checks/evals are explicit and quota-bounded.
- [ ] Formatting, lint, typecheck and relevant tests pass. Inspect git status/staged diff, exclude sensitive/unrelated data, commit descriptively.
- [ ] One codex/<ticket-id>-<short-description> branch and reviewable PR; valid feedback/conflicts addressed.
- [ ] Independent external approval applies to current head; checks green and blocking threads resolved before verified agent merge. No auto-merge, bypass or self-approval.

No implementation is authorised during this ticketing session.

### Specification

[CAR-150: approved MVP specification](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner); canonical repository path after #0: docs/mvp-spec.md. Tracking: Linear.

---

## CAR-159 — #8 — Match ingredients to sourced nutritional records

[Live issue](https://linear.app/radical-creation/issue/CAR-159/8-match-ingredients-to-sourced-nutritional-records)

Milestone: Traceable BEA prices and nutrition data

Blocked by: CAR-155, CAR-157

### What to build

Use product nutrition where applicable and otherwise Livsmedelsverket records to resolve recipe ingredients.

### Components owned

NutritionProvider, ingredient mappings and quantity conversions. Scope changes to this behaviour; do not revert others' work.

### Acceptance criteria

- [ ] Store source/version and per-100g or per-100ml basis; explicitly distinguish raw, cooked and edible quantities.
- [ ] Ambiguous matches remain unresolved rather than silently selecting a plausible food.
- [ ] Conversions cover units, edible fraction and documented cooked/raw yield; incompatible bases are rejected.
- [ ] Include oils, sauces, dressings and toppings in mappings.
- [ ] Live smoke command resolves representative pilot ingredients.

### How to verify

Red: raw and cooked rice cannot be treated as identical weight bases. Test conversions with independently checked totals and local database integration.

### Dependencies and overlap

<issue id="8f3ad922-79e5-4c42-af96-42ab306554d7" label="CAR-155" href="https://linear.app/radical-creation/issue/CAR-155/4-calculate-and-explain-maintenance-nutrition-targets" />, <issue id="a9601440-c245-4249-b099-6a0ba440ef59" label="CAR-157" href="https://linear.app/radical-creation/issue/CAR-157/6-ingest-bea-product-and-offer-observations" /> provide required contracts/state or protect shared schema/workflow edits. Milestone ordering alone is not a blocker.

### Definition of done

- [ ] Behaviour-first TDD: red → green → refactor; appropriate unit/integration coverage and scoped validation.
- [ ] Fixtures/mocked external boundaries only in code-level tests. No runtime mock mode or fabricated live fallback. Offline CI requires no credentials; live checks/evals are explicit and quota-bounded.
- [ ] Formatting, lint, typecheck and relevant tests pass. Inspect git status/staged diff, exclude sensitive/unrelated data, commit descriptively.
- [ ] One codex/<ticket-id>-<short-description> branch and reviewable PR; valid feedback/conflicts addressed.
- [ ] Independent external approval applies to current head; checks green and blocking threads resolved before verified agent merge. No auto-merge, bypass or self-approval.

No implementation is authorised during this ticketing session.

### Specification

[CAR-150: approved MVP specification](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner); canonical repository path after #0: docs/mvp-spec.md. Tracking: Linear.

---

## CAR-160 — #9 — Generate structured single-day recipes with Gemini Flash

[Live issue](https://linear.app/radical-creation/issue/CAR-160/9-generate-structured-single-day-recipes-with-gemini-flash)

Milestone: A validated, appealing weekly proposal

Blocked by: CAR-155, CAR-159

### What to build

Use @google/genai behind MealGenerator to propose one day using known ingredients, preferences and calculated targets.

### Components owned

Gemini adapter, recipe schema and versioned prompts. Scope changes to this behaviour; do not revert others' work.

### Acceptance criteria

- [ ] Pin a verified stable Flash model with available free quota; no silent model change or paid fallback.
- [ ] Structured recipes include ingredient IDs, quantities, component roles, total/active time and 3–5 short steps.
- [ ] Minimise body data; send targets rather than raw measurements where possible.
- [ ] Handle malformed schema, unknown ingredient references, refusals, throttling and quota exhaustion.
- [ ] Model cannot invent product prices/availability; real errors remain visible.

### How to verify

Red: valid JSON with an unknown ingredient ID is rejected. Deterministic response fixtures cover errors; separate explicit live Gemini smoke command.

### Dependencies and overlap

<issue id="8f3ad922-79e5-4c42-af96-42ab306554d7" label="CAR-155" href="https://linear.app/radical-creation/issue/CAR-155/4-calculate-and-explain-maintenance-nutrition-targets" />, <issue id="0a36d36b-efc5-4b11-b372-5e0a8add2162" label="CAR-159" href="https://linear.app/radical-creation/issue/CAR-159/8-match-ingredients-to-sourced-nutritional-records" /> provide required contracts/state or protect shared schema/workflow edits. Milestone ordering alone is not a blocker.

### Definition of done

- [ ] Behaviour-first TDD: red → green → refactor; appropriate unit/integration coverage and scoped validation.
- [ ] Fixtures/mocked external boundaries only in code-level tests. No runtime mock mode or fabricated live fallback. Offline CI requires no credentials; live checks/evals are explicit and quota-bounded.
- [ ] Formatting, lint, typecheck and relevant tests pass. Inspect git status/staged diff, exclude sensitive/unrelated data, commit descriptively.
- [ ] One codex/<ticket-id>-<short-description> branch and reviewable PR; valid feedback/conflicts addressed.
- [ ] Independent external approval applies to current head; checks green and blocking threads resolved before verified agent merge. No auto-merge, bypass or self-approval.

No implementation is authorised during this ticketing session.

### Specification

[CAR-150: approved MVP specification](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner); canonical repository path after #0: docs/mvp-spec.md. Tracking: Linear.

---

## CAR-161 — #10 — Validate nutrition and repair proposed portions

[Live issue](https://linear.app/radical-creation/issue/CAR-161/10-validate-nutrition-and-repair-proposed-portions)

Milestone: A validated, appealing weekly proposal

Blocked by: CAR-160

### What to build

Independently calculate nutrition and reject or repair noncompliant proposals.

### Components owned

Recipe validators, deterministic totals, bounded repair. Scope changes to this behaviour; do not revert others' work.

### Acceptance criteria

- [ ] Daily calories and each macro ±10%; meal calories and each macro ±15% of allocation.
- [ ] All ingredients and caloric additions use resolved nutrition; exclusions, equipment and missing quantities are checked.
- [ ] Return actionable structured validation errors for repair.
- [ ] Maximum three generation/repair attempts per proposal across persisted stages; failure cannot publish an accepted plan.
- [ ] Portion edits trigger complete affected calculations, not reliance on model-provided totals.

### How to verify

Red: believable model calorie total with wrong actual ingredient totals fails. Test exact tolerance boundaries, missing records, forbidden foods and bounded retries.

### Dependencies and overlap

<issue id="82e1ac31-d5c6-4cae-8159-54d87887aa5d" label="CAR-160" href="https://linear.app/radical-creation/issue/CAR-160/9-generate-structured-single-day-recipes-with-gemini-flash" /> provide required contracts/state or protect shared schema/workflow edits. Milestone ordering alone is not a blocker.

### Definition of done

- [ ] Behaviour-first TDD: red → green → refactor; appropriate unit/integration coverage and scoped validation.
- [ ] Fixtures/mocked external boundaries only in code-level tests. No runtime mock mode or fabricated live fallback. Offline CI requires no credentials; live checks/evals are explicit and quota-bounded.
- [ ] Formatting, lint, typecheck and relevant tests pass. Inspect git status/staged diff, exclude sensitive/unrelated data, commit descriptively.
- [ ] One codex/<ticket-id>-<short-description> branch and reviewable PR; valid feedback/conflicts addressed.
- [ ] Independent external approval applies to current head; checks green and blocking threads resolved before verified agent merge. No auto-merge, bypass or self-approval.

No implementation is authorised during this ticketing session.

### Specification

[CAR-150: approved MVP specification](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner); canonical repository path after #0: docs/mvp-spec.md. Tracking: Linear.

---

## CAR-162 — #11 — Cost a purchasable cart and enforce the absolute budget ceiling

[Live issue](https://linear.app/radical-creation/issue/CAR-162/11-cost-a-purchasable-cart-and-enforce-the-absolute-budget-ceiling)

Milestone: A validated, appealing weekly proposal

Blocked by: CAR-161, CAR-158

### What to build

Aggregate recipe quantities into purchasable packs and determine an eligible estimated cart.

### Components owned

Cart aggregation, pack costing and budget rules. Scope changes to this behaviour; do not revert others' work.

### Acceptance criteria

- [ ] Round to full packs and charge replenishment; subtract only confirmed sufficient pantry quantities.
- [ ] Apply offers with quantity, channel, membership, limits and shopping-date validity.
- [ ] Target ≤80%; attempt cheaper compliant options before automatically using margin up to the maximum.
- [ ] Show margin use, estimated lines and total confidence. Required unpriceable items prevent budget approval.
- [ ] Reject impossible budgets with concrete alternatives; never weaken nutrition/allergy constraints.

### How to verify

Red: portion-only costing that misses whole-pack spend fails. Test multi-buy interactions, pack rounding, pantry quantities and exact ceiling.

### Dependencies and overlap

<issue id="0caa239b-1d5f-4c2d-ac83-e9ef87b6538c" label="CAR-158" href="https://linear.app/radical-creation/issue/CAR-158/7-add-price-freshness-estimates-and-source-failure-handling" />, <issue id="d09ce2d4-c674-40b8-95e5-32946e5e6027" label="CAR-161" href="https://linear.app/radical-creation/issue/CAR-161/10-validate-nutrition-and-repair-proposed-portions" /> provide required contracts/state or protect shared schema/workflow edits. Milestone ordering alone is not a blocker.

### Definition of done

- [ ] Behaviour-first TDD: red → green → refactor; appropriate unit/integration coverage and scoped validation.
- [ ] Fixtures/mocked external boundaries only in code-level tests. No runtime mock mode or fabricated live fallback. Offline CI requires no credentials; live checks/evals are explicit and quota-bounded.
- [ ] Formatting, lint, typecheck and relevant tests pass. Inspect git status/staged diff, exclude sensitive/unrelated data, commit descriptively.
- [ ] One codex/<ticket-id>-<short-description> branch and reviewable PR; valid feedback/conflicts addressed.
- [ ] Independent external approval applies to current head; checks green and blocking threads resolved before verified agent merge. No auto-merge, bypass or self-approval.

No implementation is authorised during this ticketing session.

### Specification

[CAR-150: approved MVP specification](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner); canonical repository path after #0: docs/mvp-spec.md. Tracking: Linear.

---

## CAR-163 — #12 — Build seven-day planning with fresh variation and meal history

[Live issue](https://linear.app/radical-creation/issue/CAR-163/12-build-seven-day-planning-with-fresh-variation-and-meal-history)

Milestone: A validated, appealing weekly proposal

Blocked by: CAR-162

### What to build

Generate 21 meals as bounded persisted stages and validate the complete week.

### Components owned

Persisted weekly orchestrator, variety checks, meal history. Scope changes to this behaviour; do not revert others' work.

### Acceptance criteria

- [ ] No identical meals within week; target four preferred cuisine families when feasible and report preference-limited exceptions.
- [ ] Vary adjacent main ingredients, techniques, textures and flavours; use four-week history to discourage repeats.
- [ ] Default fresh cooking ≤25 minutes, adjustable by user; lunch/dinner normally main + veg + contrasting sauce/garnish.
- [ ] Reuse ingredients across distinct dishes; no hard ten-ingredient cap or default batch repetition.
- [ ] Every day passes nutrition and whole-week cart passes budget; contradictions produce honest failure with choices.

### How to verify

Red: a renamed duplicate recipe is rejected by canonical recipe/ingredient-method signature. Test history, narrow preferences, whole-cart accounting and resumed generation.

### Dependencies and overlap

<issue id="2d28a3f5-f64f-4fa8-9161-642c966616b6" label="CAR-162" href="https://linear.app/radical-creation/issue/CAR-162/11-cost-a-purchasable-cart-and-enforce-the-absolute-budget-ceiling" /> provide required contracts/state or protect shared schema/workflow edits. Milestone ordering alone is not a blocker.

### Definition of done

- [ ] Behaviour-first TDD: red → green → refactor; appropriate unit/integration coverage and scoped validation.
- [ ] Fixtures/mocked external boundaries only in code-level tests. No runtime mock mode or fabricated live fallback. Offline CI requires no credentials; live checks/evals are explicit and quota-bounded.
- [ ] Formatting, lint, typecheck and relevant tests pass. Inspect git status/staged diff, exclude sensitive/unrelated data, commit descriptively.
- [ ] One codex/<ticket-id>-<short-description> branch and reviewable PR; valid feedback/conflicts addressed.
- [ ] Independent external approval applies to current head; checks green and blocking threads resolved before verified agent merge. No auto-merge, bypass or self-approval.

No implementation is authorised during this ticketing session.

### Specification

[CAR-150: approved MVP specification](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner); canonical repository path after #0: docs/mvp-spec.md. Tracking: Linear.

---

## CAR-164 — #13 — Present, edit, and accept versioned weekly proposals

[Live issue](https://linear.app/radical-creation/issue/CAR-164/13-present-edit-and-accept-versioned-weekly-proposals)

Milestone: A validated, appealing weekly proposal

Blocked by: CAR-163

### What to build

Present recipes and shopping list with explicit plan acceptance and stale-action protection.

### Components owned

Telegram plan renderer, acceptance/version state. Scope changes to this behaviour; do not revert others' work.

### Acceptance criteria

- [ ] Display portions, steps, timing, nutrition and category-grouped full-pack shopping quantities.
- [ ] Include total/remaining budget, margin usage, price observations/estimates and stock uncertainty.
- [ ] Use this week, Change a meal and Edit preferences work; only validated accepted version becomes active.
- [ ] Old callback cannot activate superseded version; proposed plan does not overwrite accepted plan.
- [ ] Implement /today, /week and /shopping; safe formatting and message splitting fit Telegram limits.

### How to verify

Red: accepting superseded proposal leaves current version unchanged. Test long menus, escaping, pagination and double acceptance.

### Dependencies and overlap

<issue id="fe74f179-6563-4b58-857a-cce33f388459" label="CAR-163" href="https://linear.app/radical-creation/issue/CAR-163/12-build-seven-day-planning-with-fresh-variation-and-meal-history" /> provide required contracts/state or protect shared schema/workflow edits. Milestone ordering alone is not a blocker.

### Definition of done

- [ ] Behaviour-first TDD: red → green → refactor; appropriate unit/integration coverage and scoped validation.
- [ ] Fixtures/mocked external boundaries only in code-level tests. No runtime mock mode or fabricated live fallback. Offline CI requires no credentials; live checks/evals are explicit and quota-bounded.
- [ ] Formatting, lint, typecheck and relevant tests pass. Inspect git status/staged diff, exclude sensitive/unrelated data, commit descriptively.
- [ ] One codex/<ticket-id>-<short-description> branch and reviewable PR; valid feedback/conflicts addressed.
- [ ] Independent external approval applies to current head; checks green and blocking threads resolved before verified agent merge. No auto-merge, bypass or self-approval.

No implementation is authorised during this ticketing session.

### Specification

[CAR-150: approved MVP specification](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner); canonical repository path after #0: docs/mvp-spec.md. Tracking: Linear.

---

## CAR-165 — #14 — Schedule weekly proposals and daily/meal reminders

[Live issue](https://linear.app/radical-creation/issue/CAR-165/14-schedule-weekly-proposals-and-dailymeal-reminders)

Milestone: Reliable reminders and everyday adaptation

Blocked by: CAR-164

### What to build

Persist due events and dispatch through authenticated scheduled invocation and durable queues.

### Components owned

Supabase Cron, durable task consumers, timezone schedules. Scope changes to this behaviour; do not revert others' work.

### Acceptance criteria

- [ ] Shopping-day proposal starts that day; morning sends full day plus recipes; meal sends relevant current recipe.
- [ ] Cron checks approximately every minute; tasks survive restarts, bounded retries and worker termination.
- [ ] Use user timezone and daylight-saving transitions; edits reschedule future work.
- [ ] Only accepted plan drives meal reminders; saved content delivery does not invoke Gemini.
- [ ] Suppress stale meal events after long outage; record delivery attempts and minimise duplicates across ambiguous network errors.

### How to verify

Red: restart between claiming and sending eventually recovers without losing event. Advance fake clock through a full week; test DST, retries and version invalidation.

### Dependencies and overlap

<issue id="794af146-4528-4a4a-abb1-5357f7dfb1a8" label="CAR-164" href="https://linear.app/radical-creation/issue/CAR-164/13-present-edit-and-accept-versioned-weekly-proposals" /> provide required contracts/state or protect shared schema/workflow edits. Milestone ordering alone is not a blocker.

### Definition of done

- [ ] Behaviour-first TDD: red → green → refactor; appropriate unit/integration coverage and scoped validation.
- [ ] Fixtures/mocked external boundaries only in code-level tests. No runtime mock mode or fabricated live fallback. Offline CI requires no credentials; live checks/evals are explicit and quota-bounded.
- [ ] Formatting, lint, typecheck and relevant tests pass. Inspect git status/staged diff, exclude sensitive/unrelated data, commit descriptively.
- [ ] One codex/<ticket-id>-<short-description> branch and reviewable PR; valid feedback/conflicts addressed.
- [ ] Independent external approval applies to current head; checks green and blocking threads resolved before verified agent merge. No auto-merge, bypass or self-approval.

No implementation is authorised during this ticketing session.

### Specification

[CAR-150: approved MVP specification](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner); canonical repository path after #0: docs/mvp-spec.md. Tracking: Linear.

---

## CAR-166 — #15 — Implement snooze, skip, swaps, and low-energy alternatives

[Live issue](https://linear.app/radical-creation/issue/CAR-166/15-implement-snooze-skip-swaps-and-low-energy-alternatives)

Milestone: Reliable reminders and everyday adaptation

Blocked by: CAR-165

### What to build

Support everyday adaptation with validated replacements and explicit shopping impact.

### Components owned

Meal callback actions, substitution, replacement scheduling. Scope changes to this behaviour; do not revert others' work.

### Acceptance criteria

- [ ] Start/Snooze/Skip/Swap actions are idempotent; no guilt or automatic calorie compensation after skipping.
- [ ] Swaps and low-energy choices rerun nutrition, exclusions and cart constraints.
- [ ] Before shopping update proposal cart; after shopping prioritise confirmed purchased ingredients.
- [ ] Flag extra purchase; validate recorded spending plus required new purchases against ceiling.
- [ ] Unknown spending cannot support guaranteed remaining-budget claim; invalidate affected pending deliveries.

### How to verify

Red: swapping a meal cannot bypass allergy or budget validator. Test pantry/purchased quantities, repeat clicks and stale reminders.

### Dependencies and overlap

<issue id="8df89eb1-0f53-4a12-841c-1a26f47083ff" label="CAR-165" href="https://linear.app/radical-creation/issue/CAR-165/14-schedule-weekly-proposals-and-dailymeal-reminders" /> provide required contracts/state or protect shared schema/workflow edits. Milestone ordering alone is not a blocker.

### Definition of done

- [ ] Behaviour-first TDD: red → green → refactor; appropriate unit/integration coverage and scoped validation.
- [ ] Fixtures/mocked external boundaries only in code-level tests. No runtime mock mode or fabricated live fallback. Offline CI requires no credentials; live checks/evals are explicit and quota-bounded.
- [ ] Formatting, lint, typecheck and relevant tests pass. Inspect git status/staged diff, exclude sensitive/unrelated data, commit descriptively.
- [ ] One codex/<ticket-id>-<short-description> branch and reviewable PR; valid feedback/conflicts addressed.
- [ ] Independent external approval applies to current head; checks green and blocking threads resolved before verified agent merge. No auto-merge, bypass or self-approval.

No implementation is authorised during this ticketing session.

### Specification

[CAR-150: approved MVP specification](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner); canonical repository path after #0: docs/mvp-spec.md. Tracking: Linear.

---

## CAR-167 — #16 — Implement settings, pause, and complete user deletion

[Live issue](https://linear.app/radical-creation/issue/CAR-167/16-implement-settings-pause-and-complete-user-deletion)

Milestone: Reliable reminders and everyday adaptation

Blocked by: CAR-166

### What to build

Add /settings, /pause, conversation-based correction and confirmed /delete_me.

### Components owned

User lifecycle, permissions and cleanup migrations. Scope changes to this behaviour; do not revert others' work.

### Acceptance criteria

- [ ] Profile edits recalculate targets, invalidate affected proposals and update schedules.
- [ ] Pause stops future reminder and generation jobs.
- [ ] Deletion requires confirmation and removes profile, plans, conversations, pending jobs, schedules and personal delivery content.
- [ ] Retained aggregate operations data cannot recover personal content.
- [ ] Users cannot view or mutate one another's state; test DB policies and callback ownership.

### How to verify

Red: deletion leaves no queued personal payload that can later send. Integration-test relational cleanup, isolation, pause and resumed settings.

### Dependencies and overlap

<issue id="4e7ab893-a294-4a09-a1e1-5e0e93f2ffb1" label="CAR-166" href="https://linear.app/radical-creation/issue/CAR-166/15-implement-snooze-skip-swaps-and-low-energy-alternatives" /> provide required contracts/state or protect shared schema/workflow edits. Milestone ordering alone is not a blocker.

### Definition of done

- [ ] Behaviour-first TDD: red → green → refactor; appropriate unit/integration coverage and scoped validation.
- [ ] Fixtures/mocked external boundaries only in code-level tests. No runtime mock mode or fabricated live fallback. Offline CI requires no credentials; live checks/evals are explicit and quota-bounded.
- [ ] Formatting, lint, typecheck and relevant tests pass. Inspect git status/staged diff, exclude sensitive/unrelated data, commit descriptively.
- [ ] One codex/<ticket-id>-<short-description> branch and reviewable PR; valid feedback/conflicts addressed.
- [ ] Independent external approval applies to current head; checks green and blocking threads resolved before verified agent merge. No auto-merge, bypass or self-approval.

No implementation is authorised during this ticketing session.

### Specification

[CAR-150: approved MVP specification](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner); canonical repository path after #0: docs/mvp-spec.md. Tracking: Linear.

---

## CAR-168 — #17 — Add the basic model-evaluation dataset and runner

[Live issue](https://linear.app/radical-creation/issue/CAR-168/17-add-the-basic-model-evaluation-dataset-and-runner)

Milestone: Model evals and free-tier pilot readiness

Blocked by: CAR-161

### What to build

Create explicit live eval command using synthetic profiles and real Gemini responses; keep offline regression tests separate.

### Components owned

evals runner, cases, reports. Scope changes to this behaviour; do not revert others' work.

### Acceptance criteria

- [ ] 20 fixed cases cover allergies/exclusions, tight budgets, equipment, cuisines/textures, low energy, conflicting requests and override attempts.
- [ ] Reports contain model ID, prompt version, case ID, timings and deterministic validator results.
- [ ] Hard rules scored by code, never model self-assessment; cases declare expected success versus safe refusal.
- [ ] Bound concurrency and total model calls; missing credentials/quota produces clear non-pass result.
- [ ] No real user data or secrets in fixtures/reports; ordinary CI is offline.

### How to verify

Red: known-invalid saved output scores as failure. Run fixture-based scorer tests plus explicit credentialed live sample; later <pull-request id="08ab3075-b7d0-48fe-828a-8cb2c9080364" label="hlemmur/meaningful-work-transition-diagnostic#18" href="https://linear.app/radical-creation/review/operator-queue-as-triage-table-without-approve-car-32-8f0c7d819047" /> adds weekly checks.

### Dependencies and overlap

<issue id="d09ce2d4-c674-40b8-95e5-32946e5e6027" label="CAR-161" href="https://linear.app/radical-creation/issue/CAR-161/10-validate-nutrition-and-repair-proposed-portions" /> provide required contracts/state or protect shared schema/workflow edits. Milestone ordering alone is not a blocker.

### Definition of done

- [ ] Behaviour-first TDD: red → green → refactor; appropriate unit/integration coverage and scoped validation.
- [ ] Fixtures/mocked external boundaries only in code-level tests. No runtime mock mode or fabricated live fallback. Offline CI requires no credentials; live checks/evals are explicit and quota-bounded.
- [ ] Formatting, lint, typecheck and relevant tests pass. Inspect git status/staged diff, exclude sensitive/unrelated data, commit descriptively.
- [ ] One codex/<ticket-id>-<short-description> branch and reviewable PR; valid feedback/conflicts addressed.
- [ ] Independent external approval applies to current head; checks green and blocking threads resolved before verified agent merge. No auto-merge, bypass or self-approval.

No implementation is authorised during this ticketing session.

### Specification

[CAR-150: approved MVP specification](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner); canonical repository path after #0: docs/mvp-spec.md. Tracking: Linear.

---

## CAR-169 — #18 — Gate weekly model quality and review food appeal

[Live issue](https://linear.app/radical-creation/issue/CAR-169/18-gate-weekly-model-quality-and-review-food-appeal)

Milestone: Model evals and free-tier pilot readiness

Blocked by: CAR-168, CAR-163

### What to build

Extend evals to full weeks and improve prompts against concrete failures.

### Components owned

Weekly eval checks, prompt revisions and human rubric. Scope changes to this behaviour; do not revert others' work.

### Acceptance criteria

- [ ] Five representative profiles run twice for ten real generated plans.
- [ ] Every published output passes nutrition, allergy/exclusion, integrity, repetition and budget rules; rejected attempts are reported separately.
- [ ] At least 80% of feasible runs publish valid plans; infeasible runs return honest failures.
- [ ] Human rubric 1–5 with anchors for clarity, likely appeal, flavour/texture variation and effort; each dimension averages ≥4.
- [ ] Store review evidence; automated score is not proof of taste. Include injection tests that cannot override hard rules.

### How to verify

Run deterministic assertions then bounded live weekly suite; record failures and human rubric evidence with prompt/model versions.

### Dependencies and overlap

<issue id="fe74f179-6563-4b58-857a-cce33f388459" label="CAR-163" href="https://linear.app/radical-creation/issue/CAR-163/12-build-seven-day-planning-with-fresh-variation-and-meal-history" />, <issue id="8d2c7c63-b548-4e52-a2bd-d29bc62966d1" label="CAR-168" href="https://linear.app/radical-creation/issue/CAR-168/17-add-the-basic-model-evaluation-dataset-and-runner" /> provide required contracts/state or protect shared schema/workflow edits. Milestone ordering alone is not a blocker.

### Definition of done

- [ ] Behaviour-first TDD: red → green → refactor; appropriate unit/integration coverage and scoped validation.
- [ ] Fixtures/mocked external boundaries only in code-level tests. No runtime mock mode or fabricated live fallback. Offline CI requires no credentials; live checks/evals are explicit and quota-bounded.
- [ ] Formatting, lint, typecheck and relevant tests pass. Inspect git status/staged diff, exclude sensitive/unrelated data, commit descriptively.
- [ ] One codex/<ticket-id>-<short-description> branch and reviewable PR; valid feedback/conflicts addressed.
- [ ] Independent external approval applies to current head; checks green and blocking threads resolved before verified agent merge. No auto-merge, bypass or self-approval.

No implementation is authorised during this ticketing session.

### Specification

[CAR-150: approved MVP specification](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner); canonical repository path after #0: docs/mvp-spec.md. Tracking: Linear.

---

## CAR-170 — #19 — Benchmark free-tier execution and recovery

[Live issue](https://linear.app/radical-creation/issue/CAR-170/19-benchmark-free-tier-execution-and-recovery)

Milestone: Model evals and free-tier pilot readiness

Blocked by: CAR-169, CAR-165

### What to build

Measure real stage workloads against free-tier limits and validate graceful exhaustion/recovery.

### Components owned

Performance, retention, quota and recovery procedures. Scope changes to this behaviour; do not revert others' work.

### Acceptance criteria

- [ ] Benchmark representative worst-case recipe/catalogue payloads; document CPU/wall-time headroom.
- [ ] Split stages below Supabase Free limits (currently 2s CPU/request, 150s worker lifetime); persist progress before retries.
- [ ] Quota exhaustion defers generation, continues saved reminders and never enables paid fallback.
- [ ] Cleanup old observations, queue archives and logs within free storage limits.
- [ ] Document and verify export/restore locally plus project-pause recovery; do not assume cron prevents pausing.

### How to verify

Fault-inject timeout/quota interruptions in tests; run explicit stage benchmark and local restore drill with synthetic data.

### Dependencies and overlap

<issue id="8df89eb1-0f53-4a12-841c-1a26f47083ff" label="CAR-165" href="https://linear.app/radical-creation/issue/CAR-165/14-schedule-weekly-proposals-and-dailymeal-reminders" />, <issue id="f7808d25-31b9-4354-bd30-ae6829dfcaae" label="CAR-169" href="https://linear.app/radical-creation/issue/CAR-169/18-gate-weekly-model-quality-and-review-food-appeal" /> provide required contracts/state or protect shared schema/workflow edits. Milestone ordering alone is not a blocker.

### Definition of done

- [ ] Behaviour-first TDD: red → green → refactor; appropriate unit/integration coverage and scoped validation.
- [ ] Fixtures/mocked external boundaries only in code-level tests. No runtime mock mode or fabricated live fallback. Offline CI requires no credentials; live checks/evals are explicit and quota-bounded.
- [ ] Formatting, lint, typecheck and relevant tests pass. Inspect git status/staged diff, exclude sensitive/unrelated data, commit descriptively.
- [ ] One codex/<ticket-id>-<short-description> branch and reviewable PR; valid feedback/conflicts addressed.
- [ ] Independent external approval applies to current head; checks green and blocking threads resolved before verified agent merge. No auto-merge, bypass or self-approval.

No implementation is authorised during this ticketing session.

### Specification

[CAR-150: approved MVP specification](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner); canonical repository path after #0: docs/mvp-spec.md. Tracking: Linear.

---

## CAR-171 — #20 — Configure the free Supabase deployment and operational checks

[Live issue](https://linear.app/radical-creation/issue/CAR-171/20-configure-the-free-supabase-deployment-and-operational-checks)

Milestone: Model evals and free-tier pilot readiness

Blocked by: CAR-170, CAR-167

### What to build

Make deployment reproducible for one free EU-region Supabase project without paid infrastructure.

### Components owned

Deployment configuration, migrations, secrets and runbook. Scope changes to this behaviour; do not revert others' work.

### Acceptance criteria

- [ ] Apply migrations/functions/queues/cron through documented commands; secrets remain outside git.
- [ ] Authenticate Telegram and internal scheduled consumers; inspect hosted permissions/user isolation.
- [ ] Operational logs show task state, failures, queue age and delivery outcomes without personal payloads.
- [ ] Document rollback, manual recovery and failed-task inspection; ordinary tests never deploy or migrate hosted resources.
- [ ] Do not create paid resources; execute live deployment only within authorised project credentials and scope.

### How to verify

Validate configuration locally; then explicit hosted smoke check and permissions tests, recording project/region without secrets.

### Dependencies and overlap

<issue id="791d53c0-f957-4c95-9ad3-9a95422da8a9" label="CAR-167" href="https://linear.app/radical-creation/issue/CAR-167/16-implement-settings-pause-and-complete-user-deletion" />, <issue id="eab25d37-52a4-4784-ab7b-18c4b4755385" label="CAR-170" href="https://linear.app/radical-creation/issue/CAR-170/19-benchmark-free-tier-execution-and-recovery" /> provide required contracts/state or protect shared schema/workflow edits. Milestone ordering alone is not a blocker.

### Definition of done

- [ ] Behaviour-first TDD: red → green → refactor; appropriate unit/integration coverage and scoped validation.
- [ ] Fixtures/mocked external boundaries only in code-level tests. No runtime mock mode or fabricated live fallback. Offline CI requires no credentials; live checks/evals are explicit and quota-bounded.
- [ ] Formatting, lint, typecheck and relevant tests pass. Inspect git status/staged diff, exclude sensitive/unrelated data, commit descriptively.
- [ ] One codex/<ticket-id>-<short-description> branch and reviewable PR; valid feedback/conflicts addressed.
- [ ] Independent external approval applies to current head; checks green and blocking threads resolved before verified agent merge. No auto-merge, bypass or self-approval.

No implementation is authorised during this ticketing session.

### Specification

[CAR-150: approved MVP specification](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner); canonical repository path after #0: docs/mvp-spec.md. Tracking: Linear.

---

## CAR-172 — #21 — Complete the real Telegram/BEA/Gemini pilot acceptance journey

[Live issue](https://linear.app/radical-creation/issue/CAR-172/21-complete-the-real-telegrambeagemini-pilot-acceptance-journey)

Milestone: Model evals and free-tier pilot readiness

Blocked by: CAR-171

### What to build

Run controlled live end-to-end pilot acceptance with actual integrations, no runtime mock mode.

### Components owned

Pilot acceptance evidence and release checklist. Scope changes to this behaviour; do not revert others' work.

### Acceptance criteria

- [ ] Complete onboarding, BEA confirmation, targets, weekly proposal, acceptance and shopping list.
- [ ] Verify real morning/meal delivery, snooze, swap, pause and deletion.
- [ ] Record real price provenance and unknown-stock presentation.
- [ ] Recover one interrupted planning stage and one delivery failure.
- [ ] Deterministic checks and live eval gates pass; capture remaining free-tier and ICA limitations before inviting users.

### How to verify

Use dedicated consenting pilot account with controlled test schedules; record results without private conversations or tokens. No broad invitations before checklist passes.

### Dependencies and overlap

<issue id="c130d7ff-9349-46d2-ae9f-f2e79ad0f123" label="CAR-171" href="https://linear.app/radical-creation/issue/CAR-171/20-configure-the-free-supabase-deployment-and-operational-checks" /> provide required contracts/state or protect shared schema/workflow edits. Milestone ordering alone is not a blocker.

### Definition of done

- [ ] Behaviour-first TDD: red → green → refactor; appropriate unit/integration coverage and scoped validation.
- [ ] Fixtures/mocked external boundaries only in code-level tests. No runtime mock mode or fabricated live fallback. Offline CI requires no credentials; live checks/evals are explicit and quota-bounded.
- [ ] Formatting, lint, typecheck and relevant tests pass. Inspect git status/staged diff, exclude sensitive/unrelated data, commit descriptively.
- [ ] One codex/<ticket-id>-<short-description> branch and reviewable PR; valid feedback/conflicts addressed.
- [ ] Independent external approval applies to current head; checks green and blocking threads resolved before verified agent merge. No auto-merge, bypass or self-approval.

No implementation is authorised during this ticketing session.

### Specification

[CAR-150: approved MVP specification](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner); canonical repository path after #0: docs/mvp-spec.md. Tracking: Linear.

---
