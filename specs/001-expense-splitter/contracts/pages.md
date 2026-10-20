# Pages and Forms

Every page is HTML rendered on the server. Forms post, then redirect back to a page
(post/redirect/get). A refused form re-renders its page with status `400` and the
spec's message in an element with `role="alert"`. Every amount shows the group's currency sign, such as €10.00.

| Method | Path | Does | On success |
|---|---|---|---|
| GET | `/` | Lists groups; form to create one | 200 |
| POST | `/groups` | `name`, `currency` → new group | 303 → `/groups/:id` |
| GET | `/groups/:id` | Members, add-member form; expenses as a table, one row per expense and one column per member with their share, and a total row of each member's share; add-expense form | 200; 404 if no such group |
| POST | `/groups/:id/members` | `name` → new member | 303 → `/groups/:id` |
| POST | `/groups/:id/members/:memberId/remove` | Removes a member who is in no expense | 303 → `/groups/:id` |
| POST | `/groups/:id/expenses` | `description`, `amount` (text, e.g. `10.05`), `paidBy`, `split` (`equal` or `shares`). Equal: `forMembers` (one or more member ids). Shares: `shares_<memberId>` (whole number, 0 or more) for each member → new expense | 303 → `/groups/:id` |
| GET | `/groups/:id/balances` | A table, one row per member: what they paid, their share, and "is owed X", "owes X" or "settled" | 200 |

## Messages (from the spec)

| When | Message |
|---|---|
| Duplicate member name | "Ben is already in this group" |
| Amount zero or less | "Enter an amount greater than zero" |
| Amount past the cent | "Enter an amount to the cent, like 10.05" |
| Nobody chosen | "Choose at least one person this was for" |
| Removing a member in an expense | "Ben is in 2 expenses, so can't be removed" |
| Every share 0 | "Give at least one person a share above zero" |
| A share not a whole number | "Shares are whole numbers, like 2" |
