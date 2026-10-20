import { serve } from '@hono/node-server';
import { createApp } from './app.tsx';
import { openDb } from './db.ts';

const port = Number(process.env.PORT ?? 3000);
const app = createApp(openDb('data/splitter.db'));

serve({ fetch: app.fetch, port }, () => {
  console.log(`Expense splitter running at http://localhost:${port}`);
});
