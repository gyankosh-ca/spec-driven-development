---

description: "Task list for the expense splitter"
---

# Tasks: Expense Splitter

**Input**: Design documents from `/specs/001-expense-splitter/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/pages.md

**Tests**: Required by Constitution I. In every story the test task comes first and must fail before the code task after it.

**Organization**: Grouped by user story, so each story can be built and tested on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Phase 1: Setup

- [X] T001 Create `package.json` (type module, Node 24) with scripts `dev` (`tsx watch src/server.ts`), `test` (`vitest run`) and `typecheck` (`tsc --noEmit`); add hono, @hono/node-server, and dev dependencies typescript, tsx, vitest, @types/node
- [X] T002 [P] Create `tsconfig.json` with strict mode and `"jsx": "react-jsx"`, `"jsxImportSource": "hono/jsx"`
- [X] T003 [P] Add `data/` to `.gitignore`

---

## Phase 2: Foundational (blocks every story)

- [X] T004 Write failing tests in `tests/money.test.ts`: `parseAmount("10.05")` is 1005, `"90"` is 9000, `"10.005"`, `"0"`, `"-5"` and `"abc"` are refused with the spec's messages; `formatCents(1005)` is `"10.05"`
- [X] T005 Implement `parseAmount` and `formatCents` in `src/money.ts` (digits only, never `parseFloat`) until T004 passes
- [X] T006 Create `src/db.ts`: `openDb(path)` with `node:sqlite`, creating the four tables in `data-model.md` (`:memory:` in tests)
- [X] T007 Create `src/views/Layout.tsx` (Pico CSS linked from its CDN, a header bar, a main container) and `src/server.ts` (port 3000, database at `data/splitter.db`)

**Checkpoint**: `npm test` passes; `npm run dev` serves an empty page.

---

## Phase 3: User Story 1 - Start a group (P1) 🎯 MVP

**Goal**: create a group with a currency and add members.

**Independent Test**: create "Lisbon trip" in EUR, add Asha, Ben and Chen, see them in that order.

- [X] T008 [US1] Write failing tests in `tests/app.test.ts` for US1 scenarios 1–3, through `app.request()`
- [X] T009 [US1] Implement `createGroup`, `getGroup`, `listGroups`, `addMember`, `listMembers` in `src/store.ts`; duplicate names refused ignoring case
- [X] T010 [US1] Implement `GET /`, `POST /groups`, `GET /groups/:id`, `POST /groups/:id/members` in `src/app.tsx` with `src/views/HomePage.tsx` and `src/views/GroupPage.tsx`, until T008 passes

**Checkpoint**: User Story 1 works on its own.

---

## Phase 4: User Story 2 - Record an expense (P2)

**Goal**: record an expense split equally, with leftover cents by joining order.

**Independent Test**: "Dinner" 90.00 for three gives 30.00 each; "Taxi" 10.00 gives 3.34, 3.33, 3.33.

- [X] T011 [P] [US2] Write failing tests in `tests/money.test.ts` for `splitEqually`: 9000 over 3 is 3000 each; 1000 over 3 is 334, 333, 333; 1 over 3 is 1, 0, 0; the shares always add up to the amount
- [X] T012 [US2] Implement `splitEqually(amountCents, memberIds)` in `src/money.ts` until T011 passes
- [X] T013 [US2] Write failing tests in `tests/app.test.ts` for US2 scenarios 1–4
- [X] T014 [US2] Implement `addExpense` and `listExpenses` (with shares) in `src/store.ts`, saving shares from `splitEqually`
- [X] T015 [US2] Implement `POST /groups/:id/expenses` and, in `src/views/GroupPage.tsx`, the expense table (one column per member, a total row) and form, until T013 passes

**Checkpoint**: User Stories 1 and 2 work.

---

## Phase 5: User Story 3 - See who owes whom (P3)

**Goal**: a balances page per group that always adds up to zero.

**Independent Test**: with "Dinner" and "Taxi", Asha is owed 56.66, Ben owes 23.33, Chen owes 33.33.

- [X] T016 [P] [US3] Write failing tests in `tests/balances.test.ts` for `computeBalances`: the two worked examples, no expenses gives zeros, and a 50-expense random group sums to exactly 0
- [X] T017 [US3] Implement `computeBalances(members, expenses)` in `src/balances.ts` until T016 passes
- [X] T018 [US3] Write failing tests in `tests/app.test.ts` for US3 scenarios 1–4
- [X] T019 [US3] Implement `GET /groups/:id/balances` with `src/views/BalancesPage.tsx` (paid, share and balance per member), until T018 passes

**Checkpoint**: all three stories work.

---

## Phase 6: Polish

- [X] T020 Write failing tests for removing a member (FR-007): allowed with no expenses; refused with "Ben is in 2 expenses, so can't be removed"
- [X] T021 Implement `removeMember` and `POST /groups/:id/members/:memberId/remove`, until T020 passes
- [X] T022 Run `npm run typecheck` and `npm test`; walk through `quickstart.md` in the browser

## Dependencies

- Setup → Foundational → US1 → US2 → US3 → Polish. US2 needs members; US3 needs expenses.
- Inside a story: test task, then the code that makes it pass.

## Parallel examples

- T002 and T003 together.
- T011 (money tests) alongside T013 (route tests); T016 alongside T018.

## Implementation strategy

MVP is User Story 1. Then add one story at a time, each ending with `npm test` green.

---

## Phase 7: Convergence

- [X] T023 Write failing tests for `splitByShares` in `tests/money.test.ts`: Hotel 100.00 by 2, 1, 1 and Wine 10.00 by 2, 1, 0, per US4/AC1–AC2 (missing)
- [X] T024 Implement `splitByShares` in `src/money.ts` and make `splitEqually` call it with 1 share each, per FR-004 (missing)
- [X] T025 Add the `units` column to `shares` in `src/db.ts`, adding it with default 1 to an existing database, per plan: data model (missing)
- [X] T026 Write failing route tests for US4/AC1–AC5 in `tests/app.test.ts` (missing)
- [X] T027 Accept `split` and `shares_<memberId>` in `POST /groups/:id/expenses` and `addExpense`, refusing all-zero and non-whole shares, per US4/AC3–AC4 and FR-009 (missing)
- [X] T028 Add the "split equally / split by shares" choice to the expense form in `src/views/GroupPage.tsx`, per FR-009 (missing)
