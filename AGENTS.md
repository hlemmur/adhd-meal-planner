# ADHD Meal Planner

## SDLC tracking

- Tracking: Linear
- Team: Radical Creation Dev. Project: ADHD Meal Planner. Parent: CAR-150.
- Canonical product spec: `docs/mvp-spec.md`; root `MVP_PLAN.md` is historical reference.
- Task snapshot: `docs/implementation-tasks.md`; refresh the live ticket before work.

## Delivery

- One ready issue, isolated `codex/<ticket-id>-<short-description>` branch and PR at a time.
- Follow TDD for behaviour changes and add appropriate deterministic tests.
- Application integrations are real. Fixtures/mocks are for code-level tests only; no runtime mock mode or fabricated fallback.
- Run `npm run check`, inspect `git status --short` and staged changes, then commit intended changes descriptively. Preserve unrelated work.
- Keep credentials, personal data and real environment files out of this public repository.
- Never deploy or invoke live integrations implicitly from tests or checks.
- Push without force. Merge only after independent external current-head approval, green required checks, no conflicts and resolved blocking threads. Never enable auto-merge or bypass protection.
- Do not start another task while this task's PR remains open.

## Commands

- `npm ci`: pinned local Deno and Supabase CLI (Node 22+).
- `npm run check`: format, lint, typecheck and deterministic tests; no network/credentials.
- `npm run local:start`: real local Supabase via Docker.
- `npm run local:serve`: local health function.
- `npm run smoke:local`: probe only the fixed localhost endpoint.
- Read README before loading secrets or working with hosted resources.
