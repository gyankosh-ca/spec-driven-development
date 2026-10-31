import { test } from "node:test";
import assert from "node:assert/strict";
import { balances, settle } from "./public/split.js";

const people = [{ id: "a" }, { id: "b" }, { id: "c" }];

test("even split and settle", () => {
  const bal = balances(people, [{ amount: 30, paidBy: "a", splitAmong: ["a", "b", "c"] }]);
  assert.deepEqual(bal, { a: 2000, b: -1000, c: -1000 });
  assert.deepEqual(settle(bal), [{ from: "b", to: "a", cents: 1000 }, { from: "c", to: "a", cents: 1000 }]);
});

test("odd cents sum to zero", () => {
  const bal = balances(people, [{ amount: 10, paidBy: "b", splitAmong: ["a", "b", "c"] }]);
  assert.equal(Object.values(bal).reduce((s, v) => s + v, 0), 0);
});
