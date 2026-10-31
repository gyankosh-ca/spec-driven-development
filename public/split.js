export function balances(people, expenses) {
  const bal = Object.fromEntries(people.map((p) => [p.id, 0]));
  for (const e of expenses) {
    const among = e.splitAmong.filter((id) => id in bal);
    if (!among.length || !(e.paidBy in bal)) continue;
    const cents = Math.round(e.amount * 100);
    const share = Math.floor(cents / among.length);
    let rem = cents - share * among.length;
    bal[e.paidBy] += cents;
    for (const id of among) {
      bal[id] -= share + (rem > 0 ? 1 : 0);
      if (rem > 0) rem--;
    }
  }
  return bal;
}

export function settle(bal) {
  const debtors = [], creditors = [];
  for (const [id, c] of Object.entries(bal)) {
    if (c < 0) debtors.push({ id, c: -c });
    else if (c > 0) creditors.push({ id, c });
  }
  debtors.sort((a, b) => b.c - a.c);
  creditors.sort((a, b) => b.c - a.c);
  const out = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amt = Math.min(debtors[i].c, creditors[j].c);
    out.push({ from: debtors[i].id, to: creditors[j].id, cents: amt });
    debtors[i].c -= amt;
    creditors[j].c -= amt;
    if (!debtors[i].c) i++;
    if (!creditors[j].c) j++;
  }
  return out;
}
