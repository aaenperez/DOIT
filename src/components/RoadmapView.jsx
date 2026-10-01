import { fmtDate, lcDay, PROBLEMS, schedule, sdDay, TOPICS, TOTAL_DAYS, pace } from '../lib/model.js';
import { ICheck } from './icons.jsx';

const PHASES = [
  [1, 'Foundations: core patterns + system design fundamentals', 'Weeks 1–3'],
  [4, 'Depth: harder patterns + classic design problems', 'Weeks 4–7'],
  [8, 'Interview mode: timed mocks', 'Week 8'],
];

export default function RoadmapView({ state, open, cur }) {
  const { map, statuses } = schedule(state);
  const p = pace(state);
  const weeks = Array.from({ length: TOTAL_DAYS / 7 }, (_, w) => w + 1);
  return (
    <>
      <div style={{ marginBottom: 22 }}>
        <div className="eyebrow">8 weeks · 56 days · ~50 min LeetCode + ~50 min system design daily</div>
        <h1>Roadmap</h1>
        <div className="dim" style={{ marginTop: 6 }}>
          Target finish {fmtDate(p.target, { month: 'long', day: 'numeric' })} · projected{' '}
          <b style={{ color: 'var(--text)' }}>{fmtDate(p.projected, { month: 'long', day: 'numeric' })}</b>
          {p.behind > 0 ? ` (${p.behind} day${p.behind > 1 ? 's' : ''} behind)` : p.behind < 0 ? ` (${-p.behind} day${p.behind < -1 ? 's' : ''} ahead)` : ' (on pace)'}
        </div>
      </div>
      {weeks.map((w) => {
        const phase = PHASES.filter(([from]) => w >= from).pop();
        const days = Array.from({ length: 7 }, (_, i) => (w - 1) * 7 + i + 1);
        const topics = [...new Set(days.map((d) => lcDay(d).topic).filter(Boolean))].map((t) => TOPICS[t].name);
        return (
          <div key={w} className="week">
            {PHASES.some(([from]) => from === w) && (
              <div className="section-label" style={{ marginTop: 10, marginBottom: 12 }}>{phase[2]} · {phase[1]}</div>
            )}
            <div className="week-head">
              <h2>Week {w}</h2>
              <span className="muted" style={{ fontSize: 13 }}>{topics.join(' → ') || 'Timed mock sets'}</span>
            </div>
            <div className="week-grid">
              {days.map((d) => {
                const s = statuses[d];
                const lc = lcDay(d);
                const cls = ['rm-day', d === cur && 'current', s.complete && 'complete', lc.kind === 'review' && !s.complete && 'review'].filter(Boolean).join(' ');
                return (
                  <button key={d} className={cls} onClick={() => open(d)}>
                    <div className="rm-top">
                      <span>Day {d}</span>
                      {s.complete ? (
                        <span style={{ color: 'var(--good)', display: 'flex' }}><ICheck width="14" height="14" /></span>
                      ) : (
                        <span className="muted" style={{ fontWeight: 500 }}>{fmtDate(map[d].date, { month: 'short', day: 'numeric' })}</span>
                      )}
                    </div>
                    {lc.kind === 'review' ? (
                      <div className="rm-line"><span className="dot" style={{ background: 'var(--lc)' }} />Review: weak problems</div>
                    ) : (
                      lc.problems.map((slug) => (
                        <div key={slug} className="rm-line"><span className="dot" style={{ background: 'var(--lc)' }} />{PROBLEMS[slug].name}</div>
                      ))
                    )}
                    <div className="rm-line" style={{ marginTop: 'auto' }}><span className="dot" style={{ background: 'var(--sd)' }} />{sdDay(d).title}</div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
