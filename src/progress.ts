// Progression sauvegardée sur la tablette (localStorage), avec une révision espacée simple :
// chaque son a un niveau de 0 à 5 (boîtes de Leitner). Les sons de faible niveau reviennent plus souvent.
import { SOUNDS, INITIAL_UNLOCKED } from './content';

export const MAX_LEVEL = 5;
const KEY = 'apprendre-a-lire:v1';

export interface SoundProgress {
  level: number;
  introduced: boolean;
  correct: number;
  wrong: number;
}

export interface Progress {
  witchName: string | null;
  stars: number;
  unlocked: number; // nombre de sons débloqués, dans l'ordre de SOUNDS
  sounds: Record<string, SoundProgress>;
}

function fresh(): Progress {
  const sounds: Record<string, SoundProgress> = {};
  for (const s of SOUNDS) sounds[s.id] = { level: 0, introduced: false, correct: 0, wrong: 0 };
  return { witchName: null, stars: 0, unlocked: INITIAL_UNLOCKED, sounds };
}

export function load(): Progress {
  const base = fresh();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw) as Partial<Progress>;
    return { ...base, ...saved, sounds: { ...base.sounds, ...(saved.sounds ?? {}) } };
  } catch {
    return base;
  }
}

export function save(p: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* stockage indisponible : la partie continue sans sauvegarde */
  }
}

export function reset(): Progress {
  const p = fresh();
  save(p);
  return p;
}

export function unlockedSounds(p: Progress) {
  return SOUNDS.slice(0, p.unlocked);
}

/** Débloque le son suivant quand tous les sons débloqués ont atteint le niveau 2. */
export function maybeUnlock(p: Progress): boolean {
  if (p.unlocked >= SOUNDS.length) return false;
  const ok = unlockedSounds(p).every((s) => p.sounds[s.id].level >= 2);
  if (ok) p.unlocked++;
  return ok;
}

/** Tirage pondéré : plus un son est fragile, plus il a de chances d'être choisi. */
export function pickWeighted<T extends { id: string }>(items: T[], p: Progress, avoidId?: string): T {
  const pool = items.length > 1 && avoidId ? items.filter((i) => i.id !== avoidId) : items;
  const weights = pool.map((i) => MAX_LEVEL + 1 - p.sounds[i.id].level);
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let k = 0; k < pool.length; k++) {
    r -= weights[k];
    if (r <= 0) return pool[k];
  }
  return pool[pool.length - 1];
}
