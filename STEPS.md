# Spec-Driven Development: steps

You will build an **expense splitter** from an empty folder: a small web app where a
group adds what each person paid and sees who owes whom. You don't write the code by
hand. You write the rules, the spec and the plan, and an AI coding agent builds from them.

Work through the steps in order. Each step ends at a branch with that step already done.
If you fall behind, jump to it:

```bash
git stash                  # set your own attempt aside (git stash pop brings it back)
git checkout step-<k>  # carry on from the end of step k
```

## Before you start

1. Open this repo in a codespace (the button in `README.md`) and wait for the setup to finish.
2. In the terminal, run `specify --help`. A list of commands means you are ready.
3. Pick your AI agent. Both are already installed in the codespace:

   | Agent | Cost | Sign in |
   |---|---|---|
   | **Copilot Chat** (default) | Copilot Free: a monthly allowance of AI use, enough for this session if you have not used it up this month | Your GitHub account |
   | **Kilo Code** (if you are out of Copilot requests) | Free models, no card | A free Kilo account; pick a model marked **Free** |

   The steps say "Copilot Chat" and write commands Copilot's way. With another agent, send the same messages in its chat, writing each command the way the table below shows.

### Command names by agent

Spec Kit gives every agent the same commands, but agents spell them differently. Find yours, then read every `/speckit-…` in these steps that way.

| Agent | How to write a command | Spec Kit key (for `specify init` / `specify integration install`) |
|---|---|---|
| **Copilot** (VS Code chat) | `/speckit-plan` | `copilot` |
| **Kilo Code** | `/speckit.plan` | `kilocode` |
| Claude Code | `/speckit-plan` | `claude` |
| Cursor | `/speckit-plan` | `cursor-agent` |
| OpenCode | `/speckit.plan` | `opencode` |
| Kiro CLI | `/speckit.plan` | `kiro-cli` |
| Codex CLI | `$speckit-plan` (Codex starts skills with `$`) | `codex` |

The codespace has Copilot and Kilo Code set up from step 1. On your own laptop with a different agent, use its key in step 1: `specify init --here --integration <key> --script sh`. `specify check` lists every agent Spec Kit supports.

**You should now see:** the `specify` command list, and your agent's chat ready for a message.

### How every step works

You never write the spec, the plan or the tasks by hand. Each step is a message you send in your agent's chat:

| You send | You add | The agent writes | Then you |
|---|---|---|---|
| `/speckit-constitution` | Your rules, in plain words | `constitution.md` | Delete what you did not ask for |
| `/speckit-specify` | The feature, in plain words | `spec.md` | Answer its questions, fix what is wrong |
| `/speckit-plan` | Your tech choices | `plan.md` and its companions | Read its Constitution Check yourself |
| `/speckit-tasks` | Nothing | `tasks.md` | Check the order; cut extras |
| `/speckit-implement` | How far to go | The code and tests | Run the tests |
| `/speckit-converge` | Nothing | New tasks for any gaps | Implement them; run it again |

Reviewing what the agent wrote is your job, and it is the part that matters. You never name the spec either: Spec Kit works on the feature you are on.

## Step 1: Set up Spec Kit and write the rules

1. In the terminal, run `specify init --here --integration copilot --script sh`. Answer **y** when it asks to merge into the current folder.
2. Add Kilo Code as a second agent, so you can switch if Copilot runs out: `specify integration install kilocode --force`. It warns that Copilot was not built to share; that is expected, and Copilot stays the default.
3. Look at what appeared: `.specify/` holds the templates and the constitution; `.github/skills/` (Copilot) and `.kilo/commands/` (Kilo Code) hold the commands each agent can now run.
4. Open Copilot Chat, switch it to **Agent**, and send:

   ```text
   /speckit-constitution Three rules for an expense splitter.
   1. Test first: every behaviour starts as a failing Vitest test.
   2. Money is whole cents: never decimals; leftover cents go by a stated rule, so shares add up to the exact total.
   3. One small app: one process, server-rendered pages, TypeScript with Hono and JSX, one SQLite file, no client-side framework.
   ```

5. Open `.specify/memory/constitution.md` and read it. Delete anything you did not ask for.

Why rule I matters: Spec Kit treats tests as optional. Without a test-first rule, `tasks.md` may contain no tests at all.

**You should now see:** a constitution with exactly three principles, each one something a plan can be checked against.

Branch: `step-1`

## Step 2: Write the spec

1. In Copilot Chat (Agent), send:

   ```text
   /speckit-specify An expense splitter for a group of friends. Anyone can create a group and add the people in it. Members record what they paid and who it was for; each expense is split equally between the people it was for. A balances page shows, for every member, how much they are owed or owe.
   ```

2. Open `specs/001-expense-splitter/spec.md`. The agent may ask you up to three questions marked **NEEDS CLARIFICATION**. Answer each one in the chat. If it asks who gets the leftover cent when an amount does not divide evenly, answer: *one extra cent each, in the order people joined the group*.
3. **Spec clinic.** Which of these two acceptance scenarios can an agent be held to?

   - **A:** Given Asha paid 90.00 for Asha, Ben and Chen, when the balances page is opened, then Asha is owed 60.00 and Ben and Chen each owe 30.00.
   - **B:** Given a group with expenses, when a member opens the balances page, then they can easily see who owes what.

   B cannot be tested: nothing says what "easily" means. Find any scenario like B in your spec and rewrite it with real figures, like A.

Starting from only a vague idea on your own project? After `/speckit-specify`, send `/speckit-clarify`. It asks up to five questions and writes your answers into the spec.

**You should now see:** a spec with three user stories, no **NEEDS CLARIFICATION** markers left, and every acceptance scenario stating the exact figure it expects.

Branch: `step-2`

## Step 3: Plan how to build it

1. In Copilot Chat (Agent), send this. The last line is a teammate's suggestion, and it is a bad one on purpose:

   ```text
   /speckit-plan TypeScript on Node 24. Hono with JSX pages, served by @hono/node-server. SQLite through Node's built-in node:sqlite. Vitest for tests.
   Pico CSS from its CDN for the look: a header bar, each section in a card. Expenses as a table with one column per person; every amount with the currency sign.
   Store amounts as decimal numbers in REAL columns, so they read like the amounts people type.
   ```

2. Open `specs/001-expense-splitter/plan.md` and find the **Constitution Check** table.
3. **Predict before you read it:** which of your three rules does the last line break?
4. If the plan says it passes, the agent missed it. Either way, send:

   ```text
   Rule II says money is whole cents. Change the plan to store and calculate every amount as whole cents in INTEGER columns, and re-run the Constitution Check.
   ```

5. Skim what else the plan made: `research.md` (each decision and what was rejected), `data-model.md` (the tables and the split rule), `contracts/pages.md` (every page and form) and `quickstart.md`.

**You should now see:** a plan whose Constitution Check passes all three rules, with every amount in whole cents.

What this step teaches: the Constitution Check is the agent grading its own plan. Nothing in Spec Kit blocks a broken rule. Three ways to make a rule stick, weakest to strongest:

| How | Blocks a break? |
|---|---|
| Read the check yourself, against what the plan actually says | Only if you read it |
| After step 4, send `/speckit-analyze`: a second pass that marks any rule break as critical | It reports; it never stops you |
| A test for the rule, such as 1000 cents split three ways is 334, 333 and 333 | **Yes, every time** |

Branch: `step-3`

## Step 4: Break the plan into tasks

1. In Copilot Chat (Agent), send `/speckit-tasks`.
2. Open `specs/001-expense-splitter/tasks.md`. The tasks are grouped by user story, in the spec's priority order.
3. Make your two checks before you build:
   - **Test before code:** in each story, does a test task come before its code task? In the `step-4` branch's `tasks.md`, T011 writes the failing test for `splitEqually` and T012 writes the code until T011 passes; your numbers may differ. Rule I says every story works this way. Move or add a test task wherever it does not.
   - **Nothing extra:** cut any task no user story or requirement asked for. Extras are where bugs hide.

**You should now see:** about 20 tasks in phases (setup, foundation, one phase per user story, polish), and in every story a test task comes before the code task it proves.

Branch: `step-4`

## Step 5: Build it

1. In Copilot Chat (Agent), send:

   ```text
   /speckit-implement Phases 1 to 3 only: setup, foundation and User Story 1. Write each test first and run it to see it fail.
   ```

2. Watch the agent tick tasks off in `tasks.md`. Approve the commands it asks to run. You do not name the spec: implement works on the current feature, `001-expense-splitter`.
3. When it stops, run `npm test` yourself rather than taking the agent's word that everything passed. Then `npm run dev`. Codespaces opens the app in a new tab. Create a group and add three people.
4. The rest of the tasks take longer than the session allows. Jump to the finished app to see all three stories working:

   ```bash
   git stash
   git checkout step-5
   npm install
   npm test
   npm run dev
   ```

5. In the app, follow `specs/001-expense-splitter/quickstart.md`: Dinner, then Taxi, then Balances.

**You should now see:** 25 passing tests, and on the balances page: Asha is owed 56.66, Ben owes 23.33, Chen owes 33.33. Those are the spec's own numbers.

Branch: `step-5`

## Step 6: The requirement changes

The group comes back: *"Asha stayed two nights, and Chen paid the hotel. Can an expense be split by shares, not only equally?"*
Change the spec first, then the plan, then the code. Never the code first.

These are five messages, sent one at a time. No command runs them all.

1. Change the spec. This one is a plain chat message, not `/speckit-specify`: specify would start a second, separate feature folder. In Copilot Chat (Agent), send:

   ```text
   Update specs/001-expense-splitter/spec.md, and nothing else: add a user story for splitting an expense by shares. Each person gets a whole number of shares, 0 or more; leftover cents follow the same rule as an equal split. An equal split is 1 share each. Example: Hotel, 100.00, paid by Chen, shares Asha 2, Ben 1, Chen 1 gives 50.00, 25.00, 25.00.
   ```

   Read the new user story. Every acceptance scenario should state exact figures, as in the spec clinic.
2. Re-plan: send `/speckit-plan Re-plan for split by shares.` and check the Constitution Check still passes rule II.
3. Find the gap: send `/speckit-converge`. It compares the code with the spec and plan, and adds a **Convergence** phase of new tasks to `tasks.md`. It does not change any code. (Not `/speckit-tasks`, which would rewrite the whole list.)
4. Build the new tasks: send `/speckit-implement`, then run `npm test`.
5. Send `/speckit-converge` again. When the code matches the spec, it reports **Converged**. If it finds another gap, implement and converge once more.

To jump to the finished version: `git stash`, `git checkout step-6`, `npm install`, `npm run dev`. Record the hotel by shares and check the balances.

**You should now see:** User Story 4 in the spec, a Phase 7: Convergence in `tasks.md` with every task ticked, 37 passing tests, and the hotel split 50.00, 25.00, 25.00.

Branch: `step-6`

## What's next

- **Practice:** add a second feature, **settle up**, which suggests the fewest payments that clear every balance. It is a new feature, so start a new spec: `/speckit-specify` makes `specs/002-settle-up/`. Then go round the same loop: plan, tasks, implement, converge.
- **More practice:** edit or delete an expense. The spec never asked for either, so the app has neither. Add them to the spec first, then the same loop.
- **Your own app:** [`take-home/YOUR-OWN-PROJECT.md`](take-home/YOUR-OWN-PROJECT.md) walks through the same loop on a project of yours, new or existing.
- **When to bother:** [`take-home/decision-card.md`](take-home/decision-card.md) says when a spec is worth it. Fill in "My rule" for your own team.
