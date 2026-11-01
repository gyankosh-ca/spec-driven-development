# Try Kiro on the same feature

*Checked against kiro.dev, October 2026.*

Kiro is an editor from AWS with specs built in. Where Spec Kit adds commands to the
agent you already use, Kiro **is** the agent and the editor: you click to start a spec,
and it walks you through it. Build the same expense splitter in it, then decide which
way suits your team.

## How it maps to what you did

| In the session (Spec Kit) | In Kiro |
|---|---|
| `constitution.md`, your rules | Steering files, in `.kiro/steering/` |
| `/speckit-specify` → `spec.md` | Requirements → `requirements.md` |
| `/speckit-plan` → `plan.md` | Design → `design.md` |
| `/speckit-tasks` → `tasks.md` | Tasks → `tasks.md` |
| `/speckit-implement` | Run a task, or run them all |
| `/speckit-converge` | No match: change the spec, then update the tasks |

The three files live in `.kiro/specs/<feature>/`, Markdown in your repo, like Spec Kit's.

## What it costs

| Plan | Price | Credits a month |
|---|---|---|
| Free | USD 0 | 50 |
| Pro | USD 20 | 1,000 |

Free is enough to try one small feature. Current plans: [kiro.dev/pricing](https://kiro.dev/pricing/).

## Try it

1. Download Kiro from [kiro.dev](https://kiro.dev), install it and sign in.
2. Open an empty folder.
3. Add your three rules as steering: in the Kiro pane, under **Steering**, click **+**,
   choose this workspace, and paste the three rules from Step 1 of `STEPS.md`.
4. In the Kiro pane, under **Specs**, click **+**. Choose **Feature**, then
   **Requirements-First**, and paste the feature description from Step 2 of `STEPS.md`.
5. Read `requirements.md`. Every acceptance criterion should state an exact figure, as
   in the spec clinic. Fix what is vague with the **Review** button, then approve it.
6. Read `design.md`. Check it keeps money in whole cents: rule two, again.
7. Read `tasks.md`, then run the tasks. Run the tests yourself.

**You should now see:** the same three stories working, built from Kiro's three files.

## What to compare

- **Where the rules live.** Spec Kit checks the plan against a constitution; Kiro has
  steering files and no Constitution Check table. Did the design keep rule two?
- **The review step.** Kiro stops for your approval between phases. In Spec Kit, you
  have to remember to read each file before sending the next command.
- **Changing a requirement.** Try the split by shares from Step 6. Kiro has no
  converge: you edit the requirements and ask it to update the design and tasks.
- **Lock-in.** Kiro's specs are plain Markdown, but the workflow needs Kiro. Spec Kit
  works in the agent you already have.

Then fill in `decision-card.md` with what you found.
