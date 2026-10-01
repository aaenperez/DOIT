import { useState } from 'react';
import {
  addDays, fmtDate, fmtMin, fromKey, lcDay, minutesByDate, PROBLEMS, schedule, sdDay, TARGET_MIN, todayKey, toKey,
} from '../lib/model.js';
import { ICheck, IChevL, IChevR } from './icons.jsx';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView({ state, open }) {
  const today = todayKey();
  const start = today < state.startDate ? state.startDate : today;
  const [month, setMonth] = useState(() => {
    const d = fromKey(start);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const { map, statuses } = schedule(state, today);
  const mins = minutesByDate(state);

  // date -> plan days landing on it
  const byDate = {};
  for (const [d, v] of Object.entries(map)) (byDate[v.date] ??= []).push(Number(d));

  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = toKey(new Date(first.getFullYear(), first.getMonth(), 1 - first.getDay()));
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const inMonth = (k) => fromKey(k).getMonth() === month.getMonth();
  const monthMins = cells.filter(inMonth).reduce((s, k) => s + (mins[k] ? mins[k].lc + mins[k].sd : 0), 0);
  const activeDays = cells.filter((k) => inMonth(k) && mins[k] && mins[k].lc + mins[k].sd > 0).length;

  return (
    <>
      <div className="cal-head">
        <div>
          <div className="eyebrow">{activeDays} active days · {fmtMin(monthMins)} studied this month</div>
          <h1>{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h1>
        </div>
        <div className="spacer" />
        <button className="icon-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><IChevL /></button>
        <button className="btn small" onClick={() => { const d = fromKey(today); setMonth(new Date(d.getFullYear(), d.getMonth(), 1)); }}>This month</button>
        <button className="icon-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><IChevR /></button>
      </div>

      <div className="card cal">
        <div className="cal-grid">
          {DOW.map((d) => <div key={d} className="cal-dow">{d}</div>)}
          {cells.map((k) => {
            const days = byDate[k] ?? [];
            const m = mins[k] ?? { lc: 0, sd: 0 };
            const complete = days.length > 0 && days.every((d) => statuses[d].complete);
            const isPlan = days.length > 0;
            const d0 = days[0];
            const cls = ['cal-cell', !inMonth(k) && 'out', isPlan && 'plan', k === today && 'today', complete && 'complete'].filter(Boolean).join(' ');
            const lcText = d0 && summarizeLc(d0);
            return (
              <button key={k} className={cls} onClick={() => isPlan && open(d0)} disabled={!isPlan} style={{ cursor: isPlan ? 'pointer' : 'default' }}>
                <div className="cal-date">
                  {fromKey(k).getDate()}
                  {complete && <span style={{ color: 'var(--good)', display: 'flex' }}><ICheck width="13" height="13" /></span>}
                  <span className="spacer" />
                  {isPlan && <span className="cal-day">{days.length > 1 ? `Days ${days[0]}–${days[days.length - 1]}` : `Day ${d0}`}</span>}
                </div>
                {isPlan && (
                  <>
                    <div className="cal-line"><span className="dot" style={{ background: 'var(--lc)' }} /><span>{lcText}</span></div>
                    <div className="cal-line"><span className="dot" style={{ background: 'var(--sd)' }} /><span>{sdDay(d0).title}</span></div>
                  </>
                )}
                {(m.lc > 0 || m.sd > 0) && (
                  <>
                    <div className="cal-day" style={{ marginTop: 'auto' }}>{fmtMin(m.lc + m.sd)}</div>
                    <div className="cal-min" style={{ marginTop: 0 }} title={`LeetCode ${fmtMin(m.lc)} · System design ${fmtMin(m.sd)}`}>
                      <div style={{ width: `${Math.min(100, (m.lc / TARGET_MIN) * 100)}%`, background: 'var(--lc)' }} />
                      <div style={{ width: `${Math.min(100, (m.sd / TARGET_MIN) * 100)}%`, background: 'var(--sd)' }} />
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="cal-legend">
        <span className="row" style={{ gap: 6 }}><span className="dot" style={{ background: 'var(--lc)' }} />LeetCode</span>
        <span className="row" style={{ gap: 6 }}><span className="dot" style={{ background: 'var(--sd)' }} />System design</span>
        <span className="row" style={{ gap: 6 }}><span className="dot" style={{ background: 'var(--good)' }} />Day complete</span>
        <span className="muted">Future days are projected one per day from your current pace, so missed days push the plan back instead of disappearing. Click any day to open it.</span>
      </div>
    </>
  );
}

export function summarizeLc(d) {
  const day = lcDay(d);
  if (day.kind === 'review') return 'Review day';
  const names = day.problems.map((s) => PROBLEMS[s].name);
  return (day.kind === 'mock' ? 'Mock: ' : '') + names.join(' · ');
}
