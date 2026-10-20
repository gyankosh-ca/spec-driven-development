import type { Group } from '../store.ts';
import { Alert, Layout } from './Layout.tsx';

export function HomePage({ groups, error }: { groups: Group[]; error?: string }) {
  return (
    <Layout title="Groups">
      <article>
        <header><h2>Your groups</h2></header>
        {groups.length === 0 ? <p>No groups yet.</p> : (
          <ul>{groups.map((g) => <li><a href={`/groups/${g.id}`}>{g.name}</a> ({g.currency})</li>)}</ul>
        )}
      </article>
      <article>
        <header><h2>New group</h2></header>
        <Alert message={error} />
        <form method="post" action="/groups">
          <div class="grid">
            <label>Name<input name="name" required /></label>
            <label>Currency<input name="currency" value="EUR" size={4} required /></label>
          </div>
          <button>Create group</button>
        </form>
      </article>
    </Layout>
  );
}
