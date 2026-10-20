# Spec-Driven Development

The starter repo for the Gyankosh Academy session **Spec-Driven Development**.
Course page: https://academy.gyankosh.ca/courses/spec-driven-development

## Open it

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/gyankosh-ca/spec-driven-development?quickstart=1)

1. Sign in to GitHub (a free personal account is enough).
2. Click the button above, then **Create codespace**. It takes about a minute.
3. Do this **10 minutes before the session starts**.

The codespace is yours alone and runs on your own GitHub free allowance
(about 60 hours a month; a session uses about 2).

## Fell behind?

Each step of the session has a branch with the work done up to that point:

```bash
git stash                      # put your own changes aside
git checkout step-3            # jump to the end of step 3
```

| Branch | Where you are |
|---|---|
| `main` | The start: an empty project |
| `step-1` | Spec Kit set up, and the project's three rules (the constitution) written |
| `step-2` | The spec for the expense splitter, clarified |
| `step-3` | The technical plan, checked against the rules |
| `step-4` | The task list, each task starting with a test |
| `step-5` | The app built: running in a browser tab, tests passing |
| `step-6` | Split by shares added: spec first, then the code |

## Keep your work

Commit in the codespace. GitHub offers to save it as a copy (a fork) under your own
account. Unused codespaces are deleted after about 30 days.

## Working on your own laptop instead

No Docker needed. Get the repo (clone it, or download the zip from your Academy
dashboard), open a terminal in its folder and run one command:

| Your laptop | Command |
|---|---|
| Mac or Linux | `bash setup-local.sh` |
| Windows | `powershell -ExecutionPolicy Bypass -File setup-local.ps1` |

It installs only what is missing: Node.js 24, `uv`, Spec Kit, and on Windows Git
(which brings the `bash` that Spec Kit's scripts need). Then open the folder in VS
Code and follow `STEPS.md`. Any coding agent Spec Kit supports will work; the steps
use Copilot or Kilo Code.

## Past editions

The course changes as the tools do. `main` is always the latest edition. Earlier
editions are kept as tags: `edition-1` for the start, `ed1-step-1` … for its steps,
and every release is tagged (`ed1-v1.0`). To work from one, start your own branch:
`git checkout -b my-work ed1-step-3`.
