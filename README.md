# Spec-Driven Development

The starter repo for the Gyankosh Academy session **Spec-Driven Development**.
Course page: https://academy.gyankosh.ca/courses/spec-driven-development

## Open it

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/gyankosh-ca/spec-driven-development?quickstart=1)

1. Sign in to GitHub (a free personal account is enough).
2. Click the button above, then **Create codespace**. It takes about a minute.
3. Do this **10 minutes before the session starts**.

The codespace is yours alone and runs on your own GitHub free allowance
(about 60 hours a month on this 2-core codespace).

## Fell behind?

Each step of the session has a branch with the work done up to that point:

```bash
git stash -u                   # put your own changes aside, new files too
git checkout step-3            # jump to the end of step 3
```

| Branch | Where you are |
|---|---|
| `main` | The start: an empty project |
| `step-1` | Spec Kit set up, and the project's three rules (the constitution) written |
| `step-2` | The spec for the expense splitter, clarified |
| `step-3` | The technical plan, checked against the rules |
| `step-4` | The task list, a test before the code in every story |
| `step-5` | The app built: running in a browser tab, tests passing |
| `step-6` | Split by shares added: spec first, then the code |

## Keep your work

Commit in the codespace, then **Publish Branch** in Source Control. GitHub offers to save it
as a copy (a fork) under your own account. Unused codespaces are deleted after about 30 days.

## After the session

- [`take-home/YOUR-OWN-PROJECT.md`](take-home/YOUR-OWN-PROJECT.md): the same loop on your own app, new or existing.
- [`take-home/decision-card.md`](take-home/decision-card.md): when a spec is worth it, and your own rule.
- [`take-home/TRY-KIRO.md`](take-home/TRY-KIRO.md) and [`take-home/TRY-OPENSPEC.md`](take-home/TRY-OPENSPEC.md): the same work in the two other spec tools, to compare.
- Practice: spec a second feature, **settle up**, on your own.

## Working on your own laptop instead

No Docker needed. You need Git (`git --version`; on Windows `winget install --id Git.Git -e`).
Clone the repo, not a zip: a zip has no step branches to catch up from.

```bash
git clone https://github.com/gyankosh-ca/spec-driven-development.git
cd spec-driven-development
```

Then run one command:

| Your laptop | Command |
|---|---|
| Mac or Linux | `bash .setup/setup-local.sh` |
| Windows | `powershell -ExecutionPolicy Bypass -File .setup/setup-local.ps1` |

It installs only what is missing: Node.js 24, `uv`, Spec Kit, and on Windows Git
(which brings the `bash` that Spec Kit's scripts need). Then open the folder in VS
Code and follow `STEPS.md`. Any coding agent Spec Kit supports will work; the steps
use Copilot or Kilo Code.

## Past editions

The course changes as the tools do. `main` is always the latest edition. Earlier
editions are kept as tags: `edition-1` for the start, `ed1-step-1` … for its steps,
and every release is tagged (`ed1-v1.0`). To work from one, start your own branch:
`git checkout -b my-work ed1-step-3`.
