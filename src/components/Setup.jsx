import { useState } from 'react';
import { addDays, fmtDate, fromKey, todayKey, TOTAL_DAYS, TRACKS } from '../lib/model.js';

function nextMonday(today) {
  const dow = fromKey(today).getDay();
  return addDays(today, ((8 - dow) % 7) || 7);
}

export default function Setup({ onDone }) {
  const today = todayKey();
  const presets = [
    ['Today', today],
    ['Tomorrow', addDays(today, 1)],
    ['Next Monday', nextMonday(today)],
  ];
  const [start, setStart] = useState(today);
  const [track, setTrack] = useState('beginning');

  return (
    <div className="setup">
      <div className="drag-strip" style={{ left: 0 }} />
      <div className="setup-card card fade-in">
        <div className="brand-mark" style={{ width: 44, height: 44, fontSize: 21, borderRadius: 12 }}>D</div>
        <h1 style={{ marginTop: 18 }}>Lock in for 8 weeks.</h1>
        <p className="dim" style={{ margin: '6px 0 26px', fontSize: 15 }}>
          Every day: about 50 minutes of LeetCode and 50 minutes of system design. The app tells you exactly what to
          work on and tracks your progress.
        </p>

        <div className="section-label">When do you start?</div>
        <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
          {presets.map(([label, k]) => (
            <button key={label} className={`opt ${start === k ? 'on' : ''}`} onClick={() => setStart(k)}>
              <b>{label}</b>
              <span>{fmtDate(k, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </button>
          ))}
          <label className={`opt ${presets.every(([, k]) => k !== start) ? 'on' : ''}`}>
            <b>Pick a date</b>
            <input type="date" value={start} min={today} onChange={(e) => e.target.value && setStart(e.target.value)} />
          </label>
        </div>

        <div className="section-label" style={{ marginTop: 26 }}>Where are you starting on LeetCode?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(TRACKS).map(([k, t]) => (
            <button key={k} className={`opt wide ${track === k ? 'on' : ''}`} onClick={() => setTrack(k)}>
              <span className="radio" />
              <span>
                <b>{t.name}</b>
                <span>{t.detail}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="row" style={{ marginTop: 30 }}>
          <span className="muted" style={{ fontSize: 13 }}>
            You'll finish around {fmtDate(addDays(start, TOTAL_DAYS - 1), { month: 'long', day: 'numeric' })}.
          </span>
          <span className="spacer" />
          <button className="btn primary" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => onDone(start, track)}>
            Start my plan →
          </button>
        </div>
      </div>
    </div>
  );
}
