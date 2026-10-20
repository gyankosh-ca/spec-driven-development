# Spec-Driven Development: steps

You will build an **expense splitter** from an empty folder: a small web app where a
group adds what each person paid and sees who owes whom. You don't write the code by
hand. You write the rules, the spec and the plan, and an AI coding agent builds from them.

Work through the steps in order. Each step ends at a branch with that step already done.
If you fall behind, jump to it:

```bash
git stash                  # set your own attempt aside (git stash pop brings it back)
git checkout ed1/step-<k>  # carry on from the end of step k
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

Branch: `ed1/step-1`
