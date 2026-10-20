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
   | **Copilot Chat** (default) | Copilot Free is enough: about 50 chat requests a month, and this session uses 10 to 15 | Your GitHub account |
   | **Kilo Code** (if you are out of Copilot requests) | Free models, no card | A free Kilo account; pick a model marked **Free** |

   The steps say "Copilot Chat". With Kilo Code, send the same messages in its panel, with **a dot instead of the first dash** in each command: `/speckit.plan`, not `/speckit-plan`.

**You should now see:** the `specify` command list, and your agent's chat ready for a message.

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

**You should now see:** a spec with three user stories, no **NEEDS CLARIFICATION** markers left, and every acceptance scenario stating the exact figure it expects.

Branch: `step-2`

## Step 3: Plan how to build it

1. In Copilot Chat (Agent), send this. The last line is a teammate's suggestion, and it is a bad one on purpose:

   ```text
   /speckit-plan TypeScript on Node 24. Hono with JSX pages, served by @hono/node-server. SQLite through Node's built-in node:sqlite. Vitest for tests.
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

Branch: `step-3`

## Step 4: Break the plan into tasks

1. In Copilot Chat (Agent), send `/speckit-tasks`.
2. Open `specs/001-expense-splitter/tasks.md`. The tasks are grouped by user story, in the spec's priority order.
3. Check each story's tasks: **does the first one write a test?** Rule I says it must. Move or add a test task wherever it does not.
4. Cut anything the spec never asked for. If it is not in a user story or a requirement, it does not belong.

**You should now see:** about 20 tasks in phases (setup, foundation, one phase per user story, polish), and in every story a test task comes before the code task it proves.

Branch: `step-4`

## Step 5: Build it

1. In Copilot Chat (Agent), send:

   ```text
   /speckit-implement Phases 1 to 3 only: setup, foundation and User Story 1. Write each test first and run it to see it fail.
   ```

2. Watch the agent tick tasks off in `tasks.md`. Approve the commands it asks to run.
3. When it stops, run `npm test`, then `npm run dev`. Codespaces opens the app in a new tab. Create a group and add three people.
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

The group comes back: *"Chen stayed two nights. Can an expense be split by shares, not only equally?"*
Change the spec first, then the plan, then the code. Never the code first.

1. Change the spec. In Copilot Chat (Agent), send:

   ```text
   Update specs/001-expense-splitter/spec.md, and nothing else: add a user story for splitting an expense by shares. Each person gets a whole number of shares, 0 or more; leftover cents follow the same rule as an equal split. An equal split is 1 share each. Example: Hotel, 100.00, paid by Chen, shares Asha 2, Ben 1, Chen 1 gives 50.00, 25.00, 25.00.
   ```

   Read the new user story. Every acceptance scenario should state exact figures, as in the spec clinic.
2. Re-plan: send `/speckit-plan Re-plan for split by shares.` and check the Constitution Check still passes rule II.
3. Find the gap: send `/speckit-converge`. It compares the code with the spec and plan, and adds a **Convergence** phase of new tasks to `tasks.md`. It does not change any code.
4. Build the new tasks: send `/speckit-implement`, then run `npm test`.
5. Send `/speckit-converge` again. When the code matches the spec, it reports **Converged**.

To jump to the finished version: `git stash`, `git checkout step-6`, `npm install`, `npm run dev`. Record the hotel by shares and check the balances.

**You should now see:** User Story 4 in the spec, a Phase 7: Convergence in `tasks.md` with every task ticked, 37 passing tests, and the hotel split 50.00, 25.00, 25.00.

Branch: `step-6`

## What's next

On your own: add a second feature, **settle up**, which suggests the fewest payments that clear every balance. It is a new feature, so start a new spec: `/speckit-specify` makes `specs/002-settle-up/`. Then go round the same loop: plan, tasks, implement, converge.
