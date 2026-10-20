import { describe, expect, it } from 'vitest';
import { formatCents, parseAmount, parseShare, splitByShares, splitEqually } from '../src/money.ts';

describe('parseAmount', () => {
  it('reads amounts as whole cents', () => {
    expect(parseAmount('10.05')).toBe(1005);
    expect(parseAmount('90')).toBe(9000);
    expect(parseAmount('3.5')).toBe(350);
  });

  it('refuses amounts past the cent', () => {
    expect(() => parseAmount('10.005')).toThrow('Enter an amount to the cent, like 10.05');
  });

  it('refuses zero, negative and non-numbers', () => {
    for (const text of ['0', '0.00', '-5', 'abc', '']) {
      expect(() => parseAmount(text)).toThrow('Enter an amount greater than zero');
    }
  });
});

describe('formatCents', () => {
  it('shows two decimals', () => {
    expect(formatCents(1005)).toBe('10.05');
    expect(formatCents(5)).toBe('0.05');
    expect(formatCents(-2333)).toBe('-23.33');
  });
});

describe('splitEqually', () => {
  const shares = (amount: number, ids: number[]) => [...splitEqually(amount, ids).values()];

  it('splits evenly when it can', () => {
    expect(shares(9000, [1, 2, 3])).toEqual([3000, 3000, 3000]);
  });

  it('gives leftover cents to the first people, in joining order', () => {
    expect(shares(1000, [1, 2, 3])).toEqual([334, 333, 333]);
    expect(shares(1001, [1, 2, 3])).toEqual([334, 334, 333]);
    expect(shares(1, [1, 2, 3])).toEqual([1, 0, 0]);
  });

  it('always adds back up to the amount', () => {
    for (let amount = 1; amount <= 2000; amount += 7) {
      for (let people = 1; people <= 7; people++) {
        const ids = Array.from({ length: people }, (_, i) => i + 1);
        expect(shares(amount, ids).reduce((a, b) => a + b, 0)).toBe(amount);
      }
    }
  });
});

describe('splitByShares (User Story 4)', () => {
  const split = (amount: number, shares: [number, number][]) => Object.fromEntries(splitByShares(amount, new Map(shares)));

  it('Hotel: 100.00 by 2, 1, 1', () => {
    expect(split(10000, [[1, 2], [2, 1], [3, 1]])).toEqual({ 1: 5000, 2: 2500, 3: 2500 });
  });

  it('Wine: 10.00 by 2, 1, 0 — the leftover cent goes to whoever joined first, 0 shares get nothing', () => {
    expect(split(1000, [[1, 2], [2, 1], [3, 0]])).toEqual({ 1: 667, 2: 333 });
  });

  it('refuses all zero shares', () => {
    expect(() => split(1000, [[1, 0], [2, 0]])).toThrow('Give at least one person a share above zero');
  });

  it('an equal split is 1 share each', () => {
    expect([...splitEqually(1000, [1, 2, 3])]).toEqual([...splitByShares(1000, new Map([[1, 1], [2, 1], [3, 1]]))]);
  });

  it('always adds back up to the amount', () => {
    for (let amount = 1; amount <= 3000; amount += 13) {
      const parts = splitByShares(amount, new Map([[1, 3], [2, 0], [3, 2], [4, 5]]));
      expect([...parts.values()].reduce((a, b) => a + b, 0)).toBe(amount);
    }
  });
});

describe('parseShare', () => {
  it('takes whole numbers, 0 or more', () => {
    expect(parseShare('2')).toBe(2);
    expect(parseShare('0')).toBe(0);
  });

  it('refuses anything else', () => {
    for (const text of ['1.5', '-1', 'two', '']) {
      expect(() => parseShare(text)).toThrow('Shares are whole numbers, like 2');
    }
  });
});
