// Illustrations vectorielles : la petite sorcière et le décor de forêt.
// La sorcière reprend la tenue du dessin d'origine : chapeau violet, doudoune rose,
// écharpe blanche, corset lacé, robe violette et noire, baskets.

function fromSvg(svg: string, cls: string): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = cls;
  wrap.innerHTML = svg;
  return wrap;
}

const WITCH_SVG = `
<svg viewBox="0 0 220 320" xmlns="http://www.w3.org/2000/svg" aria-label="La petite sorcière">
  <defs>
    <linearGradient id="hat" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#a874f2"/><stop offset="1" stop-color="#6b2fc0"/>
    </linearGradient>
    <linearGradient id="jacket" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ff9fd0"/><stop offset="1" stop-color="#ec5fa8"/>
    </linearGradient>
    <linearGradient id="skirt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8b46d9"/><stop offset="1" stop-color="#5a23a8"/>
    </linearGradient>
    <linearGradient id="hair" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c47a3c"/><stop offset="1" stop-color="#9a5526"/>
    </linearGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#fff6b0"/><stop offset="1" stop-color="#ffd34a" stop-opacity="0"/></radialGradient>
  </defs>

  <ellipse cx="110" cy="308" rx="62" ry="9" fill="#1d1230" opacity=".15"/>

  <!-- cheveux (arrière) -->
  <path d="M64 112 C56 150 58 182 66 196 Q72 206 82 200 L138 200 Q148 206 154 196 C162 182 164 150 156 112 Z" fill="url(#hair)"/>

  <!-- jambes et baskets -->
  <rect x="91" y="262" width="12" height="32" rx="5" fill="#6a2a5c"/>
  <rect x="117" y="262" width="12" height="32" rx="5" fill="#6a2a5c"/>
  <path d="M80 296 q4 -12 22 -10 q6 2 6 12 v4 h-30 z" fill="#3b3670"/>
  <path d="M112 298 q0 -10 6 -12 q18 -2 22 10 v6 h-28 z" fill="#3b3670"/>
  <rect x="78" y="300" width="31" height="5" rx="2.5" fill="#f2f2fa"/>
  <rect x="111" y="300" width="31" height="5" rx="2.5" fill="#f2f2fa"/>
  <path d="M88 292 l10 -3 M90 296 l10 -3" stroke="#f2f2fa" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M122 289 l10 3 M120 293 l10 3" stroke="#f2f2fa" stroke-width="1.6" stroke-linecap="round"/>

  <!-- robe -->
  <path d="M78 214 L142 214 L170 270 Q150 262 140 274 Q124 262 110 275 Q96 262 80 274 Q70 262 50 270 Z" fill="url(#skirt)"/>
  <path d="M90 214 L130 214 L146 262 Q128 254 110 266 Q92 254 74 262 Z" fill="#2b1d3d" opacity=".85"/>

  <!-- buste : corset violet lacé -->
  <path d="M86 168 h48 l4 50 h-56 z" fill="#7b3fc4"/>
  <path d="M100 176 l20 10 M120 176 l-20 10 M100 190 l20 10 M120 190 l-20 10 M100 204 l20 10 M120 204 l-20 10"
        stroke="#2b1d3d" stroke-width="2.4" stroke-linecap="round"/>

  <!-- doudoune rose avec gilet sombre -->
  <path d="M70 168 Q66 196 74 222 L92 222 L92 168 Z" fill="url(#jacket)"/>
  <path d="M150 168 Q154 196 146 222 L128 222 L128 168 Z" fill="url(#jacket)"/>
  <path d="M86 168 L94 168 L94 222 L88 222 Z M126 168 L134 168 L132 222 L126 222 Z" fill="#2b1d3d"/>
  <path d="M71 186 h20 M70 204 h21 M129 186 h20 M129 204 h20" stroke="#d84a93" stroke-width="2" stroke-linecap="round" opacity=".7"/>

  <!-- bras gauche (le long du corps) -->
  <path d="M72 170 Q50 182 50 214 Q52 226 64 224 Q70 200 84 186 Z" fill="url(#jacket)"/>
  <path d="M53 200 q8 2 14 -2" stroke="#d84a93" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
  <circle cx="57" cy="227" r="9" fill="#f7cba6"/>

  <!-- bras droit levé avec la baguette -->
  <g class="wand-arm">
    <path d="M148 172 Q170 168 178 146 Q182 134 172 130 Q160 146 140 158 Z" fill="url(#jacket)"/>
    <path d="M160 160 q6 -4 8 -12" stroke="#d84a93" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
    <rect x="178" y="88" width="5" height="50" rx="2.5" fill="#5b3a22" transform="rotate(14 180 113)"/>
    <circle class="wand-glow" cx="190" cy="86" r="22" fill="url(#glow)"/>
    <path class="wand-star" d="M190 74 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1 z" fill="#ffd34a" stroke="#f0a500" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="176" cy="130" r="9" fill="#f7cba6"/>
  </g>

  <!-- écharpe -->
  <path d="M82 156 Q110 172 138 156 L140 170 Q110 186 80 170 Z" fill="#f4f4f8"/>
  <path d="M82 158 Q110 174 138 158" stroke="#dcdce8" stroke-width="2" fill="none"/>

  <!-- tête -->
  <circle cx="110" cy="122" r="40" fill="#f7cba6"/>
  <ellipse cx="88" cy="134" rx="8" ry="5" fill="#f58aa0" opacity=".55"/>
  <ellipse cx="132" cy="134" rx="8" ry="5" fill="#f58aa0" opacity=".55"/>
  <g class="eyes">
    <ellipse cx="95" cy="122" rx="7" ry="8.5" fill="#fff"/>
    <ellipse cx="125" cy="122" rx="7" ry="8.5" fill="#fff"/>
    <circle cx="96" cy="123" r="5.5" fill="#2f63c4"/>
    <circle cx="124" cy="123" r="5.5" fill="#2f63c4"/>
    <circle cx="96" cy="123" r="2.6" fill="#1d1230"/>
    <circle cx="124" cy="123" r="2.6" fill="#1d1230"/>
    <circle cx="98" cy="120.5" r="1.8" fill="#fff"/>
    <circle cx="126" cy="120.5" r="1.8" fill="#fff"/>
  </g>
  <path d="M87 109 q7 -4 14 -1 M119 108 q7 -3 14 1" stroke="#8a4a20" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path class="smile" d="M101 141 q9 8 18 0" stroke="#a33b4a" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse class="mouth" cx="110" cy="143" rx="5" ry="4" fill="#a33b4a"/>

  <!-- frange -->
  <path d="M70 116 Q76 84 110 84 Q146 84 152 118 Q140 104 126 104 Q118 112 104 106 Q92 112 82 104 Q74 108 70 116 Z" fill="url(#hair)"/>

  <!-- chapeau -->
  <g class="hat">
    <path d="M70 92 Q84 52 104 32 Q120 14 148 8 Q138 22 136 40 Q134 66 150 92 Z" fill="url(#hat)"/>
    <path d="M148 8 Q156 4 160 10 Q154 14 148 8 Z" fill="#6b2fc0"/>
    <path d="M72 86 Q110 76 148 86 L150 96 Q110 86 70 96 Z" fill="#2b1d3d"/>
    <ellipse cx="110" cy="96" rx="76" ry="13" fill="#7b3fc4"/>
    <ellipse cx="110" cy="93" rx="70" ry="8" fill="#9a5ee6" opacity=".55"/>
    <path d="M116 56 l2.5 5 5.5 .6 -4 3.8 1.2 5.4 -5.2 -2.8 -5.2 2.8 1.2 -5.4 -4 -3.8 5.5 -.6 z" fill="#ffd34a"/>
  </g>
</svg>`;

export function witchEl(extra = ''): HTMLElement {
  return fromSvg(WITCH_SVG, `witch ${extra}`.trim());
}

const FOREST_SVG = `
<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8fb3ef"/><stop offset=".55" stop-color="#c9d8f3"/><stop offset=".8" stop-color="#fbe3c4"/>
    </linearGradient>
    <radialGradient id="sun" cx=".72" cy=".52" r=".35"><stop offset="0" stop-color="#fff2c9"/><stop offset="1" stop-color="#fff2c9" stop-opacity="0"/></radialGradient>
    <linearGradient id="meadow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ccb6b"/><stop offset="1" stop-color="#6fae4f"/></linearGradient>
    <g id="pine">
      <path d="M0 -150 L40 -70 L22 -72 L56 -10 L-56 -10 L-22 -72 L-40 -70 Z"/>
      <rect x="-6" y="-12" width="12" height="18" fill="#6b4a2e"/>
    </g>
  </defs>
  <rect width="1600" height="1000" fill="url(#sky)"/>
  <rect width="1600" height="1000" fill="url(#sun)"/>
  <g fill="#fff" opacity=".85">
    <path d="M180 170 q20 -40 70 -30 q30 -40 80 -10 q50 -10 60 40 z"/>
    <path d="M1000 120 q20 -36 64 -26 q30 -36 74 -8 q44 -6 52 36 z"/>
    <path d="M1300 250 q14 -26 46 -18 q22 -26 54 -6 q32 -4 38 26 z" opacity=".7"/>
  </g>
  <path d="M0 560 Q200 470 420 520 T860 500 T1300 490 T1600 520 V1000 H0 Z" fill="#b6c7a8"/>
  <path d="M0 610 Q260 540 520 590 T1040 570 T1600 590 V1000 H0 Z" fill="#7fa77a"/>
  <g fill="#4f7e5a">
    <use href="#pine" transform="translate(90 660) scale(1.3)"/>
    <use href="#pine" transform="translate(190 650) scale(1.6)"/>
    <use href="#pine" transform="translate(300 670) scale(1.1)"/>
    <use href="#pine" transform="translate(1290 655) scale(1.5)"/>
    <use href="#pine" transform="translate(1400 670) scale(1.2)"/>
    <use href="#pine" transform="translate(1510 650) scale(1.7)"/>
  </g>
  <g fill="#3b6648">
    <use href="#pine" transform="translate(30 700) scale(1.8)"/>
    <use href="#pine" transform="translate(1570 705) scale(1.9)"/>
    <use href="#pine" transform="translate(1180 690) scale(1.1)"/>
  </g>
  <path d="M0 690 Q400 640 800 670 T1600 660 V1000 H0 Z" fill="url(#meadow)"/>
  <g opacity=".9">
    <circle cx="160" cy="800" r="7" fill="#fff"/><circle cx="174" cy="808" r="5" fill="#ffd34a"/>
    <circle cx="420" cy="880" r="7" fill="#f6a6d0"/><circle cx="660" cy="760" r="6" fill="#fff"/>
    <circle cx="980" cy="840" r="7" fill="#c8a0f0"/><circle cx="1220" cy="770" r="6" fill="#ffd34a"/>
    <circle cx="1400" cy="900" r="8" fill="#fff"/><circle cx="1470" cy="800" r="6" fill="#f6a6d0"/>
    <circle cx="300" cy="940" r="8" fill="#c8a0f0"/><circle cx="820" cy="950" r="7" fill="#ffd34a"/>
  </g>
</svg>`;

export function forestEl(): HTMLElement {
  return fromSvg(FOREST_SVG, 'bg');
}
