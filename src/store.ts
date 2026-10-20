import type { Db } from './db.ts';
import { InputError, splitByShares } from './money.ts';
import type { Expense, Member } from './balances.ts';

export type Group = { id: number; name: string; currency: string };
export type ExpenseRow = Expense & { id: number; description: string };

export function createGroup(db: Db, name: string, currency: string): number {
  const cleanName = name.trim();
  const cleanCurrency = currency.trim().toUpperCase();
  if (!cleanName) throw new InputError('Give the group a name');
  if (!/^[A-Z]{3}$/.test(cleanCurrency)) throw new InputError('Enter a three-letter currency, like EUR');
  const result = db.prepare('INSERT INTO groups (name, currency) VALUES (?, ?)').run(cleanName, cleanCurrency);
  return Number(result.lastInsertRowid);
}

export function getGroup(db: Db, id: number): Group | undefined {
  return db.prepare('SELECT id, name, currency FROM groups WHERE id = ?').get(id) as Group | undefined;
}

export function listGroups(db: Db): Group[] {
  return db.prepare('SELECT id, name, currency FROM groups ORDER BY id').all() as Group[];
}

// Ordered by id, which is the joining order the leftover-cents rule depends on.
export function listMembers(db: Db, groupId: number): Member[] {
  return db.prepare('SELECT id, name FROM members WHERE group_id = ? ORDER BY id').all(groupId) as Member[];
}

export function addMember(db: Db, groupId: number, name: string): number {
  const cleanName = name.trim();
  if (!cleanName) throw new InputError('Enter a name');
  const existing = listMembers(db, groupId).find((m) => m.name.toLowerCase() === cleanName.toLowerCase());
  if (existing) throw new InputError(`${existing.name} is already in this group`);
  const result = db.prepare('INSERT INTO members (group_id, name) VALUES (?, ?)').run(groupId, cleanName);
  return Number(result.lastInsertRowid);
}

export function removeMember(db: Db, groupId: number, memberId: number): void {
  const member = listMembers(db, groupId).find((m) => m.id === memberId);
  if (!member) return;
  const { count } = db.prepare(`
    SELECT COUNT(*) AS count FROM expenses e
    WHERE e.group_id = ? AND (e.paid_by = ? OR EXISTS (
      SELECT 1 FROM shares s WHERE s.expense_id = e.id AND s.member_id = ?))
  `).get(groupId, memberId, memberId) as { count: number };
  if (count > 0) {
    throw new InputError(`${member.name} is in ${count} expense${count === 1 ? '' : 's'}, so can't be removed`);
  }
  db.prepare('DELETE FROM members WHERE id = ?').run(memberId);
}

export type Split =
  | { kind: 'equal'; forMembers: number[] }
  | { kind: 'shares'; shares: Map<number, number> };

export function addExpense(
  db: Db, groupId: number, input: { description: string; amountCents: number; paidBy: number; split: Split },
): number {
  const description = input.description.trim();
  if (!description) throw new InputError('Describe what this was for');
  const memberIds = listMembers(db, groupId).map((m) => m.id);
  if (!memberIds.includes(input.paidBy)) throw new InputError('Choose who paid');

  // Rebuilt in joining order, which the leftover-cents rule depends on.
  const { split } = input;
  const units = new Map(memberIds.map((id) => [
    id,
    split.kind === 'equal' ? (split.forMembers.includes(id) ? 1 : 0) : (split.shares.get(id) ?? 0),
  ]));
  if (split.kind === 'equal' && ![...units.values()].some((u) => u > 0)) {
    throw new InputError('Choose at least one person this was for');
  }
  const parts = splitByShares(input.amountCents, units);

  db.exec('BEGIN');
  try {
    const result = db.prepare('INSERT INTO expenses (group_id, description, amount_cents, paid_by) VALUES (?, ?, ?, ?)')
      .run(groupId, description, input.amountCents, input.paidBy);
    const expenseId = Number(result.lastInsertRowid);
    const insertShare = db.prepare('INSERT INTO shares (expense_id, member_id, amount_cents, units) VALUES (?, ?, ?, ?)');
    for (const [memberId, cents] of parts) insertShare.run(expenseId, memberId, cents, units.get(memberId)!);
    db.exec('COMMIT');
    return expenseId;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

export function listExpenses(db: Db, groupId: number): ExpenseRow[] {
  const rows = db.prepare(
    'SELECT id, description, amount_cents AS amountCents, paid_by AS paidBy FROM expenses WHERE group_id = ? ORDER BY id',
  ).all(groupId) as Omit<ExpenseRow, 'shares'>[];
  const shareRows = db.prepare(`
    SELECT s.expense_id AS expenseId, s.member_id AS memberId, s.amount_cents AS cents
    FROM shares s JOIN expenses e ON e.id = s.expense_id
    WHERE e.group_id = ? ORDER BY s.member_id
  `).all(groupId) as { expenseId: number; memberId: number; cents: number }[];
  return rows.map((row) => ({
    ...row,
    shares: new Map(shareRows.filter((s) => s.expenseId === row.id).map((s) => [s.memberId, s.cents])),
  }));
}
