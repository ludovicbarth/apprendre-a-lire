// Décors de l'aventure, en illustrations vectorielles (1600 x 1000, cadrés par le bas).

const svg = (defs: string, body: string) =>
  `<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${body}</svg>`;

const sky = (id: string, stops: [number, string][]) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join('')}</linearGradient>`;

const clouds = (fill = '#fff', opacity = 0.85) => `
  <g fill="${fill}" opacity="${opacity}">
    <path d="M180 170 q20 -40 70 -30 q30 -40 80 -10 q50 -10 60 40 z"/>
    <path d="M1000 120 q20 -36 64 -26 q30 -36 74 -8 q44 -6 52 36 z"/>
    <path d="M1300 250 q14 -26 46 -18 q22 -26 54 -6 q32 -4 38 26 z" opacity=".7"/>
  </g>`;

const pineDef = `<g id="pine"><path d="M0 -150 L40 -70 L22 -72 L56 -10 L-56 -10 L-22 -72 L-40 -70 Z"/><rect x="-6" y="-12" width="12" height="18" fill="#6b4a2e"/></g>`;

const flowers = (colors: string[]) => {
  const pts = [[160, 800], [420, 880], [660, 760], [980, 840], [1220, 770], [1400, 900], [1470, 800], [300, 940], [820, 950], [560, 900], [1100, 930]];
  return `<g opacity=".9">${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${6 + (i % 3)}" fill="${colors[i % colors.length]}"/>`).join('')}</g>`;
};

// 1. La prairie enchantée
const PRAIRIE = svg(
  sky('s', [[0, '#8fb3ef'], [0.55, '#c9d8f3'], [0.8, '#fbe3c4']]) +
    `<radialGradient id="sun" cx=".72" cy=".52" r=".35"><stop offset="0" stop-color="#fff2c9"/><stop offset="1" stop-color="#fff2c9" stop-opacity="0"/></radialGradient>
     <linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ccb6b"/><stop offset="1" stop-color="#6fae4f"/></linearGradient>` +
    pineDef,
  `<rect width="1600" height="1000" fill="url(#s)"/><rect width="1600" height="1000" fill="url(#sun)"/>${clouds()}
   <path d="M0 560 Q200 470 420 520 T860 500 T1300 490 T1600 520 V1000 H0 Z" fill="#b6c7a8"/>
   <path d="M0 610 Q260 540 520 590 T1040 570 T1600 590 V1000 H0 Z" fill="#7fa77a"/>
   <g fill="#4f7e5a">
     <use href="#pine" transform="translate(90 660) scale(1.3)"/><use href="#pine" transform="translate(190 650) scale(1.6)"/>
     <use href="#pine" transform="translate(300 670) scale(1.1)"/><use href="#pine" transform="translate(1290 655) scale(1.5)"/>
     <use href="#pine" transform="translate(1400 670) scale(1.2)"/><use href="#pine" transform="translate(1510 650) scale(1.7)"/>
   </g>
   <g fill="#3b6648"><use href="#pine" transform="translate(30 700) scale(1.8)"/><use href="#pine" transform="translate(1570 705) scale(1.9)"/></g>
   <path d="M0 690 Q400 640 800 670 T1600 660 V1000 H0 Z" fill="url(#m)"/>
   ${flowers(['#fff', '#ffd34a', '#f6a6d0', '#c8a0f0'])}`,
);

// 2. Le chemin de campagne
const CAMPAGNE = svg(
  sky('s', [[0, '#9cc6f2'], [0.6, '#d9ebf7'], [0.85, '#fff1d0']]) +
    `<linearGradient id="f1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9cf6a"/><stop offset="1" stop-color="#d8b44a"/></linearGradient>`,
  `<rect width="1600" height="1000" fill="url(#s)"/>${clouds()}
   <circle cx="1320" cy="190" r="70" fill="#fff4b8"/><circle cx="1320" cy="190" r="110" fill="#fff4b8" opacity=".3"/>
   <path d="M0 560 Q300 500 600 545 T1200 520 T1600 540 V1000 H0 Z" fill="#a9c98a"/>
   <path d="M0 600 Q400 560 800 600 T1600 590 V1000 H0 Z" fill="url(#f1)"/>
   <g stroke="#c9a03c" stroke-width="4" fill="none" opacity=".6"><path d="M0 640 Q400 610 800 640 T1600 630"/><path d="M0 680 Q400 650 800 680 T1600 670"/></g>
   <path d="M0 700 Q420 650 820 690 T1600 680 V1000 H0 Z" fill="#8cc063"/>
   <!-- ferme -->
   <g transform="translate(1180 560)">
     <rect x="0" y="40" width="150" height="90" fill="#fff3e0"/><path d="M-14 46 L75 -14 L164 46 Z" fill="#d9534f"/>
     <rect x="58" y="80" width="34" height="50" fill="#8a5a3b"/><rect x="18" y="62" width="26" height="22" fill="#9cd2f5"/><rect x="106" y="62" width="26" height="22" fill="#9cd2f5"/>
   </g>
   <!-- arbres ronds -->
   <g><rect x="292" y="560" width="16" height="70" fill="#7a5235"/><circle cx="300" cy="540" r="58" fill="#5c9a4a"/><circle cx="276" cy="520" r="30" fill="#6fb05a"/></g>
   <g><rect x="472" y="590" width="12" height="50" fill="#7a5235"/><circle cx="478" cy="574" r="40" fill="#5c9a4a"/></g>
   <!-- chemin -->
   <path d="M720 1000 C760 880 640 820 760 760 S900 700 860 690 L900 690 C960 720 860 780 900 820 S1020 900 980 1000 Z" fill="#d9b88a"/>
   <!-- barrière -->
   <g fill="#a9784c">
     <rect x="80" y="760" width="560" height="12" rx="4"/><rect x="80" y="800" width="560" height="12" rx="4"/>
     ${[100, 220, 340, 460, 580].map((x) => `<rect x="${x}" y="740" width="16" height="90" rx="4"/>`).join('')}
   </g>
   <!-- tournesols -->
   ${[1120, 1210, 1300, 1390, 1480].map((x, i) => `<g><rect x="${x - 3}" y="${800 - i * 6}" width="6" height="${120 + i * 6}" fill="#4f8a3a"/><circle cx="${x}" cy="${796 - i * 6}" r="24" fill="#ffc928"/><circle cx="${x}" cy="${796 - i * 6}" r="11" fill="#7a4a1e"/></g>`).join('')}
   ${flowers(['#fff', '#f6a6d0'])}`,
);

// 3. La forêt maléfique
const tree = (x: number, s: number, c: string) =>
  `<g transform="translate(${x} 760) scale(${s})" fill="${c}"><path d="M-14 0 C-10 -80 -30 -140 -6 -220 C-30 -250 -70 -250 -90 -280 C-60 -270 -30 -262 -2 -240 C0 -280 -20 -310 -10 -340 C6 -300 10 -270 12 -240 C40 -270 70 -280 96 -300 C76 -270 40 -250 18 -220 C30 -150 12 -80 16 0 Z"/></g>`;
const FORET = svg(
  sky('s', [[0, '#1f1638'], [0.55, '#3b2a63'], [0.85, '#6b4c8f']]) +
    `<radialGradient id="moon"><stop offset="0" stop-color="#f6f0d0"/><stop offset=".5" stop-color="#f6f0d0" stop-opacity=".25"/><stop offset="1" stop-color="#f6f0d0" stop-opacity="0"/></radialGradient>
     <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9a6dd" stop-opacity="0"/><stop offset=".45" stop-color="#b9a6dd" stop-opacity=".4"/><stop offset="1" stop-color="#b9a6dd" stop-opacity="0"/></linearGradient>`,
  `<rect width="1600" height="1000" fill="url(#s)"/>
   <circle cx="1240" cy="200" r="220" fill="url(#moon)"/><circle cx="1240" cy="200" r="70" fill="#f6f0d0"/><circle cx="1215" cy="185" r="12" fill="#e4dcb4"/>
   ${[[200, 90], [400, 140], [700, 60], [900, 120], [1500, 90], [80, 250]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff" opacity=".8"/>`).join('')}
   <path d="M0 620 Q300 560 640 600 T1300 580 T1600 600 V1000 H0 Z" fill="#2a1f45"/>
   ${tree(140, 1.6, '#160f29')}${tree(420, 1.2, '#1d1535')}${tree(1180, 1.4, '#1d1535')}${tree(1460, 1.8, '#160f29')}
   <path d="M0 720 Q400 680 800 710 T1600 700 V1000 H0 Z" fill="#3a2c55"/>
   <rect y="540" width="1600" height="460" fill="url(#fog)"/>
   <!-- yeux dans le noir -->
   <g fill="#ffe066"><ellipse cx="300" cy="640" rx="9" ry="6"/><ellipse cx="330" cy="640" rx="9" ry="6"/><ellipse cx="1300" cy="610" rx="8" ry="5"/><ellipse cx="1326" cy="610" rx="8" ry="5"/></g>
   <!-- champignons lumineux -->
   ${[[520, 800], [600, 830], [1050, 790], [1110, 820], [220, 860]].map(([x, y], i) => `<g><rect x="${x - 5}" y="${y}" width="10" height="${22 + i * 2}" rx="4" fill="#e9dcff"/><path d="M${x - 26} ${y + 2} Q${x} ${y - 34} ${x + 26} ${y + 2} Z" fill="${i % 2 ? '#b04de8' : '#ff5fa2'}"/><circle cx="${x - 8}" cy="${y - 10}" r="4" fill="#fff" opacity=".8"/></g>`).join('')}`,
);

// 4. Le bord de mer
const MER = svg(
  sky('s', [[0, '#5fb4f0'], [0.6, '#bfe6fb'], [1, '#e8f7ff']]) +
    `<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d8fd5"/><stop offset="1" stop-color="#53c1e8"/></linearGradient>
     <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e2b3"/><stop offset="1" stop-color="#ecd096"/></linearGradient>`,
  `<rect width="1600" height="1000" fill="url(#s)"/>${clouds()}
   <circle cx="300" cy="200" r="70" fill="#fff4b0"/><circle cx="300" cy="200" r="110" fill="#fff4b0" opacity=".3"/>
   <rect y="520" width="1600" height="480" fill="url(#sea)"/>
   <g stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55">
     <path d="M100 580 q30 -14 60 0 t60 0"/><path d="M700 620 q30 -14 60 0 t60 0"/><path d="M1200 570 q30 -14 60 0 t60 0"/><path d="M400 660 q30 -14 60 0 t60 0"/>
   </g>
   <!-- voilier -->
   <g transform="translate(980 520)"><path d="M-60 0 L60 0 L44 22 L-44 22 Z" fill="#c0392b"/><rect x="-3" y="-120" width="6" height="120" fill="#5b3a22"/><path d="M6 -112 L70 -10 L6 -10 Z" fill="#fff"/><path d="M-6 -90 L-50 -10 L-6 -10 Z" fill="#f4f4f4"/></g>
   <!-- phare -->
   <g transform="translate(1420 470)"><path d="M-30 210 L-20 0 L20 0 L30 210 Z" fill="#fff"/><path d="M-27 60 h54 v30 h-54 z M-24 140 h48 v30 h-48 z" fill="#e74c3c"/><rect x="-26" y="-34" width="52" height="34" fill="#f7d774"/><path d="M-32 -34 L0 -64 L32 -34 Z" fill="#e74c3c"/></g>
   <path d="M0 740 Q400 690 800 720 T1600 700 V1000 H0 Z" fill="#fff" opacity=".7"/>
   <path d="M0 760 Q400 710 800 740 T1600 720 V1000 H0 Z" fill="url(#sand)"/>
   <!-- coquillages et étoile de mer -->
   <path d="M300 880 l10 20 22 3 -16 15 4 22 -20 -10 -20 10 4 -22 -16 -15 22 -3 z" fill="#ff8a65"/>
   <g fill="#f8bbd0"><path d="M1100 900 q20 -30 40 0 z"/><path d="M600 940 q16 -24 32 0 z"/></g>
   <g fill="#9e9e9e"><ellipse cx="80" cy="780" rx="70" ry="40"/><ellipse cx="140" cy="800" rx="50" ry="28" fill="#bdbdbd"/></g>`,
);

// 5. Le château en ruine
const CHATEAU = svg(
  sky('s', [[0, '#f29a7e'], [0.5, '#f6c38b'], [0.85, '#fde3b3']]),
  `<rect width="1600" height="1000" fill="url(#s)"/>${clouds('#fff3e6', 0.7)}
   <circle cx="1180" cy="420" r="90" fill="#ffe2a8" opacity=".8"/>
   <path d="M0 600 Q400 540 800 580 T1600 560 V1000 H0 Z" fill="#b48f7c"/>
   <!-- ruines -->
   <g fill="#8d8199">
     <path d="M440 640 V360 h30 v-30 h30 v30 h30 v-30 h30 v30 h20 V640 Z"/>
     <path d="M580 640 V470 h400 V640 Z"/>
     <path d="M600 470 v-30 h40 v30 h40 v-20 h40 v20 h40 v-40 h40 v40 h40 v-14 h40 v14 h40 v-30 h20 v30 Z"/>
     <path d="M980 640 V300 h30 v-30 h30 v30 h30 v-50 l40 30 V640 Z"/>
   </g>
   <g fill="#726681">
     <rect x="490" y="420" width="24" height="44" rx="12"/><rect x="1030" y="360" width="24" height="44" rx="12"/>
     <path d="M740 640 V560 a40 40 0 0 1 80 0 V640 Z"/>
   </g>
   <g stroke="#726681" stroke-width="3" opacity=".7"><path d="M600 520 h360 M600 570 h360 M460 420 h110 M1000 400 h90"/></g>
   <!-- lierre -->
   <g fill="#5d8a4a"><circle cx="452" cy="380" r="14"/><circle cx="460" cy="410" r="12"/><circle cx="450" cy="440" r="13"/><circle cx="1110" cy="330" r="14"/><circle cx="1104" cy="360" r="12"/></g>
   <path d="M0 680 Q400 640 800 670 T1600 650 V1000 H0 Z" fill="#7d9a5a"/>
   <!-- éboulis -->
   <g fill="#9a8fa6"><rect x="300" y="760" width="70" height="40" rx="8" transform="rotate(-8 330 780)"/><rect x="1200" y="800" width="90" height="50" rx="10" transform="rotate(6 1240 820)"/><rect x="1300" y="840" width="50" height="30" rx="6"/><rect x="200" y="880" width="60" height="34" rx="8"/></g>
   ${flowers(['#fff', '#f6a6d0'])}`,
);

// 6. Le donjon
const DONJON = svg(
  `<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2438"/><stop offset="1" stop-color="#4a3d5c"/></linearGradient>
   <radialGradient id="torch"><stop offset="0" stop-color="#ffb347" stop-opacity=".6"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
   <pattern id="bricks" width="160" height="80" patternUnits="userSpaceOnUse">
     <rect width="160" height="80" fill="none"/><path d="M0 0 H160 M0 40 H160 M0 0 V40 M80 40 V80 M160 0 V40" stroke="#1d1728" stroke-width="4"/>
   </pattern>`,
  `<rect width="1600" height="1000" fill="url(#wall)"/><rect width="1600" height="740" fill="url(#bricks)" opacity=".7"/>
   <!-- arches -->
   <g fill="#140f1d"><path d="M200 740 V420 a110 110 0 0 1 220 0 V740 Z"/><path d="M1180 740 V420 a110 110 0 0 1 220 0 V740 Z"/><path d="M660 740 V360 a140 140 0 0 1 280 0 V740 Z"/></g>
   <g fill="#3a1a1a" opacity=".6"><rect x="690" y="420" width="220" height="320"/></g>
   <g stroke="#5a4a6a" stroke-width="10"><path d="M720 420 V740 M780 400 V740 M840 400 V740 M880 420 V740"/></g>
   <!-- torches -->
   ${[520, 1080].map((x) => `<g><circle cx="${x}" cy="380" r="140" fill="url(#torch)"/><rect x="${x - 8}" y="390" width="16" height="70" rx="4" fill="#6b4a2e"/><path d="M${x} 320 q-26 40 -14 64 q14 12 28 0 q12 -24 -14 -64 z" fill="#ff9f1c"/><path d="M${x} 348 q-12 20 -6 34 q6 6 12 0 q6 -14 -6 -34 z" fill="#ffe066"/></g>`).join('')}
   <!-- chaînes -->
   <g stroke="#8a7f99" stroke-width="6" fill="none">${[100, 1500].map((x) => `<path d="M${x} 0 v40 m0 10 v30 m0 10 v30 m0 10 v30"/>`).join('')}</g>
   <!-- sol dallé -->
   <path d="M0 740 H1600 V1000 H0 Z" fill="#3b3148"/>
   <g stroke="#262030" stroke-width="5"><path d="M0 800 H1600 M0 880 H1600 M0 960 H1600"/>${[200, 500, 800, 1100, 1400].map((x, i) => `<path d="M${x + (i % 2) * 60} 740 L${x - 100} 1000"/>`).join('')}</g>
   <g fill="#e8e0d0" opacity=".6"><circle cx="300" cy="900" r="10"/><rect x="310" y="895" width="40" height="8" rx="4"/></g>`,
);

export const SCENES = { prairie: PRAIRIE, campagne: CAMPAGNE, foret: FORET, mer: MER, chateau: CHATEAU, donjon: DONJON };
export type SceneId = keyof typeof SCENES;

let current: HTMLElement | null = null;
let currentId: SceneId | null = null;

/** Change le décor de fond (avec un fondu). */
export function setScene(id: SceneId): void {
  if (id === currentId) return;
  currentId = id;
  const el = document.createElement('div');
  el.className = 'bg';
  // Identifiants uniques par décor : deux décors coexistent pendant le fondu.
  el.innerHTML = SCENES[id].replace(/id="([^"]+)"/g, `id="${id}-$1"`).replace(/#([a-z0-9]+)\b(?=[")])/gi, (m, x) =>
    /^[0-9a-f]{3,6}$/i.test(x) ? m : `#${id}-${x}`,
  );
  document.body.prepend(el);
  const old = current;
  current = el;
  if (old) {
    old.classList.add('bg-out');
    setTimeout(() => old.remove(), 600);
  }
}
