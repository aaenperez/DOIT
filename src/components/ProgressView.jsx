import { useEffect, useRef, useState } from 'react';
import {
  addDays, fmtDate, fmtMin, minutesByDate, pace, PROBLEMS, schedule, SD, TARGET_MIN, todayKey, topicProgress,
  totals, TOTAL_DAYS,
} from '../lib/model.js';
import { ICheck } from './icons.jsx';

const STATUS_NAME = { solved: 'Solved unaided', hinted: 'With hints', studied: 'Studied', skipped: 'Skipped' };

export default function ProgressView({ state, streak }) {
  const t = totals(state);
  const p = pace(state);
  const { statuses } = schedule(state);
  const daysDone = Object.values(statuses).filter((s) => s.complete).length;
  const allMin = t.lcMin + t.sdMin;
  const activeDays = Object.values(minutesByDate(state)).filter((m) => m.lc + m.sd > 0).length;

  return (
    <>
      <div style={{ marginBottom: 22 }}>
        <div className="eyebrow">Everything you've put in so far</div>
        <h1>Progress</h1>
      </div>

      <div className="tiles">
        <Tile label="Current streak" value={`${streak.current} ${streak.current === 1 ? 'day' : 'days'}`} sub={`Best: ${streak.best}`} />
        <Tile label="Total time" value={fmtMin(allMin)} sub={activeDays ? `${fmtMin(Math.round(allMin / activeDays))} per active day` : 'Start a timer on Today'} />
        <Tile label="Plan days complete" value={`${daysDone} / ${TOTAL_DAYS}`} sub={`${Math.round((daysDone / TOTAL_DAYS) * 100)}% of the plan`} />
        <Tile label="Problems solved" value={`${t.solved + t.hinted}`} sub={`${t.solved} unaided · ${t.hinted} with hints`} />
        <Tile
          label="Projected finish"
          value={fmtDate(p.projected, { month: 'short', day: 'numeric' })}
          sub={p.behind > 0 ? `${p.behind} day${p.behind > 1 ? 's' : ''} behind target` : p.behind < 0 ? `${-p.behind} day${p.behind < -1 ? 's' : ''} ahead of target` : 'Right on target'}
          subColor={p.behind > 0 ? 'var(--bad)' : p.behind < 0 ? 'var(--good)' : undefined}
        />
      </div>

      <DailyChart state={state} />

      <div className="grid2">
        <div className="card panel">
          <div className="panel-head">
            <h2>LeetCode by topic</h2>
            <span className="spacer" />
            <div className="legend">
              <span><i style={{ background: 'var(--st-solved)' }} />Unaided</span>
              <span><i style={{ background: 'var(--st-hinted)' }} />Hints</span>
              <span><i style={{ background: 'var(--st-studied)' }} />Studied</span>
            </div>
          </div>
          <TopicBars state={state} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <SplitPanel lc={t.lcMin} sd={t.sdMin} />
          <SdPanel state={state} />
        </div>
      </div>

      <RecentTable state={state} />
    </>
  );
}

function Tile({ label, value, sub, subColor }) {
  return (
    <div className="card tile">
      <div className="tile-label">{label}</div>
      <div className="tile-value">{value}</div>
      <div className="tile-sub" style={subColor ? { color: subColor } : undefined}>{sub}</div>
    </div>
  );
}

function useWidth() {
  const ref = useRef();
  const [w, setW] = useState(800);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

// Rect with only the top corners rounded (data-end rounded, square at baseline).
function topRounded(x, y, w, h, r) {
  r = Math.min(r, h, w / 2);
  if (h <= 0) return '';
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

function DailyChart({ state }) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  const [table, setTable] = useState(false);
  const today = todayKey();
  const mins = minutesByDate(state);
  const { map } = schedule(state);
  const doneOn = {};
  for (const [d, v] of Object.entries(map)) if (v.done) (doneOn[v.date] ??= []).push(d);

  const last = addDays(state.startDate, TOTAL_DAYS - 1);
  const end = today > last ? today : last;
  const firstLogged = Object.keys(mins).sort()[0];
  const begin = firstLogged && firstLogged < state.startDate ? firstLogged : state.startDate;
  const dates = [];
  for (let k = begin; k <= end; k = addDays(k, 1)) dates.push(k);

  const H = 220, padL = 40, padR = 12, padT = 14, padB = 28;
  const innerW = Math.max(100, width - padL - padR);
  const innerH = H - padT - padB;
  const maxV = Math.max(150, ...dates.map((k) => (mins[k] ? mins[k].lc + mins[k].sd : 0)));
  const yMax = Math.ceil(maxV / 50) * 50;
  const y = (v) => padT + innerH - (v / yMax) * innerH;
  const band = innerW / dates.length;
  const bw = Math.min(24, Math.max(3, band - 3));
  const ticks = Array.from({ length: yMax / 50 + 1 }, (_, i) => i * 50);
  const hasData = dates.some((k) => mins[k]);

  return (
    <div className="card panel">
      <div className="panel-head">
        <h2>Daily minutes</h2>
        <span className="muted" style={{ fontSize: 13 }}>Goal {TARGET_MIN} min/day</span>
        <span className="spacer" />
        <div className="legend">
          <span><i style={{ background: 'var(--lc)' }} />LeetCode</span>
          <span><i style={{ background: 'var(--sd)' }} />System design</span>
        </div>
        <button className="btn small ghost" onClick={() => setTable(!table)}>{table ? 'Chart' : 'Table'}</button>
      </div>
      {table ? (
        <div style={{ maxHeight: 260, overflowY: 'auto' }}>
          <table className="table">
            <thead><tr><th>Date</th><th>LeetCode</th><th>System design</th><th>Total</th></tr></thead>
            <tbody>
              {dates.filter((k) => mins[k]).reverse().map((k) => (
                <tr key={k}><td>{fmtDate(k, { weekday: 'short', month: 'short', day: 'numeric' })}</td><td>{fmtMin(mins[k].lc)}</td><td>{fmtMin(mins[k].sd)}</td><td><b>{fmtMin(mins[k].lc + mins[k].sd)}</b></td></tr>
              ))}
              {!hasData && <tr><td colSpan="4" className="muted">No time logged yet.</td></tr>}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="chart-wrap" ref={ref} onMouseLeave={() => setHover(null)}>
          <svg width={width} height={H} style={{ display: 'block' }}>
            {ticks.map((v) => (
              <g key={v}>
                <line x1={padL} x2={width - padR} y1={y(v)} y2={y(v)} stroke="var(--grid)" strokeWidth="1" />
                <text x={padL - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--text-3)">{v}</text>
              </g>
            ))}
            <line x1={padL} x2={width - padR} y1={y(TARGET_MIN)} y2={y(TARGET_MIN)} stroke="var(--text-3)" strokeWidth="1" />
            <text x={width - padR} y={y(TARGET_MIN) - 5} textAnchor="end" fontSize="11" fill="var(--text-2)" fontWeight="600">Goal</text>
            {dates.map((k, i) => {
              const m = mins[k] ?? { lc: 0, sd: 0 };
              const x = padL + i * band + (band - bw) / 2;
              const yl = y(m.lc), ys = y(m.lc + m.sd);
              const gap = m.lc > 0 && m.sd > 0 ? 2 : 0;
              return (
                <g key={k}>
                  {k === today && <rect x={padL + i * band} y={padT} width={band} height={innerH} fill="var(--surface-2)" />}
                  {m.lc > 0 && <path d={m.sd > 0 ? `M${x},${y(0)}V${yl}H${x + bw}V${y(0)}Z` : topRounded(x, yl, bw, y(0) - yl, 4)} fill="var(--lc)" opacity={hover && hover.k !== k ? 0.45 : 1} />}
                  {m.sd > 0 && <path d={topRounded(x, ys, bw, Math.max(0, yl - ys - gap), 4)} fill="var(--sd)" opacity={hover && hover.k !== k ? 0.45 : 1} />}
                  {(i % 7 === 0) && (
                    <text x={padL + i * band + band / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--text-3)">
                      {fmtDate(k, { month: 'short', day: 'numeric' })}
                    </text>
                  )}
                  <rect x={padL + i * band} y={padT} width={band} height={innerH} fill="transparent"
                    onMouseEnter={() => setHover({ k, x: padL + i * band + band / 2, m })} />
                </g>
              );
            })}
            {!hasData && (
              <text x={padL + innerW / 2} y={padT + innerH / 2} textAnchor="middle" fontSize="13" fill="var(--text-3)">
                Start a timer on the Today screen and your days will fill in here.
              </text>
            )}
          </svg>
          {hover && (
            <div className="tooltip" style={{ left: Math.min(hover.x + 12, width - 180), top: 10 }}>
              <div className="tt-title">{fmtDate(hover.k, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
              <div className="tt-row"><span className="dot" style={{ background: 'var(--lc)' }} />LeetCode<b>{fmtMin(hover.m.lc)}</b></div>
              <div className="tt-row"><span className="dot" style={{ background: 'var(--sd)' }} />System design<b>{fmtMin(hover.m.sd)}</b></div>
              <div className="tt-row" style={{ marginTop: 3 }}>Total<b>{fmtMin(hover.m.lc + hover.m.sd)}</b></div>
              {doneOn[hover.k] && <div className="tt-row" style={{ marginTop: 3, color: 'var(--good)' }}>✓ Finished Day {doneOn[hover.k].join(', ')}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TopicBars({ state }) {
  const rows = topicProgress(state);
  const [hover, setHover] = useState(null);
  return (
    <div>
      {rows.map((r) => {
        const pct = (n) => `${(n / r.total) * 100}%`;
        const segs = [['solved', 'var(--st-solved)'], ['hinted', 'var(--st-hinted)'], ['studied', 'var(--st-studied)']].filter(([k]) => r[k] > 0);
        return (
          <div key={r.key} className="topic-row" onMouseEnter={() => setHover(r.key)} onMouseLeave={() => setHover(null)}
            title={`${r.name}: ${r.solved} unaided, ${r.hinted} with hints, ${r.studied} studied, ${r.total - r.solved - r.hinted - r.studied} to go`}>
            <span style={{ fontWeight: hover === r.key ? 650 : 500 }}>{r.name}</span>
            <div className="topic-track">
              {segs.map(([k, c]) => <div key={k} style={{ width: pct(r[k]), background: c }} />)}
            </div>
            <span className="topic-count">{r.solved + r.hinted + r.studied}/{r.total}</span>
          </div>
        );
      })}
    </div>
  );
}

function SplitPanel({ lc, sd }) {
  const total = lc + sd;
  const lp = total ? (lc / total) * 100 : 50;
  return (
    <div className="card panel">
      <div className="panel-head"><h2>Overall split</h2><span className="spacer" /><span className="muted" style={{ fontSize: 13 }}>Target 50 / 50</span></div>
      <div className="row" style={{ justifyContent: 'space-between', fontSize: 13 }}>
        <span className="row" style={{ gap: 6 }}><span className="dot" style={{ background: 'var(--lc)' }} />LeetCode <b>{fmtMin(lc)}</b> <span className="muted">{total ? `${Math.round(lp)}%` : ''}</span></span>
        <span className="row" style={{ gap: 6 }}><span className="muted">{total ? `${Math.round(100 - lp)}%` : ''}</span> <b>{fmtMin(sd)}</b> System design<span className="dot" style={{ background: 'var(--sd)' }} /></span>
      </div>
      <div className="splitbar">
        {total > 0 && <div style={{ width: `${lp}%`, background: 'var(--lc)' }} />}
        {total > 0 && <div style={{ flex: 1, background: 'var(--sd)' }} />}
      </div>
      {total > 0 && Math.abs(lp - 50) > 15 && (
        <div className="muted" style={{ fontSize: 12.5 }}>
          You're leaning toward {lp > 50 ? 'LeetCode' : 'system design'}. Give {lp > 50 ? 'system design' : 'LeetCode'} a little more time this week.
        </div>
      )}
    </div>
  );
}

function SdPanel({ state }) {
  const phases = ['Fundamentals', 'Design Problems', 'Mock Interviews', 'Review'];
  const byPhase = phases.map((ph) => {
    const days = SD.filter((d) => d.phase === ph);
    const done = days.filter((d) => state.sd[d.day]?.status === 'done').length;
    return { ph, done, total: days.length };
  }).filter((r) => r.total);
  const conf = Object.values(state.sd).map((v) => v.confidence).filter(Boolean);
  const avgConf = conf.length ? (conf.reduce((a, b) => a + b, 0) / conf.length).toFixed(1) : null;
  const shaky = SD.filter((d) => state.sd[d.day]?.confidence && state.sd[d.day].confidence <= 2);
  return (
    <div className="card panel">
      <div className="panel-head">
        <h2>System design</h2>
        <span className="spacer" />
        {avgConf && <span className="muted" style={{ fontSize: 13 }}>Avg confidence {avgConf}/5</span>}
      </div>
      {byPhase.map((r) => (
        <div key={r.ph} className="topic-row" style={{ gridTemplateColumns: '130px 1fr 54px' }}>
          <span>{r.ph}</span>
          <div className="topic-track"><div style={{ width: `${(r.done / r.total) * 100}%`, background: 'var(--sd)' }} /></div>
          <span className="topic-count">{r.done}/{r.total}</span>
        </div>
      ))}
      {shaky.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div className="section-label">Revisit (confidence ≤ 2)</div>
          {shaky.slice(0, 5).map((d) => <div key={d.day} className="sd-item"><span className="dot" style={{ background: 'var(--sd)' }} />{d.title}</div>)}
        </div>
      )}
    </div>
  );
}

function RecentTable({ state }) {
  const rows = [
    ...Object.values(state.attempts).map((a) => ({ date: a.date, kind: 'LeetCode', what: PROBLEMS[a.slug]?.name ?? a.slug, status: STATUS_NAME[a.status], notes: a.notes, day: a.planDay })),
    ...Object.entries(state.sd).map(([d, v]) => ({ date: v.date, kind: 'System design', what: SD[d - 1]?.title, status: v.status === 'done' ? `Done${v.confidence ? ` · ${v.confidence}/5` : ''}` : 'Skipped', notes: v.notes, day: Number(d) })),
  ].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.day - a.day)).slice(0, 15);
  return (
    <div className="card panel" style={{ marginTop: 18 }}>
      <div className="panel-head"><h2>Recent activity</h2></div>
      <table className="table selectable">
        <thead><tr><th>Date</th><th>Track</th><th>Item</th><th>Result</th><th>Notes</th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="muted" style={{ whiteSpace: 'nowrap' }}>{fmtDate(r.date, { month: 'short', day: 'numeric' })}</td>
              <td><span className="row" style={{ gap: 6 }}><span className="dot" style={{ background: r.kind === 'LeetCode' ? 'var(--lc)' : 'var(--sd)' }} />{r.kind}</span></td>
              <td style={{ fontWeight: 550 }}>{r.what}</td>
              <td>{r.status}</td>
              <td className="muted" style={{ maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
