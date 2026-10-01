import { useEffect, useRef, useState } from 'react';
import { initialState } from './model.js';

const LS_KEY = 'doit-state';

async function load() {
  if (window.doit) return window.doit.load();
  try {
    return JSON.parse(localStorage.getItem(LS_KEY));
  } catch {
    return null;
  }
}

function save(state) {
  if (window.doit) return window.doit.save(state);
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {}
}

export function useStore() {
  const [state, setState] = useState(null);
  const timer = useRef();

  useEffect(() => {
    load().then((s) => {
      if (!s) return setState(initialState());
      // Saves from before the setup screen existed were made on the "continue" track.
      setState({ ...initialState(), track: 'continue', setupDone: true, ...s });
    });
  }, []);

  useEffect(() => {
    if (!state) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => save(state), 250);
  }, [state]);

  // Flush on quit so the last click is never lost.
  useEffect(() => {
    const flush = () => state && save(state);
    window.addEventListener('beforeunload', flush);
    return () => window.removeEventListener('beforeunload', flush);
  }, [state]);

  return [state, setState];
}
