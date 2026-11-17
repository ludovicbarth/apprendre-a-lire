// Progression sauvegardée sur la tablette (localStorage), avec une révision espacée simple :
// chaque son a un niveau de 0 à 5 (boîtes de Leitner). Les sons de faible niveau reviennent plus souvent.
import { LETTERS, SYLLABLES, WORDS, INITIAL_UNLOCKED, type Letter } from './content';
import { DEFAULT_GIFTS, type Gift } from './gifts';

export const MAX_LEVEL = 5;
const KEY = 'apprendre-a-lire:v1';

export interface SoundProgress {
  level: number;
  introduced: boolean;
  correct: number;
  wrong: number;
}

export interface Coupon {
  id: string;
  giftId: string;
  name: string;
  emoji: string;
  date: string; // ISO
  given: boolean;
}

export interface Progress {
  witchName: string | null;
  stars: number; // étoiles disponibles (dépensables à la boutique)
  starsEarned: number; // total gagné depuis le début
  world: number; // index dans WORLDS
  step: number; // 0..STEPS_PER_WORLD ; STEPS_PER_WORLD = combat contre le dragon
  adventureDone: boolean;
  gifts: Gift[];
  coupons: Coupon[];
  unlocked: number; // nombre de lettres débloquées, dans l'ordre de LETTERS
  sounds: Record<string, SoundProgress>; // statistiques par lettre, syllabe (« syl:ma ») et mot (« mot:moto »)
}

function fresh(): Progress {
  const sounds: Record<string, SoundProgress> = {};
  for (const s of LETTERS) sounds[s.id] = { level: 0, introduced: false, correct: 0, wrong: 0 };
  return {
    witchName: null,
    stars: 0,
    starsEarned: 0,
    world: 0,
    step: 0,
    adventureDone: false,
    gifts: DEFAULT_GIFTS.map((g) => ({ ...g })),
    coupons: [],
    unlocked: INITIAL_UNLOCKED,
    sounds,
  };
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

/** Statistiques d'un élément (lettre, syllabe ou mot), créées à la demande. */
export function stat(p: Progress, id: string): SoundProgress {
  return (p.sounds[id] ??= { level: 0, introduced: false, correct: 0, wrong: 0 });
}

export function unlockedLetters(p: Progress): Letter[] {
  return LETTERS.slice(0, p.unlocked);
}

/** Lettres déjà présentées à l'enfant. */
export function knownLetters(p: Progress): Letter[] {
  return unlockedLetters(p).filter((l) => stat(p, l.id).introduced);
}

export function availableSyllables(p: Progress) {
  const known = new Set(knownLetters(p).map((l) => l.id));
  return SYLLABLES.filter((s) => known.has(s.consonant) && known.has(s.vowel));
}

export function availableWords(p: Progress) {
  const known = new Set(knownLetters(p).map((l) => l.id));
  return WORDS.filter((w) => w.letters.every((id) => known.has(id)));
}

/**
 * Débloque la lettre suivante quand la dernière découverte est acquise (niveau 2)
 * et que la plupart des lettres connues le sont aussi.
 */
export function maybeUnlock(p: Progress): boolean {
  if (p.unlocked >= LETTERS.length) return false;
  const letters = unlockedLetters(p);
  const newest = letters[letters.length - 1];
  const solid = letters.filter((l) => stat(p, l.id).level >= 2).length;
  const ok = stat(p, newest.id).level >= 2 && solid >= Math.ceil(letters.length * 0.7);
  if (ok) p.unlocked++;
  return ok;
}

/** Tirage pondéré : plus un élément est fragile, plus il a de chances d'être choisi. */
export function pickWeighted<T extends { id: string }>(items: T[], p: Progress, avoidId?: string): T {
  const pool = items.length > 1 && avoidId ? items.filter((i) => i.id !== avoidId) : items;
  const weights = pool.map((i) => MAX_LEVEL + 1 - (p.sounds[i.id]?.level ?? 0));
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let k = 0; k < pool.length; k++) {
    r -= weights[k];
    if (r <= 0) return pool[k];
  }
  return pool[pool.length - 1];
}
