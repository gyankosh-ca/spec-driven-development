import type { Member } from '../balances.ts';
import { formatMoney } from '../money.ts';
import type { ExpenseRow, Group } from '../store.ts';
import { Layout } from './Layout.tsx';

type Props = { group: Group; members: Member[]; expenses: ExpenseRow[]; balances: Map<number, number> };

export function BalancesPage({ group, members, expenses, balances }: Props) {
  const money = (cents: number) => formatMoney(cents, group.currency);
  return (
    <Layout title={`${group.name} balances`}>
      <p><a href={`/groups/${group.id}`}>← {group.name}</a></p>
      <h1>Balances <small>({group.currency})</small></h1>
      <article>
        <table>
          <thead>
            <tr><th>Person</th><th class="num">Paid</th><th class="num">Their share</th><th class="num">Balance</th></tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const paid = expenses.reduce((t, e) => t + (e.paidBy === m.id ? e.amountCents : 0), 0);
              const share = expenses.reduce((t, e) => t + (e.shares.get(m.id) ?? 0), 0);
              const cents = balances.get(m.id) ?? 0;
              return (
                <tr data-member={m.name}>
                  <td>{m.name}</td>
                  <td class="num">{money(paid)}</td>
                  <td class="num">{money(share)}</td>
                  {cents > 0 && <td class="num owed">is owed {money(cents)}</td>}
                  {cents < 0 && <td class="num owes">owes {money(-cents)}</td>}
                  {cents === 0 && <td class="num muted">settled</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </article>
    </Layout>
  );
}
