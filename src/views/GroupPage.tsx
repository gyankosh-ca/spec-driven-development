import type { Member } from '../balances.ts';
import { formatMoney } from '../money.ts';
import type { ExpenseRow, Group } from '../store.ts';
import { Alert, Layout } from './Layout.tsx';

type Props = { group: Group; members: Member[]; expenses: ExpenseRow[]; error?: string };

export function GroupPage({ group, members, expenses, error }: Props) {
  const nameOf = (id: number) => members.find((m) => m.id === id)?.name ?? '?';
  const money = (cents: number) => formatMoney(cents, group.currency);
  return (
    <Layout title={group.name}>
      <p><a href="/">← All groups</a></p>
      <h1>{group.name} <small>({group.currency})</small></h1>
      <p><a href={`/groups/${group.id}/balances`} role="button">See balances →</a></p>
      <Alert message={error} />

      <article>
        <header><h2>Members</h2></header>
        <ul class="chips">
          {members.map((m) => (
            <li>
              {m.name}
              <form method="post" action={`/groups/${group.id}/members/${m.id}/remove`}>
                <button aria-label={`Remove ${m.name}`}>×</button>
              </form>
            </li>
          ))}
        </ul>
        <form method="post" action={`/groups/${group.id}/members`} class="row">
          <input name="name" aria-label="Name" placeholder="Name" required />
          <button>Add member</button>
        </form>
      </article>

      <article>
        <header><h2>Expenses</h2></header>
        {expenses.length === 0 ? <p>No expenses yet.</p> : (
          <div class="overflow-auto">
            <table class="striped">
              <thead>
                <tr>
                  <th>Expense</th><th>Paid by</th><th class="num">Amount</th>
                  {members.map((m) => <th class="num">{m.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr>
                    <td>{e.description}</td>
                    <td>{nameOf(e.paidBy)}</td>
                    <td class="num"><strong>{money(e.amountCents)}</strong></td>
                    {members.map((m) => <td class="num">{e.shares.has(m.id) ? money(e.shares.get(m.id)!) : <span class="muted">–</span>}</td>)}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colspan={2}>Each person's share</th>
                  <th class="num">{money(expenses.reduce((t, e) => t + e.amountCents, 0))}</th>
                  {members.map((m) => <th class="num">{money(expenses.reduce((t, e) => t + (e.shares.get(m.id) ?? 0), 0))}</th>)}
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </article>

      {members.length > 0 && (
        <article>
          <header><h2>Add an expense</h2></header>
          <form method="post" action={`/groups/${group.id}/expenses`}>
            <div class="grid">
              <label>What<input name="description" required /></label>
              <label>Amount<input name="amount" inputmode="decimal" size={8} required /></label>
              <label>Paid by
                <select name="paidBy">{members.map((m) => <option value={String(m.id)}>{m.name}</option>)}</select>
              </label>
            </div>
            <fieldset>
              <legend><label><input type="radio" name="split" value="equal" checked /> Split equally, for</label></legend>
              <div class="checks">
                {members.map((m) => (
                  <label><input type="checkbox" name="forMembers" value={String(m.id)} checked />{m.name}</label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend><label><input type="radio" name="split" value="shares" /> Split by shares</label></legend>
              <div class="checks">
                {members.map((m) => (
                  <label>{m.name}<input type="number" name={`shares_${m.id}`} value="1" min="0" step="1" class="share" /></label>
                ))}
              </div>
            </fieldset>
            <div class="actions"><button>Add expense</button></div>
          </form>
        </article>
      )}
    </Layout>
  );
}
