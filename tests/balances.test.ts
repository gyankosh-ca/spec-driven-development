import { describe, expect, it } from 'vitest';
import { computeBalances, type Expense } from '../src/balances.ts';
import { splitEqually } from '../src/money.ts';

const members = [{ id: 1, name: 'Asha' }, { id: 2, name: 'Ben' }, { id: 3, name: 'Chen' }];
const all = [1, 2, 3];
const expense = (amountCents: number, paidBy: number, forIds = all): Expense =>
  ({ amountCents, paidBy, shares: splitEqually(amountCents, forIds) });

describe('computeBalances', () => {
  it('Dinner: Asha paid 90.00 for three', () => {
    const balances = computeBalances(members, [expense(9000, 1)]);
    expect([...balances.values()]).toEqual([6000, -3000, -3000]);
  });

  it('Dinner and Taxi', () => {
    const balances = computeBalances(members, [expense(9000, 1), expense(1000, 2)]);
    expect([...balances.values()]).toEqual([5666, -2333, -3333]);
  });

  it('no expenses means everyone is at zero', () => {
    expect([...computeBalances(members, []).values()]).toEqual([0, 0, 0]);
  });

  it('always adds up to exactly zero', () => {
    let seed = 42;
    const random = (n: number) => (seed = (seed * 1103515245 + 12345) % 2 ** 31) % n;
    const expenses = Array.from({ length: 50 }, () => {
      const forIds = all.filter(() => random(2) === 1);
      return expense(1 + random(50000), 1 + random(3), forIds.length ? forIds : [1]);
    });
    const total = [...computeBalances(members, expenses).values()].reduce((a, b) => a + b, 0);
    expect(total).toBe(0);
  });
});
