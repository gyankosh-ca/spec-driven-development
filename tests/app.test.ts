import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.tsx';
import { openDb } from '../src/db.ts';

let app: ReturnType<typeof createApp>;

beforeEach(() => {
  app = createApp(openDb(':memory:'));
});

const post = (path: string, fields: Record<string, string | string[]>) => {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(fields)) {
    for (const v of [value].flat()) body.append(key, v);
  }
  return app.request(path, { method: 'POST', body });
};
const page = async (path: string) => (await app.request(path)).text();
const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

async function lisbonTrip() {
  const res = await post('/groups', { name: 'Lisbon trip', currency: 'EUR' });
  const path = res.headers.get('location')!;
  for (const name of ['Asha', 'Ben', 'Chen']) await post(`${path}/members`, { name });
  return path;
}
const forAll = ['1', '2', '3'];

describe('User Story 1: start a group', () => {
  it('1. creates a group with its currency and no members', async () => {
    const res = await post('/groups', { name: 'Lisbon trip', currency: 'EUR' });
    expect(res.status).toBe(303);
    const html = text(await page(res.headers.get('location')!));
    expect(html).toContain('Lisbon trip');
    expect(html).toContain('(EUR)');
    expect(html).toContain('No expenses yet');
  });

  it('2. lists members in the order they were added', async () => {
    const html = text(await page(await lisbonTrip()));
    expect(html.indexOf('Asha')).toBeLessThan(html.indexOf('Ben'));
    expect(html.indexOf('Ben')).toBeLessThan(html.indexOf('Chen'));
  });

  it('3. refuses a duplicate name, ignoring case', async () => {
    const res = await post(`${await lisbonTrip()}/members`, { name: 'ben' });
    expect(res.status).toBe(400);
    expect(await res.text()).toContain('Ben is already in this group');
  });
});

describe('User Story 2: record an expense', () => {
  it('1. splits 90.00 three ways as 30.00 each', async () => {
    const path = await lisbonTrip();
    await post(`${path}/expenses`, { description: 'Dinner', amount: '90.00', paidBy: '1', forMembers: forAll });
    expect(text(await page(path))).toContain('Dinner Asha €90.00 €30.00 €30.00 €30.00');
  });

  it('2. gives the leftover cent to whoever joined first', async () => {
    const path = await lisbonTrip();
    await post(`${path}/expenses`, { description: 'Taxi', amount: '10.00', paidBy: '2', forMembers: forAll });
    expect(text(await page(path))).toContain('Taxi Ben €10.00 €3.34 €3.33 €3.33');
  });

  it('3. refuses zero or less', async () => {
    const path = await lisbonTrip();
    for (const amount of ['0', '-4']) {
      const res = await post(`${path}/expenses`, { description: 'Nothing', amount, paidBy: '1', forMembers: forAll });
      expect(res.status).toBe(400);
      expect(await res.text()).toContain('Enter an amount greater than zero');
    }
  });

  it('4. refuses an expense for nobody', async () => {
    const res = await post(`${await lisbonTrip()}/expenses`, { description: 'Gift', amount: '20', paidBy: '1' });
    expect(res.status).toBe(400);
    expect(await res.text()).toContain('Choose at least one person this was for');
  });

  it('refuses an amount past the cent', async () => {
    const res = await post(`${await lisbonTrip()}/expenses`, { description: 'Odd', amount: '10.005', paidBy: '1', forMembers: forAll });
    expect(await res.text()).toContain('Enter an amount to the cent, like 10.05');
  });
});

describe('User Story 3: see who owes whom', () => {
  const balances = async (path: string) => text(await page(`${path}/balances`));

  it('1. after Dinner', async () => {
    const path = await lisbonTrip();
    await post(`${path}/expenses`, { description: 'Dinner', amount: '90', paidBy: '1', forMembers: forAll });
    expect(await balances(path)).toContain('Asha €90.00 €30.00 is owed €60.00 Ben €0.00 €30.00 owes €30.00 Chen €0.00 €30.00 owes €30.00');
  });

  it('2. after Dinner and Taxi', async () => {
    const path = await lisbonTrip();
    await post(`${path}/expenses`, { description: 'Dinner', amount: '90', paidBy: '1', forMembers: forAll });
    await post(`${path}/expenses`, { description: 'Taxi', amount: '10', paidBy: '2', forMembers: forAll });
    expect(await balances(path)).toContain('Asha €90.00 €33.34 is owed €56.66 Ben €10.00 €33.33 owes €23.33 Chen €0.00 €33.33 owes €33.33');
  });

  it('3. what is owed equals what is owing', async () => {
    const path = await lisbonTrip();
    await post(`${path}/expenses`, { description: 'Hotel', amount: '301.01', paidBy: '3', forMembers: forAll });
    await post(`${path}/expenses`, { description: 'Coffee', amount: '7.30', paidBy: '1', forMembers: ['1', '2'] });
    const html = await balances(path);
    const sum = (re: RegExp) => [...html.matchAll(re)].reduce((t, m) => t + Number(m[1].replace('.', '')), 0);
    expect(sum(/is owed €(\d+\.\d\d)/g)).toBe(sum(/owes €(\d+\.\d\d)/g));
  });

  it('4. no expenses: everyone at 0.00', async () => {
    expect(await balances(await lisbonTrip())).toContain('Asha €0.00 €0.00 settled Ben €0.00 €0.00 settled Chen €0.00 €0.00 settled');
  });
});

describe('Removing a member (FR-007)', () => {
  it('removes someone in no expense', async () => {
    const path = await lisbonTrip();
    const res = await post(`${path}/members/3/remove`, {});
    expect(res.status).toBe(303);
    expect(text(await page(path))).not.toContain('Chen');
  });

  it('refuses someone in expenses, saying how many', async () => {
    const path = await lisbonTrip();
    await post(`${path}/expenses`, { description: 'Dinner', amount: '90', paidBy: '1', forMembers: forAll });
    await post(`${path}/expenses`, { description: 'Taxi', amount: '10', paidBy: '2', forMembers: forAll });
    const res = await post(`${path}/members/2/remove`, {});
    expect(res.status).toBe(400);
    expect(await res.text()).toContain("Ben is in 2 expenses, so can&#39;t be removed");
  });
});
