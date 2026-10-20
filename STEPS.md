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
3. Open the Copilot Chat panel and sign in with your GitHub account if it asks. Copilot Free is enough.

**You should now see:** the `specify` command list, and Copilot Chat ready for a message.

## Step 1: Set up Spec Kit and write the rules

1. In the terminal, run `specify init --here --integration copilot --script sh`. Answer **y** when it asks to merge into the current folder.
2. Look at what appeared: `.specify/` holds the templates and the constitution, and `.github/skills/` holds the `/speckit-…` commands Copilot can now run.
3. Open Copilot Chat, switch it to **Agent**, and send:

   ```text
   /speckit-constitution Three rules for an expense splitter.
   1. Test first: every behaviour starts as a failing Vitest test.
   2. Money is whole cents: never decimals; leftover cents go by a stated rule, so shares add up to the exact total.
   3. One small app: one process, server-rendered pages, TypeScript with Hono and JSX, one SQLite file, no client-side framework.
   ```

4. Open `.specify/memory/constitution.md` and read it. Delete anything you did not ask for.

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
