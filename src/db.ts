import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export type Db = DatabaseSync;

export function openDb(path: string): Db {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      currency TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY,
      group_id INTEGER NOT NULL REFERENCES groups(id),
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY,
      group_id INTEGER NOT NULL REFERENCES groups(id),
      description TEXT NOT NULL,
      amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
      paid_by INTEGER NOT NULL REFERENCES members(id)
    );
    CREATE TABLE IF NOT EXISTS shares (
      expense_id INTEGER NOT NULL REFERENCES expenses(id),
      member_id INTEGER NOT NULL REFERENCES members(id),
      amount_cents INTEGER NOT NULL,
      units INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (expense_id, member_id)
    );
  `);
  // A database made before split by shares lacks the units column.
  const columns = db.prepare('PRAGMA table_info(shares)').all() as { name: string }[];
  if (!columns.some((c) => c.name === 'units')) {
    db.exec('ALTER TABLE shares ADD COLUMN units INTEGER NOT NULL DEFAULT 1');
  }
  return db;
}
