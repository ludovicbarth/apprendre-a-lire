// Rendu pixel art : sprites décrits en grilles de caractères, émojis pixelisés et décor de forêt.

export type Palette = Record<string, string>;

export function spriteCanvas(rows: string[], palette: Palette): HTMLCanvasElement {
  const w = Math.max(...rows.map((r) => r.length));
  const c = document.createElement('canvas');
  c.width = w;
  c.height = rows.length;
  const g = c.getContext('2d')!;
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const col = palette[row[x]];
      if (col) {
        g.fillStyle = col;
        g.fillRect(x, y, 1, 1);
      }
    }
  });
  c.className = 'pixel';
  return c;
}

/** Dessine un émoji en très basse résolution : affiché agrandi, il prend un aspect pixel art. */
export function pixelEmoji(emoji: string, size = 20): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const g = c.getContext('2d')!;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = `${Math.floor(size * 0.85)}px "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
  g.fillText(emoji, size / 2, size / 2 + 1);
  // Seuil sur la transparence pour des bords nets, sans anticrénelage.
  const img = g.getImageData(0, 0, size, size);
  for (let i = 3; i < img.data.length; i += 4) img.data[i] = img.data[i] > 110 ? 255 : 0;
  g.putImageData(img, 0, 0);
  c.className = 'pixel';
  return c;
}

const WITCH_PALETTE: Palette = {
  K: '#1d1230', // contour
  P: '#7b3fc4', // chapeau
  L: '#a978f0', // reflet du chapeau
  D: '#2b1d3d', // bandeau, robe sombre
  H: '#b8682e', // cheveux
  S: '#f6caa2', // peau
  c: '#f2899b', // joues
  W: '#ffffff',
  E: '#2f5bb7', // yeux
  M: '#a33b4a', // bouche
  F: '#eeeeee', // écharpe
  J: '#f06bb3', // doudoune rose
  j: '#c2407f',
  k: '#ffa6d4',
  V: '#7a35c8', // robe violette
  B: '#3a3566', // baskets
  b: '#e4e4f0',
};

// 24 x 35 pixels. La sorcière, gentille, avec chapeau violet et doudoune rose.
const WITCH_ROWS = [
  '...............KK.......',
  '..............KPPK......',
  '.............KPPK.......',
  '............KPPPK.......',
  '...........KPPPPK.......',
  '..........KLPPPPPK......',
  '.........KLPPPPPPPK.....',
  '........KDDDDDDDDDDK....',
  '....KKPPPPPPPPPPPPPPKK..',
  '...KPPLLPPPPPPPPPPPPPPK.',
  '....KKKKKKKKKKKKKKKKKK..',
  '.......KHHHHHHHHHK......',
  '......KHHSSSSSSSHHK.....',
  '......KHSWESSSWESHK.....',
  '......KHSWESSSWESHK.....',
  '......KHScSSSSScSHK.....',
  '......KHSSSMMMSSSHK.....',
  '.....KHHKSSSSSSSKHHK....',
  '.....KHHKFFFFFFFKHHK....',
  '....KjJJKFFFFFFFKJJjK...',
  '...KjJJJJKVVVVVKJJJJjK..',
  '..KjJJkJJKVDVDVKJJkJJjK.',
  '..KjJJkJJKVVVVVKJJkJJjK.',
  '..KjJJJJJKVDVDVKJJJJJjK.',
  '..KSSjjjjKVVVVVKjjjjSSK.',
  '..KSSKKKKDDDDDDDKKKKSSK.',
  '...KK..KDDDDDDDDDK..KK..',
  '......KDDVDDDDDVDDK.....',
  '.....KDDVVDDDDDVVDDK....',
  '....KDDVVVDDDDDVVVDDK...',
  '...KVVVVVVVVVVVVVVVVVK..',
  '...KKKKKKKKKKKKKKKKKKK..',
  '......KBBK.....KBBK.....',
  '.....KbBBBK...KBBBbK....',
  '.....KKKKKK...KKKKKK....',
];

export function witchCanvas(): HTMLCanvasElement {
  return spriteCanvas(WITCH_ROWS, WITCH_PALETTE);
}

/** Décor : ciel, montagnes, sapins et prairie, en basse résolution. */
export function forestCanvas(w = 160, h = 90, seed = 7): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);

  const sky = ['#4a6fc0', '#5b82cc', '#7397d4', '#93b0dc', '#b8c8de', '#e9d8b8', '#f4dfae'];
  const band = Math.ceil((h * 0.55) / sky.length);
  sky.forEach((col, i) => {
    g.fillStyle = col;
    g.fillRect(0, i * band, w, band);
  });

  // nuages
  g.fillStyle = '#f2f4fb';
  for (let i = 0; i < 6; i++) {
    const cx = Math.floor(rnd() * w);
    const cy = Math.floor(4 + rnd() * h * 0.2);
    for (let k = 0; k < 5; k++) g.fillRect(cx + k * 3 - 6, cy - (k % 2), 8, 3 + (k % 2));
  }

  // collines lointaines
  const hill = (base: number, amp: number, col: string, f: number) => {
    g.fillStyle = col;
    for (let x = 0; x < w; x++) {
      const y = Math.floor(base + Math.sin(x * f + seed) * amp + Math.sin(x * f * 2.7) * amp * 0.4);
      g.fillRect(x, y, 1, h - y);
    }
  };
  hill(h * 0.5, 4, '#6d7f6a', 0.05);
  hill(h * 0.56, 3, '#3f5e45', 0.08);

  // sapins
  const pine = (x: number, base: number, size: number, col: string, dark: string) => {
    for (let r = 0; r < size; r++) {
      const half = Math.floor((r * 0.45) + ((r % 4) === 0 ? 1 : 0));
      g.fillStyle = r % 4 === 3 ? dark : col;
      g.fillRect(x - half, base - size + r, half * 2 + 1, 1);
    }
    g.fillStyle = '#3b2716';
    g.fillRect(x, base, 1, 2);
  };
  for (let i = 0; i < 26; i++) {
    const x = Math.floor(rnd() * w);
    if (x > w * 0.3 && x < w * 0.7 && rnd() < 0.7) continue; // clairière au centre
    pine(x, Math.floor(h * 0.66), 14 + Math.floor(rnd() * 14), '#24452f', '#16301f');
  }

  // prairie
  const grass = ['#5f8f3a', '#6c9c40', '#7aa848', '#86b04e'];
  for (let y = Math.floor(h * 0.64); y < h; y++) {
    g.fillStyle = grass[Math.min(grass.length - 1, Math.floor(((y - h * 0.64) / (h * 0.36)) * grass.length))];
    g.fillRect(0, y, w, 1);
  }
  const dots = ['#4b7a2c', '#e8c34a', '#d9773a', '#9fc45e', '#c8a0f0'];
  for (let i = 0; i < w * 1.2; i++) {
    g.fillStyle = dots[Math.floor(rnd() * dots.length)];
    g.fillRect(Math.floor(rnd() * w), Math.floor(h * 0.66 + rnd() * h * 0.34), 1, 1);
  }
  c.className = 'pixel';
  return c;
}
