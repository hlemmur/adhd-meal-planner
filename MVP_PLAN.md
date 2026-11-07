# MVP: ADHD-aware Telegram Meal Planner

Reference copy of the full approved Supabase MVP plan from this chat.

**Subsequent clarification:** There is no runtime mock mode. Mock data and mocked external boundaries are for code-level tests only. The application's integrations are real. This clarification supersedes the local mock-adapter wording preserved below.

Implementation breakdown: [CAR-150 — MVP: ADHD-aware Telegram Meal Planner](https://linear.app/radical-creation/issue/CAR-150/mvp-adhd-aware-telegram-meal-planner), in the ADHD Meal Planner project under Radical Creation Dev. The repository destination selected subsequently is a **public** `adhd-meal-planner` repository under the authenticated personal GitHub account. This file is a reference; no implementation is implied by its creation.

## Summary

Build an English-language Telegram bot for a small invited pilot of adults, each planning for one person.

Use **TypeScript, Supabase Free, and Gemini Flash’s free API quota**. Supabase hosts the application workflow, database, scheduled jobs, and queues; Google hosts the model. No continuously running server or paid infrastructure is required.

Launch with **ICA Kvantum BEA Livsmedel only**, maintenance nutrition goals, and fresh daily cooking. Prioritise delicious, varied meals with manageable preparation.

## Product behaviour

### Resumable onboarding

Ask one question per message, usually offering four or five choices. Support multi-select with **Done**, free-text corrections, **Back**, and **Pause**. Save progress after each answer.

Collect:

- Adult eligibility, consent, timezone, and reminder preferences.
- Preferred ICA store by name/location. Show BEA’s verified name and address for confirmation; explain that other stores are unsupported during the pilot.
- Optional gender identity; separately explain the sex parameter used for the energy equation. Collect age, height, weight, and activity level.
- Allergies, dietary exclusions, weekly maximum budget, shopping day/time, kitchen equipment, and cooking-time tolerance.
- Preferences through short rounds covering proteins, vegetables, carbohydrates, cuisines, spice, textures, and example meals.
- Pantry quantities through a suggested checklist.

Support maintenance goals only. Pregnancy, breastfeeding, minors, and condition-specific nutrition are outside automated nutrition planning in this MVP.

### Plans and reminders

- On the selected shopping day, propose seven days of breakfast, lunch, and dinner, starting that day.
- Include recipes, portions, calculated nutrition, and a categorised grocery list with full-pack quantities.
- Show estimated cart cost, remaining budget, price confidence, and offer conditions.
- Offer **Use this week**, **Change a meal**, and **Edit preferences**.
- Activate a proposed plan only after acceptance.
- Each morning, send the complete day’s plan and recipes in readable, numbered messages.
- At each meal time, send its recipe with **Start**, **Snooze**, **Swap**, and **Skip**.
- Support `/today`, `/week`, `/shopping`, `/settings`, `/pause`, and `/delete_me`.
- Accept preference corrections through ordinary conversation. Do not automatically compensate for skipped meals.

## Planning rules

### Nutrition

Calculate targets in application code using Mifflin–St Jeor and documented activity multipliers.

Defaults:

- Maintenance calories.
- Protein/fat/carbohydrate allocation: **20% / 30% / 50%** of energy.
- Breakfast/lunch/dinner allocation: **25% / 35% / 40%**.
- Daily calories and each macro: **±10%** tolerance.
- Each meal’s calories and macros: **±15%** of its allocation.

Use product nutrition labels where available, otherwise matched Livsmedelsverket records. Record provenance and distinguish raw, cooked, and edible quantities. Include oils, sauces, toppings, and planned drinks.

Recalculate and validate after every portion, recipe, ingredient, or profile change. Unresolved nutrition data prevents approval. Present all nutritional values as estimates.

### Taste, effort, and variety

- Default cooking-time limit: 25 minutes, adjustable during onboarding.
- No identical meals within the week.
- Target at least four preferred cuisine families weekly, where preferences permit.
- Vary main ingredients, methods, textures, and flavour profiles across adjacent meals.
- Lunch and dinner normally combine a main component, vegetables, and a sauce/dressing or contrasting garnish.
- Use three to five concise recipe steps with clear timings.
- Reuse ingredients across distinct dishes; do not impose the plugin’s ten-ingredient limit.
- Daily fresh cooking is the default; batch cooking and repeated leftovers are optional.
- Use four-week meal history to discourage recent repeats.
- Offer a validated low-energy alternative when requested.

### Budget and BEA data

- Target the cart at **80% or less** of the weekly maximum.
- Try cheaper compliant alternatives first. If necessary, automatically use the remaining margin, clearly showing this.
- Never approve a calculated cart above the absolute maximum.
- Cost full purchasable packs, including pantry replenishment.
- Deduct pantry stock only when the user confirms sufficient quantities.
- Apply offers only when quantity, membership, channel, purchase-limit, and validity conditions are met.
- Keep physical-store and online prices separate.

Store each observation’s source, store, timestamp, pack size, price basis, offer validity, and availability status.

Refresh before weekly publication. Treat observations older than 24 hours as stale unless explicit validity supports reuse. Missing prices use traceable conservative estimates, clearly labelled; Gemini never supplies retailer prices.

Availability is **available**, **unavailable**, or **unknown**. An advertised offer does not prove stock.

The pilot provides a **budget-checked estimated cart**, not guaranteed checkout prices or stock. If no compliant plan fits the maximum, explain the conflict and offer concrete changes instead of publishing an approved plan.

## Architecture and deployment

### Supabase Free

Use one hosted Supabase project in an available EU region:

| Component | Responsibility |
|---|---|
| TypeScript Edge Functions | Telegram webhook, onboarding, planning stages, validation, delivery |
| PostgreSQL | Profiles, preferences, products, nutrition, recipes, plan versions, schedules, delivery records |
| Supabase Cron | Find due reminders, weekly planning events, retries, and data refreshes |
| Supabase Queues | Durable planning and delivery tasks |
| Secrets and Vault | Telegram/Gemini credentials and authenticated scheduled invocations |

Use the included function endpoints; no custom domain is required.

The webhook authenticates Telegram requests, deduplicates updates, persists work, and responds promptly. Queue consumers execute bounded tasks. Cron invokes consumers and checks schedules approximately every minute.

Persist planning stages:

**Load profile → retrieve data → generate recipes → calculate nutrition/cart → validate → repair → publish proposal.**

Allow three generation/repair attempts. Save progress between stages so timeouts do not restart the whole workflow.

Use durable queue visibility timeouts, retry limits, failed-task records, and delivery deduplication. Accept that an ambiguous Telegram network failure can make perfect exactly-once delivery impossible; minimise duplicates through delivery records and reconciliation.

### Gemini and integrations

Use the official `@google/genai` SDK behind a replaceable `MealGenerator` interface.

- Pin a stable Flash model with free quota verified for the project before launch.
- Require structured output and independently validate it.
- Do not silently change models or enable paid fallback.
- Send nutritional targets rather than raw body measurements whenever possible.
- Cache accepted recipes and plans; reminders require no model calls.
- On quota exhaustion, defer generation and continue delivering saved plans.

Define replaceable `StoreProvider`, `NutritionProvider`, and `MessageTransport` interfaces. ICA collection uses public permitted access or an authorised integration, without authentication bypass.

Protect personal data through restricted database permissions, user isolation, minimal logs, deletion support, and secrets excluded from git.

### Free-tier operating constraints

Design stages below Supabase’s current free execution limits: **2 seconds active CPU per request and 150-second worker lifetime**. Benchmark parsing, calculations, and model response handling early.

Use retention limits for price history, queue archives, and operational logs to remain within free storage allowances. Schedule database exports to a developer-controlled backup location.

Free projects may pause after inactivity. Do not assume Cron prevents this or promise uninterrupted reminders. Document manual recovery, and suppress stale meal reminders after restoration.

Keep every provider on its free plan. When quotas are exhausted, fail gracefully rather than incur charges.

## Implementation and acceptance

Use Supabase CLI for local PostgreSQL, functions, and migrations, with deterministic mock ICA, nutrition, Gemini, and Telegram adapters.

Implement one vertical slice at a time using TDD:

1. Resumable onboarding and BEA confirmation.
2. Single-day nutrition calculation and validated recipes.
3. Seven-day variety, shopping quantities, and budget enforcement.
4. Plan acceptance, reminders, swaps, and preference updates.
5. Live integrations, free-tier benchmarks, and invited-pilot deployment.

Test through public interfaces:

- Interrupted onboarding, allergies, ambiguous stores, unsupported stores, and user isolation.
- Nutrition conversions, tolerance boundaries, portions, and substitutions.
- Pack rounding, multi-buy eligibility, expired offers, estimates, margin use, and infeasible budgets.
- Meal repetition, cuisine variation, and cooking-time constraints.
- Duplicate updates, retries, worker termination, stale plan versions, timezone changes, and daylight-saving transitions.
- Invalid model output, fabricated product references, API outages, quota exhaustion, project recovery, and deletion.

Before launch, complete a simulated seven-day experience locally, validate live BEA data coverage, and test scheduled delivery with a pilot Telegram account. All published plans must pass deterministic checks and identify uncertain prices or availability.

Use one focused branch per implementation slice, run relevant checks, and commit intended changes regularly. Require current independent external approval before merging. No Linear, billing, automated ordering, household planning, or additional retailers in this MVP.

## Subsequent tracking and evaluation decisions

The original plan’s “No Linear” sentence above was superseded by the explicit request to track this project in Linear. CAR-150 and its 22 child tasks are the implementation breakdown; no coding tasks have been executed.

Add basic model evals alongside deterministic code tests:

- Twenty synthetic fixed scenarios covering allergies/exclusions, tight budgets, equipment, cuisine and texture preferences, low energy, conflicting requests, and attempts to override constraints.
- An explicit, quota-bounded live runner records model ID, prompt version, case ID, timings, and code-validator results. Ordinary CI runs offline and requires no credentials.
- Weekly evaluation uses five representative profiles twice, producing ten attempts. Every published plan passes all hard rules; at least 80% of feasible runs produce publishable plans, while infeasible cases fail honestly.
- Human review scores clarity, likely appeal, flavour/texture variation, and effort on an anchored 1–5 rubric, targeting an average of at least 4 in each dimension. Automated evaluation does not prove taste.

Task #0 will establish the public GitHub repository, executable structure, README, CI and canonical `docs/mvp-spec.md`. This root file preserves the original approved full plan and records its explicitly superseding decisions for reference.
