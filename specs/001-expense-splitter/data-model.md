# Data Model: Expense Splitter

All amounts are whole cents (`INTEGER`). Names are trimmed before saving.

## groups

| Column | Type | Rule |
|---|---|---|
| id | INTEGER PK | |
| name | TEXT | required, 1–60 characters |
| currency | TEXT | required, three capital letters (EUR, CAD, INR…) |

## members

| Column | Type | Rule |
|---|---|---|
| id | INTEGER PK | also the joining order within a group |
| group_id | INTEGER → groups.id | |
| name | TEXT | required; unique within the group, ignoring case (FR-002) |

## expenses

| Column | Type | Rule |
|---|---|---|
| id | INTEGER PK | |
| group_id | INTEGER → groups.id | |
| description | TEXT | required, 1–80 characters |
| amount_cents | INTEGER | greater than 0 (FR-003) |
| paid_by | INTEGER → members.id | a member of the same group |

## shares

| Column | Type | Rule |
|---|---|---|
| expense_id | INTEGER → expenses.id | |
| member_id | INTEGER → members.id | a member of the same group |
| amount_cents | INTEGER | the shares of one expense add up to its `amount_cents` (FR-004) |

## Rules

- **Equal split** (FR-004): for `n` people and `amount` cents, each share is `floor(amount / n)`; the first `amount mod n` people, by `members.id`, get one cent more.
- **Balance** (FR-005): for a member, the sum of `amount_cents` of expenses they paid, minus the sum of their shares. Positive: they are owed. Negative: they owe.
- **Zero sum** (FR-006): the balances of a group always add up to 0, because every expense's shares add up to its amount.
- **Removing a member** (FR-007): refused when the member is `paid_by` on, or has a share in, any expense.
