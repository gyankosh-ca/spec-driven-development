# Quickstart: Expense Splitter

## Run it

```bash
npm install
npm test        # every acceptance scenario, about a second
npm run dev     # http://localhost:3000 — Codespaces opens it in a browser tab
```

## Check it by hand

1. Create "Lisbon trip" in EUR and add Asha, Ben and Chen ([pages](contracts/pages.md)).
2. Asha records "Dinner", 90.00, for all three. Each share shows 30.00.
3. Ben records "Taxi", 10.00, for all three. Shares: Asha 3.34, Ben 3.33, Chen 3.33.
4. Open Balances: Asha is owed 56.66, Ben owes 23.33, Chen owes 33.33.
5. Try to remove Ben. The page says "Ben is in 2 expenses, so can't be removed".
6. Chen records "Hotel", 100.00, **by shares**: Asha 2, Ben 1, Chen 1. Shares: 50.00, 25.00, 25.00.

The numbers come from the spec's acceptance scenarios; the rules behind them are in
[data-model.md](data-model.md).
