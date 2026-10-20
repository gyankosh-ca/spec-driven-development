# Research: Expense Splitter

## Money representation

- **Decision**: whole cents in `INTEGER` columns and `number` values that are always integers. Text such as "10.05" is parsed by its digits, never through `parseFloat`.
- **Rationale**: Constitution II. `0.1 + 0.2` is `0.30000000000000004` in JavaScript; whole cents never round.
- **Alternatives considered**: decimal numbers in `REAL` columns (breaks Constitution II and the spec's "adds up to the exact total"); a decimal library (a dependency for a problem integers already solve).

## Leftover cents

- **Decision**: `amount ÷ people` in whole cents; the remainder `r` goes one cent each to the first `r` people, ordered by when they joined the group.
- **Rationale**: the spec's clarification. Deterministic, so a test can state the exact shares.
- **Alternatives considered**: the payer absorbs the difference (not what the spec says); random assignment (cannot be tested).

## Split by shares (re-plan, 2026-10-20)

- **Decision**: one function, `splitByShares(amountCents, sharesByMember)`: each part is `floor(amount × shares ÷ totalShares)`, and the leftover cents go one each, in joining order, to members with a share above zero. `splitEqually` becomes 1 share each, so the existing tests prove nothing changed for equal splits. The share counts are saved in a new `units` column on `shares`.
- **Rationale**: Constitution II (whole cents, one stated leftover rule) and III (no new dependency; one rule instead of two).
- **Alternatives considered**: a separate algorithm per split type (two leftover rules to keep in step); storing percentages (decimals, which break Constitution II).

## Web framework and pages

- **Decision**: Hono with its JSX renderer, served by `@hono/node-server`. Plain HTML forms that post and redirect.
- **Rationale**: Constitution III: one process, no client-side framework. Hono's `app.request()` lets tests call routes without starting a server.
- **Alternatives considered**: Express with templates (no typed JSX, more setup); React front end (a second project and a build step).

## Database

- **Decision**: Node's built-in `node:sqlite` (`DatabaseSync`), one file at `data/splitter.db`; tests use `:memory:`.
- **Rationale**: no dependency to install or compile, which Constitution III asks for.
- **Alternatives considered**: `better-sqlite3` (a native module to build); an ORM (more than four tables need).

## Running TypeScript

- **Decision**: `tsx` runs `src/server.ts` in development; Vitest runs the tests; `tsc --noEmit` checks types.
- **Rationale**: no build step beyond TypeScript itself.
- **Alternatives considered**: compiling to `dist/` first (a build step the session does not need).
