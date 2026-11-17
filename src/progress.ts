// Progression sauvegardée sur la tablette (localStorage), avec une révision espacée simple :
// chaque son a un niveau de 0 à 5 (boîtes de Leitner). Les sons de faible niveau reviennent plus souvent.
import { FUSION_ORDER, LETTERS, SYLLABLES, WORDS, isComplex, type Letter } from './content';
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
  /** Consonnes et sons complexes déjà passés au chaudron (ils ouvrent les syllabes et les mots). */
  fused: string[];
  /** Parties jouées depuis le dernier passage au chaudron. */
  sinceFusion: number;
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
    fused: [],
    sinceFusion: 0,
    sounds,
  };
}

export function load(): Progress {
  const base = fresh();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw) as Partial<Progress> & { unlocked?: number };
    const p: Progress = { ...base, ...saved, sounds: { ...base.sounds, ...(saved.sounds ?? {}) } };
    // Anciennes sauvegardes : les consonnes et sons complexes déjà présentés comptent comme passés au chaudron.
    if (!saved.fused) p.fused = FUSION_ORDER.filter((l) => p.sounds[l.id]?.introduced).map((l) => l.id);
    delete (p as { unlocked?: number }).unlocked;
    return p;
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

/**
 * Lettres utilisées dans les exercices : tout l'alphabet dès le début (l'enfant connaît ses lettres),
 * les sons complexes (OU, ON…) seulement après leur passage au chaudron.
 */
export function knownLetters(p: Progress): Letter[] {
  return LETTERS.filter((l) => !isComplex(l) || p.fused.includes(l.id));
}

const vowelOk = (p: Progress, id: string) => {
  const l = LETTERS.find((x) => x.id === id)!;
  return l.kind === 'vowel' ? !isComplex(l) || p.fused.includes(id) : p.fused.includes(id);
};

export function availableSyllables(p: Progress) {
  return SYLLABLES.filter((s) => p.fused.includes(s.consonant) && vowelOk(p, s.vowel));
}

export function availableWords(p: Progress) {
  return WORDS.filter((w) => w.letters.every((id) => vowelOk(p, id)));
}

/**
 * Lettre du jour (découverte en 6 cartes puis chaudron), s'il est temps : dès que l'enfant a réussi
 * au moins deux syllabes de la précédente, et au plus tard toutes les 3 parties.
 */
export function nextFusion(p: Progress): Letter | null {
  const next = FUSION_ORDER.find((l) => !p.fused.includes(l.id));
  if (!next) return null;
  const lastId = p.fused[p.fused.length - 1];
  if (!lastId) return next;
  // Après une voyelle simple (pas de syllabes à réussir), on passe directement à la suivante.
  const last = LETTERS.find((l) => l.id === lastId)!;
  if (last.kind === 'vowel' && !isComplex(last)) return next;
  const mastered = SYLLABLES.filter((s) => (s.consonant === lastId || s.vowel === lastId) && (p.sounds[s.id]?.level ?? 0) >= 1);
  return mastered.length >= 2 || p.sinceFusion >= 2 ? next : null;
}

/** Tirage pondéré : plus un élément est fragile, plus il a de chances d'être choisi. Évite les éléments récents. */
export function pickWeighted<T extends { id: string }>(items: T[], p: Progress, avoid: string[] = []): T {
  const fresh = items.filter((i) => !avoid.includes(i.id));
  const pool = fresh.length ? fresh : items;
  const weights = pool.map((i) => MAX_LEVEL + 1 - (p.sounds[i.id]?.level ?? 0));
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let k = 0; k < pool.length; k++) {
    r -= weights[k];
    if (r <= 0) return pool[k];
  }
  return pool[pool.length - 1];
}
