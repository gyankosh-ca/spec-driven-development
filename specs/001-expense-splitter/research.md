# Research: Expense Splitter

## Money representation

- **Decision**: whole cents in `INTEGER` columns and `number` values that are always integers. Text such as "10.05" is parsed by its digits, never through `parseFloat`.
- **Rationale**: Constitution II. `0.1 + 0.2` is `0.30000000000000004` in JavaScript; whole cents never round.
- **Alternatives considered**: decimal numbers in `REAL` columns (breaks Constitution II and the spec's "adds up to the exact total"); a decimal library (a dependency for a problem integers already solve).

## Leftover cents

- **Decision**: `amount ÷ people` in whole cents; the remainder `r` goes one cent each to the first `r` people, ordered by when they joined the group.
- **Rationale**: the spec's clarification. Deterministic, so a test can state the exact shares.
- **Alternatives considered**: the payer absorbs the difference (not what the spec says); random assignment (cannot be tested).

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
