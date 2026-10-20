export type Member = { id: number; name: string };
export type Expense = { amountCents: number; paidBy: number; shares: Map<number, number> };

// Positive: the member is owed that much. Negative: they owe it.
export function computeBalances(members: Member[], expenses: Expense[]): Map<number, number> {
  const balances = new Map(members.map((m) => [m.id, 0]));
  for (const expense of expenses) {
    balances.set(expense.paidBy, (balances.get(expense.paidBy) ?? 0) + expense.amountCents);
    for (const [memberId, share] of expense.shares) {
      balances.set(memberId, (balances.get(memberId) ?? 0) - share);
    }
  }
  return balances;
}
