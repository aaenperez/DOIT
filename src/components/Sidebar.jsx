import { ICalendar, IChart, IMap, ITodayIcon } from './icons.jsx';
import { TOTAL_DAYS } from '../lib/model.js';

const NAV = [
  ['today', 'Today', ITodayIcon],
  ['calendar', 'Calendar', ICalendar],
  ['progress', 'Progress', IChart],
  ['roadmap', 'Roadmap', IMap],
];

export default function Sidebar({ view, setView, state, actions, streak, cur }) {
  const done = Math.min(cur - 1, TOTAL_DAYS);
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">D</div>
        <div>
          <div className="brand-name">DOIT</div>
          <div className="brand-sub">Interview prep</div>
        </div>
      </div>
      {NAV.map(([key, label, Icon]) => (
        <button key={key} className={`nav-item ${view === key ? 'active' : ''}`} onClick={() => setView(key)}>
          <Icon />
          {label}
        </button>
      ))}

      <div className="sidebar-foot">
        <div className="streak-box">
          <div className="row" style={{ gap: 8 }}>
            <span style={{ fontSize: 22 }}>{streak.current > 0 ? '🔥' : '🕯️'}</span>
            <div>
              <div className="streak-num">{streak.current}</div>
            </div>
          </div>
          <div className="streak-label">
            day streak{streak.best > streak.current ? ` · best ${streak.best}` : ''}
            {!streak.activeToday && streak.current > 0 ? ' · keep it alive today' : ''}
          </div>
          <div style={{ marginTop: 10, height: 6, borderRadius: 99, background: 'var(--surface-3)', overflow: 'hidden' }}>
            <div style={{ width: `${(done / TOTAL_DAYS) * 100}%`, height: '100%', background: 'var(--text)', borderRadius: 99 }} />
          </div>
          <div className="streak-label" style={{ marginTop: 6 }}>
            {done} of {TOTAL_DAYS} plan days done
          </div>
        </div>
        <div className="seg">
          {['system', 'light', 'dark'].map((t) => (
            <button key={t} className={state.theme === t ? 'on' : ''} onClick={() => actions.setTheme(t)}>
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {window.doit && (
          <button className="link-quiet" onClick={() => window.doit.reveal()}>
            Show data file in Finder
          </button>
        )}
      </div>
    </aside>
  );
}
