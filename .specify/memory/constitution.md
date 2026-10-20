# Expense Splitter Constitution

## Core Principles

### I. Test First (NON-NEGOTIABLE)

Every behaviour starts as a failing test. A task that changes behaviour begins by
writing the test that proves it, sees it fail, then writes the code that makes it pass.
Tests run with Vitest, without a browser, and `npm test` passes on every commit.

### II. Money Is Whole Cents

Every amount is stored, calculated and compared as a whole number of cents. Decimal
or floating-point numbers never hold money. When an amount does not divide evenly,
the leftover cents are assigned by a stated rule, so every share adds back up to the
exact total.

### III. One Small App

One process, pages rendered on the server, one SQLite file. TypeScript with Hono and
JSX pages; no client-side framework and no build step beyond TypeScript. A new
dependency is added only when the plan names the problem it solves.

## Governance

This constitution outranks every spec, plan and task. A plan that breaks a principle
is fixed before any task is written. Changing a principle needs a written reason and a
version bump.

**Version**: 1.0.0 | **Ratified**: 2026-10-20 | **Last Amended**: 2026-10-20
