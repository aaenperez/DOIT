const S = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props} />
);

export const ITodayIcon = () => (
  <S><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></S>
);
export const ICalendar = () => (
  <S><rect x="3" y="4.5" width="18" height="16.5" rx="3" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4" /></S>
);
export const IChart = () => (
  <S><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></S>
);
export const IMap = () => (
  <S><path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4Z" /><path d="M9 4v13.5M15 6.5V20" /></S>
);
export const ICode = () => (
  <S><path d="m8 7-5 5 5 5M16 7l5 5-5 5" /></S>
);
export const ILayers = () => (
  <S><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></S>
);
export const IPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" /></svg>
);
export const IStop = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="3" /></svg>
);
export const ICheck = (p) => (
  <S strokeWidth="3.2" {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></S>
);
export const IChevL = () => (
  <S width="16" height="16"><path d="m15 18-6-6 6-6" /></S>
);
export const IChevR = () => (
  <S width="16" height="16"><path d="m9 18 6-6-6-6" /></S>
);
export const IArticle = () => (
  <S><rect x="4" y="3" width="16" height="18" rx="2.5" /><path d="M8 8h8M8 12h8M8 16h5" /></S>
);
export const IVideo = () => (
  <S><rect x="2.5" y="5" width="15" height="14" rx="3" /><path d="m17.5 10 4-2.5v9l-4-2.5" /></S>
);
export const IBook = () => (
  <S><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5v-15Z" /><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20" /></S>
);
export const IExt = () => (
  <S width="14" height="14"><path d="M7 17 17 7M9 7h8v8" /></S>
);
