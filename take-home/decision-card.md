# Spec it, or just prompt it?

A spec costs time: writing it, reviewing it, keeping it true. It pays off when the
agent would otherwise guess, and the guess would be expensive. One critic of these
tools, Birgitta Böckeler, puts it plainly: *"I'd rather review code than all these
markdown files."* Often she is right. Use this card to decide.

| The task | Spec it? | Why |
|---|---|---|
| A typo, a label, a one-line fix | No: just prompt | Reading the diff is faster than writing a spec |
| A bug fix where the right behaviour is already clear | No: prompt, plus a test that fails first | The test is the spec |
| New behaviour that users will see | **Yes** | Without one, the agent decides what "done" means |
| A rule with numbers or edge cases: money, dates, permissions | **Yes** | The edge cases are the feature; write them down as scenarios |
| A change to a rule that already shipped | **Yes: change the spec first** | Otherwise spec and code drift apart, and the next change starts from a lie |
| A throwaway spike to learn something | No | You will delete it; keep what you learned instead |

## Three questions before you start

1. Could two people read my one-line request and build different things? If yes, write the spec.
2. Will I be able to tell, from the result alone, whether it is right? If not, write the scenarios first.
3. Will anyone change this again in six months? If yes, the spec is how they will know what it was meant to do.

## My rule

Fill this in for your own team:

- I write a spec when: ______________________________________________
- I just prompt when: ______________________________________________
- The smallest task I would spec: ____________________________________
