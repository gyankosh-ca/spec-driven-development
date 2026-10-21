# Spec Kit on your own project

The session built the expense splitter in a codespace that was set up for you. This
page is the same loop on your own app, on your own laptop: a new project or one that
already has code. Work through it in order; each step names the file it leaves behind.

Before you start, open `decision-card.md`. If the feature you have in mind is a
typo or a one-line fix, you do not need any of this.

## 1. Install, once per laptop

Spec Kit's command is `specify`. It is installed with `uv`, a Python tool installer
that does **not** come with Python, so install `uv` first.

| Your laptop | Install uv | Then install Spec Kit |
|---|---|---|
| Windows | `winget install astral-sh.uv` | `uv tool install specify-cli` |
| Mac or Linux | `curl -LsSf https://astral.sh/uv/install.sh \| sh` | `uv tool install specify-cli` |

Already use pip? `pip install specify-cli` replaces both. `uv` is preferred because it
keeps the tool apart from your other packages and puts `specify` on your path.

Check it worked: `specify version`. You also need Git, and an AI coding agent that
Spec Kit supports (`specify check` lists them).

## 2. Add Spec Kit to the project, once per project

Open a terminal in your project's folder and run, with your agent's key from the
table in `STEPS.md`:

```text
specify init --here --integration copilot
```

On Windows without Git Bash, add `--script ps` so Spec Kit's helper scripts run in
PowerShell. Answer **y** when it asks to merge into a folder that is not empty.

It adds `.specify/` (templates, scripts, and soon your rules) and a folder of commands
for your agent. **It does not touch your code.** Commit what it added.

**On a project with existing code:** nothing changes in this step. The difference is
what you spec next: one new feature or one change, never the whole app at once.

## 3. Write your rules: the constitution

In your agent's chat, send `/speckit-constitution` followed by three to five rules,
in plain words. A good rule is a yes or no about any plan:

```text
/speckit-constitution Rules for this project.
1. Test first: every behaviour starts as a failing test.
2. <a rule your app breaks if nobody watches it, such as money, dates or permissions>
3. <your stack and its limits, such as one server, no client framework>
```

Without a test-first rule, Spec Kit writes no tests: it treats them as optional.

**On existing code:** write down the conventions the code already follows, not the
ones you wish it did. The plan will be checked against them.

Open `.specify/memory/constitution.md` and delete anything you did not ask for.

## 4. Spec one feature

Pick one feature. Describe what it does and why, never how:

```text
/speckit-specify <the feature in plain words: who wants it, what they can do, one example with real figures>
```

The agent writes `specs/001-<feature>/spec.md`. Read every acceptance scenario: each
one should state exact figures, so a test could fail. Rewrite any that cannot fail.

Only a vague idea? Run `/speckit-clarify` next. It asks up to five questions and
writes your answers into the spec.

## 5. Plan it

Give the plan your tech choices; it already has the spec and the rules:

```text
/speckit-plan <your stack: language, framework, database, test tool>
```

Open `plan.md` and read the **Constitution Check** yourself. The agent fills it in,
and it can tick "pass" on a broken rule. Nothing in Spec Kit blocks a broken rule;
only a test does.

## 6. Break it into tasks

```text
/speckit-tasks
```

Before you build, make two checks in `tasks.md`:

- **Test before code:** every code task has a test task before it.
- **Nothing extra:** cut any task no story asked for.

Optional: `/speckit-analyze` reads the spec, plan and tasks again and marks any rule
break as critical.

## 7. Build it, a phase at a time

```text
/speckit-implement Phases 1 to 3 only.
```

Say how far to go; a whole feature in one run is hard to review. The agent writes the
tests and the code and ticks off `tasks.md`. Then run your tests yourself.

## 8. When the requirement changes

Change the spec first, never the code:

1. In plain chat: "Update `specs/001-<feature>/spec.md` and nothing else: add …".
   Not `/speckit-specify`, which would start a second feature.
2. `/speckit-plan Re-plan for <the change>.`
3. `/speckit-converge` adds the gaps between code and spec as new tasks.
4. `/speckit-implement`, then run your tests.
5. `/speckit-converge` again, until it reports **Converged**.

## The next feature

A new feature is a new spec: run `/speckit-specify` again and Spec Kit starts
`specs/002-<feature>/`. For practice first, try **settle up** in this repo: the
fewest payments that clear every balance.

Command spelling differs by agent (`/speckit-plan`, `/speckit.plan` or
`$speckit-plan`); the table in `STEPS.md` has yours.
