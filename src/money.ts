// Every amount in this app is a whole number of cents (constitution, rule II).

export class InputError extends Error {}

export function parseAmount(text: string): number {
  const match = /^\s*(-?)(\d+)(?:\.(\d+))?\s*$/.exec(text);
  if (!match) throw new InputError('Enter an amount greater than zero');
  const [, sign, whole, fraction = ''] = match;
  if (fraction.length > 2) throw new InputError('Enter an amount to the cent, like 10.05');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (sign === '-' || cents <= 0) throw new InputError('Enter an amount greater than zero');
  return cents;
}

export function formatCents(cents: number): string {
  const abs = Math.abs(cents);
  const text = `${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`;
  return cents < 0 ? `-${text}` : text;
}

// Display only: the symbol comes from Intl, the figure from formatCents, so no amount passes through a float.
export function formatMoney(cents: number, currency: string): string {
  const symbol = new Intl.NumberFormat('en', { style: 'currency', currency }).formatToParts(0).find((p) => p.type === 'currency')?.value ?? currency;
  return cents < 0 ? `-${symbol}${formatCents(-cents)}` : `${symbol}${formatCents(cents)}`;
}

// memberIds must be in joining order: the leftover cents go to the first people in it.
export function splitEqually(amountCents: number, memberIds: number[]): Map<number, number> {
  const base = Math.floor(amountCents / memberIds.length);
  const leftover = amountCents % memberIds.length;
  return new Map(memberIds.map((id, i) => [id, base + (i < leftover ? 1 : 0)]));
}
