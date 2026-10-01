import { useEffect, useState } from 'react';
import {
  attemptKey, dayStatus, fmtDate, fmtMin, lcDay, latestAttempts, minutesByDate, PROBLEMS, schedule, sdDay,
  TARGET_MIN, todayKey, TOPICS, TOTAL_DAYS,
} from '../lib/model.js';
import { IArticle, IBook, ICheck, IChevL, IChevR, ICode, IExt, ILayers, IPlay, IStop, IVideo } from './icons.jsx';

const STATUS = [
  ['solved', 'Solved'],
  ['hinted', 'With hints'],
  ['studied', 'Studied'],
  ['skipped', 'Skip'],
];
const STATUS_LABEL = { solved: 'solved unaided', hinted: 'used hints', studied: 'studied it', skipped: 'skipped' };
const DIFF = { E: 'Easy', M: 'Medium', H: 'Hard' };

export default function TodayView({ state, actions, day, cur, setDay, streak }) {
  const today = todayKey();
  const { map, finishedToday } = schedule(state, today);
  const status = dayStatus(state, day);
  const date = map[day].date;
  const sd = sdDay(day);
  const lc = lcDay(day);
  const mins = minutesByDate(state)[today] ?? { lc: 0, sd: 0 };
  const todayTotal = mins.lc + mins.sd;
  const allDone = cur > TOTAL_DAYS;

  let banner = null;
  if (allDone) banner = { good: true, emoji: '🏆', text: 'All 56 days complete. You locked in. Go get the offer.' };
  else if (status.complete)
    banner = { good: true, emoji: '✅', text: `Day ${day} complete${status.completedOn ? ` · finished ${fmtDate(status.completedOn, { month: 'short', day: 'numeric' })}` : ''}.${day === cur - 1 && streak.current > 1 ? ` ${streak.current}-day streak 🔥` : ''}` };
  else if (day === cur && finishedToday)
    banner = { good: true, emoji: '🎉', text: "You've finished today's plan. This is tomorrow's, so get ahead if you still have energy." };
  else if (day === cur && today < state.startDate)
    banner = { emoji: '🚀', text: `The plan officially starts ${fmtDate(state.startDate, { weekday: 'long', month: 'short', day: 'numeric' })}. Starting early counts.` };
  else if (day > cur) banner = { emoji: '🔭', text: `Preview: you'll reach this day around ${fmtDate(date, { month: 'short', day: 'numeric' })}. Finish Day ${cur} first.` };

  const doneTasks = status.lcCount + (status.sdDone ? 1 : 0);
  const totalTasks = status.items.length + 1;

  return (
    <>
      <div className="today-head">
        <div>
          <div className="eyebrow">
            Day {day} of {TOTAL_DAYS} · Week {Math.ceil(day / 7)} · {sd.phase}
          </div>
          <h1>{date === today ? 'Today' : fmtDate(date, { weekday: 'long' })}, {fmtDate(date, { month: 'long', day: 'numeric' })}</h1>
        </div>
        <div className="spacer" />
        <div className="row" style={{ gap: 6 }}>
          <button className="icon-btn" disabled={day <= 1} onClick={() => setDay(day - 1)} title="Previous day"><IChevL /></button>
          <button className="btn small" disabled={day === cur} onClick={() => setDay(null)}>Current</button>
          <button className="icon-btn" disabled={day >= TOTAL_DAYS} onClick={() => setDay(day + 1)} title="Next day"><IChevR /></button>
        </div>
      </div>

      {banner && (
        <div className={`banner ${banner.good ? 'good' : ''}`}>
          <span className="emoji">{banner.emoji}</span>
          {banner.text}
        </div>
      )}

      <div className="card daybar">
        <div>
          <div className="row" style={{ marginBottom: 8, fontSize: 13 }}>
            <b>Time today</b>
            <span className="muted">{fmtMin(todayTotal)} of {fmtMin(TARGET_MIN)} goal</span>
            <span className="spacer" />
            <span className="legend">
              <span><i style={{ background: 'var(--lc)' }} />LeetCode {fmtMin(mins.lc)}</span>
              <span><i style={{ background: 'var(--sd)' }} />System design {fmtMin(mins.sd)}</span>
            </span>
          </div>
          <div className="daybar-track">
            <div style={{ width: `${Math.min(100, (mins.lc / TARGET_MIN) * 100)}%`, background: 'var(--lc)' }} />
            <div style={{ width: `${Math.min(100 - Math.min(100, (mins.lc / TARGET_MIN) * 100), (mins.sd / TARGET_MIN) * 100)}%`, background: 'var(--sd)' }} />
          </div>
        </div>
        <div className="daybar-stats">
          <div><b>{doneTasks}/{totalTasks}</b><span className="muted">tasks</span></div>
          <div><b>{streak.current}🔥</b><span className="muted">streak</span></div>
        </div>
      </div>

      <div className="cols">
        <LeetCodeBlock state={state} actions={actions} day={day} lc={lc} status={status} />
        <SystemDesignBlock state={state} actions={actions} day={day} sd={sd} />
      </div>
    </>
  );
}

function Timer({ state, actions, cat, day, color }) {
  const running = state.timer?.cat === cat;
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [running]);
  const secs = running ? Math.max(0, Math.floor((now - state.timer.startedAt) / 1000)) : 0;
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return (
    <div className="timer">
      {running && <span className="timer-time">{mm}:{ss}</span>}
      <button
        className="timer-btn"
        style={{ background: running ? 'var(--text)' : color, color: running ? 'var(--bg)' : '#fff' }}
        onClick={() => (running ? actions.stopTimer() : actions.startTimer(cat, day))}
      >
        {running ? <><IStop /> Stop &amp; log</> : <><IPlay /> Start</>}
      </button>
    </div>
  );
}

function TimeLog({ state, actions, cat, day }) {
  const today = todayKey();
  const entries = state.time.filter((t) => t.cat === cat && t.date === today);
  const total = entries.reduce((s, t) => s + t.minutes, 0);
  const [edit, setEdit] = useState(false);
  return (
    <div className="timelog">
      <span>Logged today: <b style={{ color: 'var(--text)' }}>{fmtMin(total)}</b> / 50m</span>
      <span className="spacer" />
      <span>Add</span>
      {[5, 15, 30].map((m) => (
        <button key={m} className="btn small" onClick={() => actions.addTime(cat, day, m)}>+{m}m</button>
      ))}
      {entries.length > 0 && (
        <button className="btn small ghost" onClick={() => setEdit(!edit)}>{edit ? 'Done' : 'Edit'}</button>
      )}
      {edit && (
        <div style={{ width: '100%', display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
          {entries.map((t) => (
            <button key={t.id} className="chip" onClick={() => actions.removeTime(t.id)} title="Remove this entry">
              {fmtMin(t.minutes)} ✕
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LeetCodeBlock({ state, actions, day, lc, status }) {
  const topic = lc.topic ? TOPICS[lc.topic] : null;
  const latest = latestAttempts(state);
  return (
    <section className="card">
      <div className="block-head">
        <div className="block-title">
          <span className="block-icon" style={{ background: 'var(--lc-soft)', color: 'var(--lc)' }}><ICode /></span>
          LeetCode
        </div>
        <span className="chip">~50 min</span>
        <span className="spacer" />
        <Timer state={state} actions={actions} cat="lc" day={day} color="var(--lc)" />
      </div>
      <div className="block-body">
        <TimeLog state={state} actions={actions} cat="lc" day={day} />

        {lc.kind === 'new' && topic && (
          <div className="callout">
            <div className="row" style={{ marginBottom: 4 }}>
              <span className="chip" style={{ background: 'var(--lc-soft)', color: 'var(--text)' }}>{topic.name}</span>
            </div>
            <div><b>Pattern:</b> {topic.pattern}</div>
            <div><b>Spot it when:</b> {topic.trigger}</div>
          </div>
        )}
        {lc.kind === 'review' && (
          <div className="callout">
            <b>Review day.</b> Re-solve these cold, with no notes and no hints for the first 15 minutes. Before coding, say the pattern out loud.
            {status.items.length === 0 && ' Nothing is flagged for review. Use the time for a timed medium from a topic you have already done.'}
          </div>
        )}
        {lc.kind === 'mock' && (
          <div className="callout">
            <b>Mock set.</b> Give yourself 45 minutes for both problems. Talk through your approach out loud as if an interviewer were there, and use no hints until the timer ends.
          </div>
        )}
        {lc.note && <div className="callout note">{lc.note}</div>}

        {status.items.map((item, i) => {
          const p = PROBLEMS[item.slug];
          const a = state.attempts[attemptKey(day, item.slug)];
          const prev = latest[item.slug] && latest[item.slug].planDay !== day ? latest[item.slug] : null;
          return (
            <Problem
              key={item.slug} n={i + 1} p={p} a={a} reason={item.reason} prev={prev}
              onStatus={(s) => actions.setStatus(day, item.slug, s)}
              onNotes={(t) => actions.setAttemptNotes(day, item.slug, t)}
            />
          );
        })}
      </div>
    </section>
  );
}

function Problem({ n, p, a, reason, prev, onStatus, onNotes }) {
  const [showNote, setShowNote] = useState(!!a?.notes);
  return (
    <div className={`problem ${a ? 'done' : ''}`}>
      <div className="problem-top">
        <div className={`pnum ${a && a.status !== 'skipped' ? 'check' : ''}`}>
          {a && a.status !== 'skipped' ? <ICheck /> : n}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="pname">
            <a href={p.url} target="_blank" rel="noreferrer">{p.name}</a>
          </div>
          <div className="pmeta">
            <span className={`diff ${p.diff}`}>{DIFF[p.diff]}</span>
            <span>Target: {p.target}</span>
            <a href={p.url} target="_blank" rel="noreferrer">{p.premium ? 'NeetCode' : 'LeetCode'} ↗</a>
            <a href={p.video} target="_blank" rel="noreferrer">Explanation video ↗</a>
          </div>
          {reason && <div className="pmeta" style={{ marginTop: 6 }}>↻ {reason}{prev?.notes ? ` · "${prev.notes}"` : ''}</div>}
          {!reason && prev && (
            <div className="pmeta" style={{ marginTop: 6 }}>
              Last time you {STATUS_LABEL[prev.status]} ({fmtDate(prev.date, { month: 'short', day: 'numeric' })}){prev.notes ? `: "${prev.notes}"` : ''}
            </div>
          )}
        </div>
      </div>
      <div className="row" style={{ flexWrap: 'wrap' }}>
        <div className="status-row">
          {STATUS.map(([k, label]) => (
            <button key={k} className={`status-btn ${k} ${a?.status === k ? 'on' : ''}`} onClick={() => onStatus(k)}>
              {label}
            </button>
          ))}
        </div>
        <span className="spacer" />
        {a && !showNote && <button className="note-toggle" onClick={() => setShowNote(true)}>+ Note</button>}
      </div>
      {a && showNote && (
        <textarea
          className="note" placeholder="What tripped you up? What's the key insight?"
          value={a.notes ?? ''} onChange={(e) => onNotes(e.target.value)} autoFocus={!a.notes}
        />
      )}
    </div>
  );
}

const KIND_ICON = { video: IVideo, article: IArticle, guide: IBook };

function SystemDesignBlock({ state, actions, day, sd }) {
  const log = state.sd[day];
  const draft = { ...state.sdDraft?.[day], ...log };
  return (
    <section className="card">
      <div className="block-head">
        <div className="block-title">
          <span className="block-icon" style={{ background: 'var(--sd-soft)', color: 'var(--sd)' }}><ILayers /></span>
          System Design
        </div>
        <span className="chip">~50 min</span>
        <span className="spacer" />
        <Timer state={state} actions={actions} cat="sd" day={day} color="var(--sd)" />
      </div>
      <div className="block-body">
        <TimeLog state={state} actions={actions} cat="sd" day={day} />
        <div>
          <span className="chip" style={{ background: 'var(--sd-soft)', color: 'var(--text)', marginBottom: 8 }}>{sd.phase}</span>
          <div className="sd-title" style={{ marginTop: 8 }}>{sd.title}</div>
          <div className="dim selectable" style={{ marginTop: 4 }}>{sd.summary}</div>
        </div>

        <div>
          <div className="section-label">Study · ~{sd.resources.reduce((s, r) => s + (r.minutes || 0), 0)} min</div>
          <div className="res">
            {sd.resources.map((r) => {
              const Icon = KIND_ICON[r.kind] ?? IArticle;
              return (
                <a key={r.url} href={r.url} target="_blank" rel="noreferrer">
                  <span className="res-icon" style={{ color: 'var(--sd)' }}><Icon /></span>
                  <span style={{ minWidth: 0 }}>
                    <div className="res-label">{r.label}</div>
                    <div className="res-src">{r.source}{r.minutes ? ` · ${r.minutes} min` : ''}</div>
                  </span>
                  <span className="res-arrow"><IExt /></span>
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <div className="section-label">Answer out loud</div>
          <div className="qlist">
            {sd.questions.map((q, i) => {
              const key = `sd:${day}:${i}`;
              const on = !!state.checks[key];
              return (
                <button key={i} className={`q ${on ? 'on' : ''}`} onClick={() => actions.toggleCheck(key)}>
                  <span className="cbox">{on && <ICheck />}</span>
                  <span className="q-text">{q}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="callout selectable">
          <div className="section-label" style={{ marginBottom: 4 }}>Exercise</div>
          <span style={{ color: 'var(--text)' }}>{sd.exercise}</span>
        </div>

        {sd.keyTerms?.length > 0 && (
          <div>
            <div className="section-label">Key terms</div>
            <div className="terms">{sd.keyTerms.map((t) => <span key={t} className="chip">{t}</span>)}</div>
          </div>
        )}

        <div>
          <div className="section-label">How well could you explain this in an interview?</div>
          <div className="conf">
            {[1, 2, 3, 4, 5].map((c) => (
              <button
                key={c} className={draft.confidence === c ? 'on' : ''}
                onClick={() => (log ? actions.setSd(day, { confidence: c }) : actions.setSdDraft(day, { confidence: c }))}
              >
                {c}
              </button>
            ))}
            <span className="muted" style={{ fontSize: 12, marginLeft: 6 }}>1 = lost · 5 = could teach it</span>
          </div>
        </div>

        <textarea
          className="note" placeholder="Notes: key takeaways, diagrams to redraw, open questions…"
          value={draft.notes ?? ''}
          onChange={(e) => (log ? actions.setSd(day, { notes: e.target.value }) : actions.setSdDraft(day, { notes: e.target.value }))}
        />

        <div className="block-foot">
          {log ? (
            <>
              <span className="done-pill">
                <ICheck width="15" height="15" /> {log.status === 'skipped' ? 'Skipped' : 'Completed'} {fmtDate(log.date, { month: 'short', day: 'numeric' })}
              </span>
              <span className="spacer" />
              <button className="btn small ghost" onClick={() => actions.setSd(day, null)}>Undo</button>
            </>
          ) : (
            <>
              <button className="btn primary" onClick={() => actions.setSd(day, { status: 'done', ...state.sdDraft?.[day] })}>
                <ICheck width="14" height="14" /> Mark complete
              </button>
              <button className="btn ghost" onClick={() => actions.setSd(day, { status: 'skipped', ...state.sdDraft?.[day] })}>Skip</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
