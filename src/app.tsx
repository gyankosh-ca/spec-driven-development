import { Hono } from 'hono';
import type { Context } from 'hono';
import { computeBalances } from './balances.ts';
import type { Db } from './db.ts';
import { InputError, parseAmount, parseShare } from './money.ts';
import * as store from './store.ts';
import { BalancesPage } from './views/BalancesPage.tsx';
import { GroupPage } from './views/GroupPage.tsx';
import { HomePage } from './views/HomePage.tsx';

export function createApp(db: Db) {
  const app = new Hono();

  const groupOr404 = (c: Context) => store.getGroup(db, Number(c.req.param('id')));

  const renderGroup = (c: Context, group: store.Group, error?: string) =>
    c.html(
      <GroupPage group={group} members={store.listMembers(db, group.id)} expenses={store.listExpenses(db, group.id)} error={error} />,
      error ? 400 : 200,
    );

  // Runs a form action; an InputError re-renders the page with the spec's message.
  const handle = async (c: Context, group: store.Group, action: () => void | Promise<void>) => {
    try {
      await action();
      return c.redirect(`/groups/${group.id}`, 303);
    } catch (error) {
      if (error instanceof InputError) return renderGroup(c, group, error.message);
      throw error;
    }
  };

  app.get('/', (c) => c.html(<HomePage groups={store.listGroups(db)} />));

  app.post('/groups', async (c) => {
    const form = await c.req.parseBody();
    try {
      const id = store.createGroup(db, String(form.name ?? ''), String(form.currency ?? ''));
      return c.redirect(`/groups/${id}`, 303);
    } catch (error) {
      if (error instanceof InputError) return c.html(<HomePage groups={store.listGroups(db)} error={error.message} />, 400);
      throw error;
    }
  });

  app.get('/groups/:id', (c) => {
    const group = groupOr404(c);
    return group ? renderGroup(c, group) : c.notFound();
  });

  app.post('/groups/:id/members', async (c) => {
    const group = groupOr404(c);
    if (!group) return c.notFound();
    const form = await c.req.parseBody();
    return handle(c, group, () => void store.addMember(db, group.id, String(form.name ?? '')));
  });

  app.post('/groups/:id/members/:memberId/remove', (c) => {
    const group = groupOr404(c);
    if (!group) return c.notFound();
    return handle(c, group, () => store.removeMember(db, group.id, Number(c.req.param('memberId'))));
  });

  app.post('/groups/:id/expenses', async (c) => {
    const group = groupOr404(c);
    if (!group) return c.notFound();
    const form = await c.req.parseBody({ all: true });
    return handle(c, group, () => {
      const split: store.Split = form.split === 'shares'
        ? {
            kind: 'shares',
            shares: new Map(store.listMembers(db, group.id).map((m) => [m.id, parseShare(String(form[`shares_${m.id}`] ?? '0'))])),
          }
        : { kind: 'equal', forMembers: ([] as unknown[]).concat(form.forMembers ?? []).map(Number) };
      store.addExpense(db, group.id, {
        description: String(form.description ?? ''),
        amountCents: parseAmount(String(form.amount ?? '')),
        paidBy: Number(form.paidBy),
        split,
      });
    });
  });

  app.get('/groups/:id/balances', (c) => {
    const group = groupOr404(c);
    if (!group) return c.notFound();
    const members = store.listMembers(db, group.id);
    const balances = computeBalances(members, store.listExpenses(db, group.id));
    return c.html(<BalancesPage group={group} members={members} expenses={store.listExpenses(db, group.id)} balances={balances} />);
  });

  return app;
}
