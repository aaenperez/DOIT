import { useEffect, useMemo, useState } from 'react';
import { useStore } from './lib/store.js';
import { attemptKey, currentDay, setTrack, streaks, todayKey, TOTAL_DAYS } from './lib/model.js';
import Setup from './components/Setup.jsx';
import Sidebar from './components/Sidebar.jsx';
import TodayView from './components/TodayView.jsx';
import CalendarView from './components/CalendarView.jsx';
import ProgressView from './components/ProgressView.jsx';
import RoadmapView from './components/RoadmapView.jsx';

export default function App() {
  const [state, setState] = useStore();
  const [view, setView] = useState('today');
  const [day, setDay] = useState(null); // null = follow the current plan day
  const [, tick] = useState(0);

  // Re-render at midnight / when the window regains focus so "today" stays correct.
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 60_000);
    const f = () => tick((n) => n + 1);
    window.addEventListener('focus', f);
    return () => {
      clearInterval(t);
      window.removeEventListener('focus', f);
    };
  }, []);

  useEffect(() => {
    if (!state) return;
    const root = document.documentElement;
    if (state.theme === 'system') delete root.dataset.theme;
    else root.dataset.theme = state.theme;
    window.doit?.setTheme(state.theme);
  }, [state?.theme]);

  const actions = useMemo(() => {
    const up = (fn) => setState((s) => ({ ...s, ...fn(s) }));
    return {
      setStatus: (d, slug, status) =>
        up((s) => {
          const key = attemptKey(d, slug);
          const attempts = { ...s.attempts };
          const prev = attempts[key];
          if (prev?.status === status) delete attempts[key];
          else attempts[key] = { slug, planDay: d, date: todayKey(), notes: prev?.notes ?? '', status };
          return { attempts };
        }),
      setAttemptNotes: (d, slug, notes) =>
        up((s) => {
          const key = attemptKey(d, slug);
          const prev = s.attempts[key];
          if (!prev) return {};
          return { attempts: { ...s.attempts, [key]: { ...prev, notes } } };
        }),
      setSd: (d, patch) =>
        up((s) => {
          const prev = s.sd[d] ?? {};
          if (patch === null) {
            const sd = { ...s.sd };
            delete sd[d];
            return { sd };
          }
          return { sd: { ...s.sd, [d]: { date: todayKey(), ...prev, ...patch } } };
        }),
      setSdDraft: (d, patch) => up((s) => ({ sdDraft: { ...s.sdDraft, [d]: { ...s.sdDraft?.[d], ...patch } } })),
      toggleCheck: (key) => up((s) => ({ checks: { ...s.checks, [key]: !s.checks[key] } })),
      startTimer: (cat, d) =>
        up((s) => {
          const time = s.timer ? [...s.time, finish(s.timer)].filter(Boolean) : s.time;
          return { time, timer: { cat, planDay: d, startedAt: Date.now() } };
        }),
      stopTimer: () => up((s) => ({ time: [...s.time, finish(s.timer)].filter(Boolean), timer: null })),
      addTime: (cat, d, minutes) =>
        up((s) => ({ time: [...s.time, { id: crypto.randomUUID(), date: todayKey(), cat, minutes, planDay: d }] })),
      removeTime: (id) => up((s) => ({ time: s.time.filter((t) => t.id !== id) })),
      setTheme: (theme) => up(() => ({ theme })),
      finishSetup: (startDate, track) => up(() => ({ startDate, track, setupDone: true })),
    };
  }, [setState]);

  if (!state) return null;
  if (!state.setupDone) return <Setup onDone={actions.finishSetup} />;
  setTrack(state.track);

  const cur = currentDay(state);
  const shownDay = Math.min(day ?? cur, TOTAL_DAYS);
  const st = streaks(state);
  const open = (d) => {
    setDay(d);
    setView('today');
  };

  return (
    <div className="app">
      <div className="drag-strip" />
      <Sidebar view={view} setView={(v) => { setView(v); if (v === 'today') setDay(null); }} state={state} actions={actions} streak={st} cur={cur} />
      <main className="main">
        <div className="page fade-in" key={view + (view === 'today' ? shownDay : '')}>
          {view === 'today' && <TodayView state={state} actions={actions} day={shownDay} cur={cur} setDay={setDay} streak={st} />}
          {view === 'calendar' && <CalendarView state={state} open={open} />}
          {view === 'progress' && <ProgressView state={state} streak={st} />}
          {view === 'roadmap' && <RoadmapView state={state} open={open} cur={cur} />}
        </div>
      </main>
    </div>
  );
}

function finish(timer) {
  if (!timer) return null;
  const minutes = Math.round((Date.now() - timer.startedAt) / 60000);
  if (minutes < 1) return null;
  return { id: crypto.randomUUID(), date: todayKey(), cat: timer.cat, minutes: Math.min(minutes, 240), planDay: timer.planDay };
}
