import { LC_DAYS, PROBLEMS, SEED_ATTEMPTS, TOPICS } from '../data/lc-plan.js';
import SD from '../data/sd-curriculum.json';

export const TOTAL_DAYS = 56;
export const TARGET_MIN = 100; // ~50 LC + ~50 SD
export const START = '2026-10-01';
export const WEAK = new Set(['hinted', 'studied', 'skipped']);

// ---------- dates (local, YYYY-MM-DD) ----------
const pad = (n) => String(n).padStart(2, '0');
export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromKey = (k) => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const todayKey = () => toKey(new Date());
export const addDays = (k, n) => {
  const d = fromKey(k);
  d.setDate(d.getDate() + n);
  return toKey(d);
};
export const diffDays = (a, b) => Math.round((fromKey(b) - fromKey(a)) / 86400000);
export const fmtDate = (k, opts = { weekday: 'long', month: 'long', day: 'numeric' }) =>
  fromKey(k).toLocaleDateString('en-US', opts);

// ---------- state ----------
export function initialState() {
  return {
    version: 1,
    startDate: START,
    attempts: { ...SEED_ATTEMPTS }, // key `${planDay}:${slug}` -> {slug, planDay, date, status, notes}
    sd: {}, // planDay -> {status: 'done'|'skipped', date, notes, confidence}
    checks: {}, // `sd:${day}:${i}` -> true
    time: [], // {id, date, cat: 'lc'|'sd', minutes, planDay}
    timer: null, // {cat, planDay, startedAt}
    theme: 'system',
  };
}

export const sdDay = (d) => SD[d - 1];
export const lcDay = (d) => LC_DAYS[d - 1];
export const attemptKey = (d, slug) => `${d}:${slug}`;

// Latest attempt per slug among attempts matching `filter`.
function latestBySlug(state, filter) {
  const out = {};
  for (const a of Object.values(state.attempts)) {
    if (!filter(a)) continue;
    const cur = out[a.slug];
    if (!cur || a.planDay > cur.planDay || (a.planDay === cur.planDay && a.date > cur.date)) out[a.slug] = a;
  }
  return out;
}

export function latestAttempts(state) {
  return latestBySlug(state, () => true);
}

const WEAK_REASON = { hinted: 'Used hints', studied: 'Only studied it', skipped: 'Skipped' };

// LeetCode items for a plan day. Review days pull every problem you didn't solve cleanly.
export function lcItems(state, d) {
  const day = lcDay(d);
  if (!day) return [];
  if (day.kind !== 'review') return day.problems.map((slug) => ({ slug }));

  const onDay = Object.values(state.attempts).filter((a) => a.planDay === d).map((a) => a.slug);
  const before = latestBySlug(state, (a) => a.planDay < d);
  const weak = Object.values(before)
    .filter((a) => WEAK.has(a.status))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  const reasons = Object.fromEntries(
    weak.map((a) => [a.slug, `${WEAK_REASON[a.status]} on ${fmtDate(a.date, { month: 'short', day: 'numeric' })}`]),
  );

  const slugs = [...new Set([...onDay, ...weak.map((a) => a.slug)])].slice(0, Math.max(3, onDay.length));
  if (slugs.length < 2) {
    // Nothing weak: re-solve something from this week from memory.
    const week = [];
    for (let k = d - 6; k < d; k++) for (const s of lcDay(k)?.problems ?? []) if (before[s]) week.push(s);
    for (const s of week) {
      if (slugs.length >= 2) break;
      if (!slugs.includes(s)) {
        slugs.push(s);
        reasons[s] = 'Re-solve from memory';
      }
    }
  }
  return slugs.map((slug) => ({ slug, reason: reasons[slug] ?? 'Review' }));
}

export function dayStatus(state, d) {
  const items = lcItems(state, d);
  const atts = items.map((i) => state.attempts[attemptKey(d, i.slug)]).filter(Boolean);
  const lcDone = atts.length === items.length;
  const sd = state.sd[d];
  const complete = lcDone && !!sd;
  const dates = [...atts.map((a) => a.date), sd?.date].filter(Boolean).sort();
  return {
    items,
    lcDone,
    lcCount: atts.length,
    sdDone: !!sd,
    complete,
    started: atts.length > 0 || !!sd,
    completedOn: complete ? dates[dates.length - 1] : null,
  };
}

export function currentDay(state) {
  for (let d = 1; d <= TOTAL_DAYS; d++) if (!dayStatus(state, d).complete) return d;
  return TOTAL_DAYS + 1;
}

// Map each plan day to a date: completed days to when you finished them,
// remaining days projected one per day from today (or tomorrow if you already finished a day today).
export function schedule(state, today = todayKey()) {
  const map = {};
  let finishedToday = false;
  const statuses = {};
  for (let d = 1; d <= TOTAL_DAYS; d++) {
    statuses[d] = dayStatus(state, d);
    if (statuses[d].completedOn === today) finishedToday = true;
  }
  let next = finishedToday ? addDays(today, 1) : today;
  if (next < state.startDate) next = state.startDate;
  for (let d = 1; d <= TOTAL_DAYS; d++) {
    if (statuses[d].complete) map[d] = { date: statuses[d].completedOn, done: true };
    else {
      map[d] = { date: next, done: false };
      next = addDays(next, 1);
    }
  }
  return { map, statuses, finishedToday };
}

export function pace(state, today = todayKey()) {
  const { map } = schedule(state, today);
  const target = addDays(state.startDate, TOTAL_DAYS - 1);
  const projected = map[TOTAL_DAYS].date;
  return { target, projected, behind: diffDays(target, projected) };
}

// ---------- time ----------
export function minutesByDate(state) {
  const out = {};
  for (const t of state.time) {
    out[t.date] ??= { lc: 0, sd: 0 };
    out[t.date][t.cat] += t.minutes;
  }
  return out;
}

export function activeDates(state) {
  const s = new Set(state.time.filter((t) => t.minutes > 0).map((t) => t.date));
  for (const a of Object.values(state.attempts)) if (a.planDay > 0) s.add(a.date);
  for (const v of Object.values(state.sd)) s.add(v.date);
  return s;
}

export function streaks(state, today = todayKey()) {
  const dates = activeDates(state);
  let current = 0;
  let k = dates.has(today) ? today : addDays(today, -1);
  while (dates.has(k)) {
    current++;
    k = addDays(k, -1);
  }
  let best = 0;
  let run = 0;
  let prev = null;
  for (const dk of [...dates].sort()) {
    run = prev && diffDays(prev, dk) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = dk;
  }
  return { current, best, activeToday: dates.has(today) };
}

// ---------- progress ----------
export function topicProgress(state) {
  const latest = latestAttempts(state);
  const rows = {};
  for (const p of Object.values(PROBLEMS)) {
    rows[p.topic] ??= { key: p.topic, name: TOPICS[p.topic].name, total: 0, solved: 0, hinted: 0, studied: 0 };
    rows[p.topic].total++;
    const st = latest[p.slug]?.status;
    if (st && st !== 'skipped') rows[p.topic][st]++;
  }
  return Object.keys(TOPICS).map((k) => rows[k]).filter(Boolean);
}

export function totals(state) {
  const latest = latestAttempts(state);
  const counts = { solved: 0, hinted: 0, studied: 0, skipped: 0 };
  for (const a of Object.values(latest)) counts[a.status]++;
  const lcMin = state.time.filter((t) => t.cat === 'lc').reduce((s, t) => s + t.minutes, 0);
  const sdMin = state.time.filter((t) => t.cat === 'sd').reduce((s, t) => s + t.minutes, 0);
  const sdDone = Object.values(state.sd).filter((v) => v.status === 'done').length;
  return { ...counts, total: Object.keys(PROBLEMS).length, lcMin, sdMin, sdDone };
}

export const fmtMin = (m) => {
  if (!m) return '0m';
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h ? (r ? `${h}h ${r}m` : `${h}h`) : `${r}m`;
};

export { PROBLEMS, TOPICS, LC_DAYS, SD };
