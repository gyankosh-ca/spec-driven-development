import type { Child } from 'hono/jsx';

export function Layout({ title, children }: { title: string; children: Child }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title} · Expense splitter</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2.1.1/css/pico.min.css" />
        <style>{`
                    main { max-width: 52rem; }
          article header h2 { margin: 0; font-size: 1.15rem; }
          .row { display: flex; gap: .5rem; align-items: center; }
          .row input, .row button { margin: 0; }
          .row input { flex: 1; }
          .row button, .actions button { width: auto; white-space: nowrap; }
          .chips { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: .5rem; }
          .chips li { list-style: none; margin: 0; display: flex; align-items: center; gap: .25rem; padding: .2rem .25rem .2rem .8rem; border: 1px solid var(--pico-muted-border-color); border-radius: 999px; }
          .chips form { margin: 0; }
          .chips button { margin: 0; padding: .1rem .5rem; background: none; border: 0; color: var(--pico-muted-color); }
          .list { list-style: none; padding: 0; }
          .item { list-style: none; display: grid; grid-template-columns: 1fr auto; gap: .25rem 1rem; padding: .75rem 0; border-top: 1px solid var(--pico-muted-border-color); }
          .item:first-child { border-top: 0; }
          .sub { display: block; color: var(--pico-muted-color); font-size: .875rem; }
          .amt { font-variant-numeric: tabular-nums; text-align: right; }
          .shares { grid-column: 1 / -1; list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: .25rem 1rem; font-size: .875rem; color: var(--pico-muted-color); }
          .shares li { list-style: none; margin: 0; }
          .checks { display: flex; flex-wrap: wrap; gap: .25rem 1.25rem; }
          .checks label { display: inline-flex; align-items: center; gap: .35rem; margin: 0; }
          td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
          [role=alert] { background: #fdecec; border-left: 4px solid #c62828; padding: .5rem .75rem; }
          .muted { color: var(--pico-muted-color); }
          tfoot th { font-weight: 600; }
          .owed { color: #1b7a3a; font-weight: 600; } .owes { color: #c62828; font-weight: 600; }
        `}</style>
      </head>
      <body>
        <header class="container">
          <nav><ul><li><a href="/"><strong>Expense splitter</strong></a></li></ul></nav>
        </header>
        <main class="container">{children}</main>
      </body>
    </html>
  );
}

export function Alert({ message }: { message?: string }) {
  return message ? <p role="alert">{message}</p> : null;
}
