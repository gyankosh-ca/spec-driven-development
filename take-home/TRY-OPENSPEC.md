# Try OpenSpec on the same change

*Checked against github.com/Fission-AI/OpenSpec, October 2026.*

OpenSpec is a free, open-source tool (MIT licence) made for changing code that already
exists. Spec Kit writes one big spec per feature; OpenSpec works one **change** at a
time: propose it, apply it, archive it into the specs. The fairest test is the change
from Step 6, split by shares, on the finished app.

## How it maps to what you did

| In the session (Spec Kit) | In OpenSpec |
|---|---|
| `specs/001-expense-splitter/spec.md` | `openspec/specs/`, the specs as they are now |
| Editing `spec.md` for the new story | `/opsx:propose` → `openspec/changes/<change>/` |
| `plan.md`, `tasks.md` | `design.md` and `tasks.md`, inside the change folder |
| `/speckit-implement` | `/opsx:apply` |
| `/speckit-converge` until Converged | `/opsx:archive`: the change's specs merge into `openspec/specs/` |
| `constitution.md` | No match: put your rules in your agent's own instruction file |

The change folder also has `proposal.md` (why, and what changes) and a `specs/` folder
holding only the **difference**: requirements marked as added, changed or removed.

## Try it

1. Start from the finished app, in a codespace or a clone:
   ```bash
   git checkout step-5
   npm install
   ```
2. Install OpenSpec. It needs Node 22.12 or newer; the codespace has it.
   ```bash
   npm install -g @fission-ai/openspec@latest
   openspec init
   ```
   Pick your agent when it asks. Copilot writes the commands as `/opsx-propose`.
3. Describe what exists. In your agent's chat, ask it to write `openspec/specs/` from
   `specs/001-expense-splitter/spec.md`, so OpenSpec has a starting point.
4. Propose the change. In chat, send:
   ```text
   /opsx:propose split-by-shares An expense can be split by shares, not only equally. Each person gets a whole number of shares, 0 or more; leftover cents follow the same rule as an equal split. Example: Hotel, 100.00, paid by Chen, shares Asha 2, Ben 1, Chen 1 gives 50.00, 25.00, 25.00.
   ```
5. Open `openspec/changes/split-by-shares/`. Read `proposal.md`, then the requirements in
   its `specs/` folder: every scenario should state exact figures.
6. Send `/opsx:apply`, then run `npm test` yourself.
7. Send `/opsx:archive`. The change moves to `openspec/changes/archive/`, and
   `openspec/specs/` now includes split by shares.

**You should now see:** the hotel split 50.00, 25.00, 25.00, and a change folder that
says exactly what this change added.

## What to compare

- **Size of the paperwork.** One change folder against a whole feature's spec, plan and
  tasks. Which would you rather review?
- **New project or existing code.** Spec Kit starts from an empty folder well. OpenSpec
  is built for code you already have, one change at a time.
- **Rules.** OpenSpec has no constitution and no check against it. Your tests are what
  keeps rule two.

Then fill in `decision-card.md` with what you found.
