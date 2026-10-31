import { balances, settle } from "./split.js";

const KEY = "expense-splitter-v1";
const blank = () => ({ name: "", people: [], expenses: [] });
let state = load();
const unchecked = new Set();

function load() {
  try { return { ...blank(), ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return blank(); }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}
function commit() { save(); render(); }

const $ = (id) => document.getElementById(id);
const uid = () => Math.random().toString(36).slice(2, 10);
const money = (cents) => (cents / 100).toLocaleString(undefined, { style: "currency", currency: "USD" });
const nameOf = (id) => state.people.find((p) => p.id === id)?.name ?? "Removed";
function el(tag, props = {}, ...kids) {
  const n = Object.assign(document.createElement(tag), props);
  n.append(...kids);
  return n;
}
function fill(list, items, emptyText) {
  list.replaceChildren(...(items.length ? items : [el("li", { className: "empty", textContent: emptyText })]));
}

function render() {
  $("group-name").value = state.name;
  const used = new Set(state.expenses.flatMap((e) => [e.paidBy, ...e.splitAmong]));

  fill($("people"), state.people.map((p) => {
    const inUse = used.has(p.id);
    const btn = el("button", { type: "button", textContent: "×", disabled: inUse, title: inUse ? "Has expenses, delete those first" : `Remove ${p.name}` });
    btn.setAttribute("aria-label", `Remove ${p.name}`);
    btn.onclick = () => { state.people = state.people.filter((x) => x.id !== p.id); commit(); };
    return el("li", {}, el("span", { textContent: p.name }), btn);
  }), "Add at least two friends to get started.");

  const payer = $("exp-payer"), prev = payer.value;
  payer.replaceChildren(...state.people.map((p) => el("option", { value: p.id, textContent: p.name })));
  if (state.people.some((p) => p.id === prev)) payer.value = prev;

  $("exp-among").replaceChildren(...state.people.map((p) => {
    const box = el("input", { type: "checkbox", value: p.id, checked: !unchecked.has(p.id) });
    box.onchange = () => (box.checked ? unchecked.delete(p.id) : unchecked.add(p.id));
    return el("label", {}, box, p.name);
  }));

  const total = state.expenses.reduce((s, e) => s + Math.round(e.amount * 100), 0);
  $("total").textContent = state.expenses.length ? `· ${money(total)} total` : "";
  fill($("expenses"), state.expenses.slice().reverse().map((e) => {
    const del = el("button", { type: "button", className: "icon", textContent: "Delete" });
    del.setAttribute("aria-label", `Delete ${e.desc}`);
    del.onclick = () => { state.expenses = state.expenses.filter((x) => x.id !== e.id); commit(); };
    const who = e.splitAmong.length === state.people.length ? "everyone" : e.splitAmong.map(nameOf).join(", ");
    return el("li", {},
      el("div", {}, el("strong", { textContent: e.desc }), el("span", { className: "sub", textContent: `${nameOf(e.paidBy)} paid · split between ${who}` })),
      el("div", { className: "amt" }, el("span", { textContent: money(Math.round(e.amount * 100)) }), del));
  }), "No expenses yet.");

  const bal = balances(state.people, state.expenses);
  fill($("balances"), state.people.map((p) => {
    const c = bal[p.id];
    const text = c > 0 ? `gets back ${money(c)}` : c < 0 ? `owes ${money(-c)}` : "settled up";
    return el("li", {}, el("span", { textContent: p.name }), el("span", { className: c > 0 ? "pos" : c < 0 ? "neg" : "muted", textContent: text }));
  }), "Nobody here yet.");

  fill($("settle"), settle(bal).map((m) =>
    el("li", {}, el("span", { textContent: `${nameOf(m.from)} pays ${nameOf(m.to)}` }), el("strong", { textContent: money(m.cents) }))),
  "Everyone is even.");
}

$("group-name").addEventListener("input", (e) => { state.name = e.target.value; save(); });

$("person-name").addEventListener("input", (e) => e.target.setCustomValidity(""));
$("person-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("person-name");
  const name = input.value.trim();
  if (!name) return;
  if (state.people.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
    input.setCustomValidity("That name is already in the group");
    input.reportValidity();
    return;
  }
  state.people.push({ id: uid(), name });
  input.value = "";
  commit();
  input.focus();
});

$("expense-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const amount = Number($("exp-amount").value);
  const splitAmong = [...$("exp-among").querySelectorAll("input:checked")].map((i) => i.value);
  const err = state.people.length < 2 ? "Add at least two friends first."
    : !(amount > 0) ? "Enter an amount above zero."
    : !splitAmong.length ? "Pick at least one person to split with." : "";
  $("exp-error").textContent = err;
  if (err) return;
  state.expenses.push({ id: uid(), desc: $("exp-desc").value.trim(), amount: Math.round(amount * 100) / 100, paidBy: $("exp-payer").value, splitAmong });
  $("exp-desc").value = "";
  $("exp-amount").value = "";
  commit();
  $("exp-desc").focus();
});

$("reset").addEventListener("click", () => {
  if (confirm("Clear the group, all friends and all expenses?")) { state = blank(); unchecked.clear(); commit(); }
});

render();
