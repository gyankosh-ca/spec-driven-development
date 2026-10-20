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

export function parseShare(text: string): number {
  if (!/^\s*\d+\s*$/.test(text)) throw new InputError('Shares are whole numbers, like 2');
  return Number(text);
}

// sharesByMember must be in joining order: the leftover cents go to the first people
// in it with a share above zero. People with 0 shares get no part.
export function splitByShares(amountCents: number, sharesByMember: Map<number, number>): Map<number, number> {
  const total = [...sharesByMember.values()].reduce((a, b) => a + b, 0);
  if (total === 0) throw new InputError('Give at least one person a share above zero');
  const parts = new Map<number, number>();
  for (const [id, shares] of sharesByMember) {
    if (shares > 0) parts.set(id, Math.floor((amountCents * shares) / total));
  }
  let leftover = amountCents - [...parts.values()].reduce((a, b) => a + b, 0);
  for (const id of parts.keys()) {
    if (leftover === 0) break;
    parts.set(id, parts.get(id)! + 1);
    leftover--;
  }
  return parts;
}

// An equal split is 1 share each.
export function splitEqually(amountCents: number, memberIds: number[]): Map<number, number> {
  return splitByShares(amountCents, new Map(memberIds.map((id) => [id, 1])));
}
