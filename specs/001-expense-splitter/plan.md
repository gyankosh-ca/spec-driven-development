# Implementation Plan: Expense Splitter

**Branch**: `001-expense-splitter` | **Date**: 2026-10-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-expense-splitter/spec.md`

## Summary

A small web app where a group records shared expenses and sees balances. One Node
process serves HTML pages built on the server with Hono and JSX; forms post back to the
server, which saves to one SQLite file. All money is held as whole cents. The split and
balance rules live in plain functions with no web or database code, so Vitest can test
every acceptance scenario directly.

## Technical Context

**Language/Version**: TypeScript on Node.js 24

**Primary Dependencies**: Hono (routing and JSX pages), @hono/node-server (serves it on Node)

**Styling**: Pico CSS, one stylesheet linked from its CDN in the layout; no build step. A header bar, each section in a card

**Storage**: SQLite through Node's built-in `node:sqlite` module, one file at `data/splitter.db`

**Testing**: Vitest; route tests call the app in memory with `app.request()`, no browser

**Target Platform**: Linux (GitHub Codespaces), opened in a browser tab on port 3000

**Project Type**: Web application, server-rendered, single project

**Performance Goals**: Pages render in under 100 ms for a group of 20 members and 500 expenses

**Constraints**: No client-side JavaScript; amounts exact to the cent and shown with the group's currency sign

**Scale/Scope**: One group of friends at a time; 4 pages, about 15 source files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | How this plan meets it | Result |
|---|---|---|
| I. Test First | Every task in `tasks.md` starts with a failing Vitest test; `npm test` runs them all | ✅ Pass |
| II. Money Is Whole Cents | Amounts are parsed from text straight into whole cents and stored in `INTEGER` columns. The equal split uses whole-cent division and hands out the leftover cents in joining order, as the spec says | ✅ Pass |
| III. One Small App | One process, server-rendered JSX, one SQLite file. Two dependencies, both named above with the problem they solve; SQLite needs none, because Node has it built in. Pico CSS is a stylesheet link, not a framework: no client-side code | ✅ Pass |

Re-checked after Phase 1 design: still passes.

## Project Structure

### Documentation (this feature)

```text
specs/001-expense-splitter/
├── plan.md              # This file
├── research.md          # Phase 0: decisions and alternatives
├── data-model.md        # Phase 1: tables and rules
├── quickstart.md        # Phase 1: how to run and check it
├── contracts/
│   └── pages.md         # Phase 1: every page and form
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── money.ts             # parse "10.05" → 1005, format 1005 → "10.05", split equally
├── balances.ts          # balance per member from expenses and shares
├── db.ts                # open the SQLite file, create tables
├── store.ts             # groups, members, expenses: read and write
├── app.tsx              # Hono routes
├── server.ts            # starts the app on port 3000
└── views/
    ├── Layout.tsx
    ├── HomePage.tsx     # list groups, create a group
    ├── GroupPage.tsx    # members, add member, expenses, add expense
    └── BalancesPage.tsx

tests/
├── money.test.ts
├── balances.test.ts
└── app.test.ts          # one test per acceptance scenario, through the routes
```

**Structure Decision**: single project. The rules (`money.ts`, `balances.ts`) know nothing
about the web or the database, so they are tested directly; `app.test.ts` proves the
pages and forms against an in-memory database.

## Complexity Tracking

No violations.
