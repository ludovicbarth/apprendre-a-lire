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

export interface DragonColors {
  body: string;
  dark: string;
  belly: string;
  wing: string;
}

/** Un dragon dodu, plus grognon que méchant. Après la victoire il devient tout gentil (classe `friendly`). */
export function dragonEl(c: DragonColors, extra = ''): HTMLElement {
  return fromSvg(
    `<svg viewBox="0 0 280 250" xmlns="http://www.w3.org/2000/svg" aria-label="Le dragon">
  <ellipse cx="150" cy="238" rx="96" ry="10" fill="#1d1230" opacity=".18"/>
  <!-- queue -->
  <path d="M210 190 Q262 196 266 150 Q268 128 252 120 Q258 150 236 166 Q220 176 200 170 Z" fill="${c.body}"/>
  <path d="M252 120 l18 -12 -6 22 z" fill="${c.dark}"/>
  <!-- aile -->
  <g class="dragon-wing">
    <path d="M170 110 Q180 30 250 18 Q236 48 244 60 Q220 62 226 84 Q204 84 206 108 Z" fill="${c.wing}"/>
    <path d="M178 104 Q196 56 244 26 M196 104 Q210 76 236 62 M206 106 Q214 92 226 84" stroke="${c.dark}" stroke-width="3" fill="none" opacity=".6"/>
  </g>
  <!-- corps -->
  <ellipse cx="160" cy="170" rx="70" ry="62" fill="${c.body}"/>
  <ellipse cx="146" cy="182" rx="42" ry="44" fill="${c.belly}"/>
  <path d="M120 162 q26 8 52 0 M116 184 q30 8 60 0 M122 206 q24 8 48 0" stroke="${c.dark}" stroke-width="2.5" fill="none" opacity=".35"/>
  <!-- pattes -->
  <ellipse cx="118" cy="226" rx="24" ry="14" fill="${c.dark}"/><ellipse cx="190" cy="226" rx="24" ry="14" fill="${c.dark}"/>
  <path d="M100 230 v-6 M110 232 v-6 M172 230 v-6 M182 232 v-6" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="112" cy="168" rx="14" ry="22" fill="${c.body}" transform="rotate(30 112 168)"/>
  <!-- piquants du dos -->
  <path d="M170 106 l10 -18 8 20 z M196 116 l14 -14 4 22 z M216 136 l16 -8 -2 22 z" fill="${c.dark}"/>
  <!-- tête -->
  <g class="dragon-head">
    <path d="M60 92 Q58 50 100 42 Q146 36 160 76 Q170 110 140 126 Q110 140 76 128 Q42 120 40 104 Q40 92 60 92 Z" fill="${c.body}"/>
    <path d="M40 104 Q50 118 80 122" stroke="${c.dark}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="52" cy="98" r="3.5" fill="${c.dark}"/>
    <path d="M104 44 l-6 -30 20 24 z M134 52 l8 -30 8 34 z" fill="#f4e7c8"/>
    <ellipse cx="112" cy="80" rx="14" ry="16" fill="#fff"/>
    <circle class="dragon-pupil" cx="108" cy="82" r="8" fill="#1d1230"/>
    <circle cx="105" cy="78" r="3" fill="#fff"/>
    <path class="dragon-brow" d="M94 60 L128 70" stroke="${c.dark}" stroke-width="6" stroke-linecap="round"/>
    <path class="dragon-happy" d="M98 82 q14 -14 28 0" stroke="#1d1230" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse class="dragon-blush" cx="128" cy="104" rx="10" ry="6" fill="#ff8fa3" opacity=".7"/>
    <path class="dragon-teeth" d="M66 122 l5 8 5 -8 M82 126 l5 8 5 -8" fill="#fff"/>
  </g>
  <g class="dragon-hearts" fill="#ff5f8f">
    <path d="M40 40 c-6 -10 -20 -4 -14 8 l14 12 14 -12 c6 -12 -8 -18 -14 -8 z"/>
    <path d="M14 70 c-4 -7 -14 -3 -10 5 l10 8 10 -8 c4 -8 -6 -12 -10 -5 z"/>
  </g>
</svg>`,
    `dragon ${extra}`.trim(),
  );
}
