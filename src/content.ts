// Contenu pédagogique de la phase 1 : les voyelles.
// `say` est le texte donné à la synthèse vocale pour obtenir le SON (et non le nom de la lettre).
// `word` est un mot illustré ; `highlight` indique la position du son dans le mot.

export interface Sound {
  id: string;
  letter: string; // ce qui est affiché, en majuscules
  say: string; // ce que prononce la synthèse vocale
  word: string;
  wordSay: string;
  highlight: [number, number]; // [début, fin) dans `word`
  emoji: string; // image provisoire, pixelisée à l'affichage
}

export const SOUNDS: Sound[] = [
  { id: 'a', letter: 'A', say: 'a', word: 'ANANAS', wordSay: 'ananas', highlight: [0, 1], emoji: '🍍' },
  { id: 'i', letter: 'I', say: 'i', word: 'ÎLE', wordSay: 'île', highlight: [0, 1], emoji: '🏝️' },
  { id: 'o', letter: 'O', say: 'oh', word: 'ORANGE', wordSay: 'orange', highlight: [0, 1], emoji: '🍊' },
  { id: 'u', letter: 'U', say: 'u', word: 'LUNE', wordSay: 'lune', highlight: [1, 2], emoji: '🌙' },
  { id: 'e_acute', letter: 'É', say: 'é', word: 'ÉTOILE', wordSay: 'étoile', highlight: [0, 1], emoji: '⭐' },
  { id: 'e', letter: 'E', say: 'euh', word: 'CHEVAL', wordSay: 'cheval', highlight: [2, 3], emoji: '🐴' },
];

// Ordre de découverte : on commence avec 3 sons très distincts, puis on en débloque un nouveau
// quand les sons déjà vus sont bien acquis.
export const INITIAL_UNLOCKED = 3;

export function soundById(id: string): Sound {
  const s = SOUNDS.find((x) => x.id === id);
  if (!s) throw new Error(`Son inconnu : ${id}`);
  return s;
}

export const WITCH_NAMES = ['LILA', 'PRUNE', 'MIRA', 'ZÉLIE', 'NOA', 'ÉMA'];

export const PRAISE = ['Bravo !', 'Super !', 'Magnifique !', 'Tu es une vraie magicienne !', 'Génial !', 'Oui, bien joué !'];
