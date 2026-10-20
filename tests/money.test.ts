import { describe, expect, it } from 'vitest';
import { formatCents, parseAmount, splitEqually } from '../src/money.ts';

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
