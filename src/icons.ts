// Icônes fines (traits arrondis), en SVG.
const wrap = (d: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

export const ICONS = {
  listen: wrap('<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" stroke="none"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>'),
  mic: wrap('<rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" stroke="none"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6"/>'),
  next: wrap('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  home: wrap('<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>'),
  replay: wrap('<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4h4"/>'),
  gear: wrap('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>'),
};

export function icon(name: keyof typeof ICONS): HTMLSpanElement {
  const s = document.createElement('span');
  s.className = 'icon';
  s.innerHTML = ICONS[name];
  return s;
}
