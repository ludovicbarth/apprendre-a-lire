// Programme de lecture : lettres (voyelles, consonnes, sons complexes), syllabes et mots.
//
// Méthode syllabique, en MAJUSCULES :
//  - les voyelles s'apprennent par leur SON (« a », « i »…), prononcé par la synthèse vocale ;
//  - les consonnes ne se prononcent pas bien seules en synthèse vocale : on les apprend par le
//    début des mots (« MOTO commence par M ») puis par la fusion avec les voyelles (M + A = MA) ;
//  - les mots ne sont proposés que lorsque toutes leurs lettres ont été découvertes.

export interface Example {
  word: string; // en majuscules
  wordSay: string;
  highlight: [number, number]; // position de la lettre dans le mot [début, fin)
  emoji: string; // image provisoire
}

export interface Letter extends Example {
  id: string;
  letter: string; // ce qui est affiché
  kind: 'vowel' | 'consonant';
  say: string; // voyelles : le son ; consonnes : non utilisé seul
  more?: Example[]; // autres mots d'exemple
}

const ex = (word: string, wordSay: string, emoji: string, letter: string): Example => {
  const i = word.indexOf(letter);
  return { word, wordSay, emoji, highlight: [i, i + letter.length] };
};

const vowel = (id: string, letter: string, say: string, e: Example): Letter => ({ id, letter, kind: 'vowel', say, ...e });
const cons = (id: string, letter: string, e: Example, ...more: Example[]): Letter => ({
  id,
  letter,
  kind: 'consonant',
  say: '',
  ...e,
  more,
});

/** Toutes les lettres, dans l'ordre de la méthode syllabique. */
export const LETTERS: Letter[] = [
  vowel('a', 'A', 'a', ex('ANANAS', 'ananas', '🍍', 'A')),
  vowel('i', 'I', 'i', ex('ÎLE', 'île', '🏝️', 'Î')),
  vowel('o', 'O', 'oh', ex('ORANGE', 'orange', '🍊', 'O')),
  vowel('u', 'U', 'u', ex('LUNE', 'lune', '🌙', 'U')),
  vowel('e_acute', 'É', 'é', ex('ÉTOILE', 'étoile', '⭐', 'É')),
  vowel('e', 'E', 'euh', ex('CHEVAL', 'cheval', '🐴', 'E')),
  cons('l', 'L', ex('LION', 'lion', '🦁', 'L'), ex('LAPIN', 'lapin', '🐰', 'L')),
  cons('m', 'M', ex('MAISON', 'maison', '🏠', 'M'), ex('MOTO', 'moto', '🏍️', 'M')),
  cons('r', 'R', ex('ROBOT', 'robot', '🤖', 'R'), ex('RENARD', 'renard', '🦊', 'R')),
  cons('s', 'S', ex('SERPENT', 'serpent', '🐍', 'S'), ex('SOLEIL', 'soleil', '☀️', 'S')),
  cons('f', 'F', ex('FLEUR', 'fleur', '🌸', 'F'), ex('FRAISE', 'fraise', '🍓', 'F')),
  cons('v', 'V', ex('VACHE', 'vache', '🐄', 'V'), ex('VÉLO', 'vélo', '🚲', 'V')),
  cons('n', 'N', ex('NUAGE', 'nuage', '☁️', 'N'), ex('NEZ', 'nez', '👃', 'N')),
  vowel('ou', 'OU', 'ou', ex('LOUP', 'loup', '🐺', 'OU')),
  cons('ch', 'CH', ex('CHAT', 'chat', '🐱', 'CH'), ex('CHIEN', 'chien', '🐶', 'CH')),
  cons('j', 'J', ex('JUS', 'jus', '🧃', 'J'), ex('JAMBE', 'jambe', '🦵', 'J')),
  cons('p', 'P', ex('POMME', 'pomme', '🍎', 'P'), ex('PAPILLON', 'papillon', '🦋', 'P')),
  cons('t', 'T', ex('TORTUE', 'tortue', '🐢', 'T'), ex('TOMATE', 'tomate', '🍅', 'T')),
  vowel('on', 'ON', 'on', ex('MOUTON', 'mouton', '🐑', 'ON')),
  cons('d', 'D', ex('DAUPHIN', 'dauphin', '🐬', 'D'), ex('DINOSAURE', 'dinosaure', '🦕', 'D')),
  cons('b', 'B', ex('BALLON', 'ballon', '🎈', 'B'), ex('BANANE', 'banane', '🍌', 'B')),
  vowel('an', 'AN', 'an', ex('MAMAN', 'maman', '👩', 'AN')),
  cons('c', 'C', ex('CAROTTE', 'carotte', '🥕', 'C'), ex('CANARD', 'canard', '🦆', 'C')),
  cons('g', 'G', ex('GÂTEAU', 'gâteau', '🎂', 'G'), ex('GORILLE', 'gorille', '🦍', 'G')),
  vowel('oi', 'OI', 'oua', ex('ROI', 'roi', '👑', 'OI')),
  cons('z', 'Z', ex('ZÈBRE', 'zèbre', '🦓', 'Z'), ex('ZÉRO', 'zéro', '0️⃣', 'Z')),
  vowel('in', 'IN', 'in', ex('LAPIN', 'lapin', '🐰', 'IN')),
];

/** Son complexe écrit avec deux lettres (OU, ON, AN, OI, IN). */
export const isComplex = (l: Letter) => l.kind === 'vowel' && l.letter.length > 1;

/** Ordre du chaudron : chaque partie fait découvrir une nouvelle consonne (ou un son complexe) en syllabes. */
export const FUSION_ORDER: Letter[] = LETTERS.filter((l) => l.kind === 'consonant' || isComplex(l));

const byLetter = new Map(LETTERS.map((l) => [l.letter, l]));

export function letterById(id: string): Letter {
  const s = LETTERS.find((x) => x.id === id);
  if (!s) throw new Error(`Lettre inconnue : ${id}`);
  return s;
}

// ---------------------------------------------------------------- Syllabes

export interface Syllable {
  id: string; // 'syl:ma'
  text: string; // 'MA'
  say: string;
  consonant: string; // id de la consonne
  vowel: string; // id de la voyelle
}

// Voyelles utilisées dans les syllabes (pas de E muet). C et G deviennent « doux » devant I et É : exclus
// (ainsi que la syllabe C + ON, pour éviter un mot grossier).
const SYL_VOWELS = ['a', 'i', 'o', 'u', 'e_acute', 'ou', 'on', 'an', 'oi', 'in'];
const SOFT = new Set(['c:i', 'c:e_acute', 'c:in', 'c:on', 'g:i', 'g:e_acute', 'g:in']);

export const SYLLABLES: Syllable[] = LETTERS.filter((l) => l.kind === 'consonant').flatMap((c) =>
  SYL_VOWELS.filter((v) => !SOFT.has(`${c.id}:${v}`)).map((v) => {
    const vl = letterById(v);
    const text = c.letter + vl.letter;
    const say = text.toLowerCase().replace('oi', 'oua').replace(/^c/, 'k');
    return { id: `syl:${text.toLowerCase()}`, text, say, consonant: c.id, vowel: v };
  }),
);

// ---------------------------------------------------------------- Mots

export interface WordPart {
  text: string;
  silent: boolean;
}

export interface Word {
  id: string;
  spec: string; // syllabes séparées par « - », lettres muettes entre crochets : 'TO-MA-T[E]'
  say: string;
  emoji: string;
  syllables: WordPart[][];
  letters: string[]; // ids des lettres à connaître
}

const MULTI = ['CH', 'OU', 'ON', 'AN', 'OI', 'IN'];

function parseWord(spec: string, say: string, emoji: string): Word {
  const syllables = spec.split('-').map((syl) =>
    syl
      .split(/(\[[^\]]+\])/)
      .filter(Boolean)
      .map((t) => (t.startsWith('[') ? { text: t.slice(1, -1), silent: true } : { text: t, silent: false })),
  );
  const letters = new Set<string>();
  for (const syl of syllables) {
    const sounded = syl.filter((p) => !p.silent).map((p) => p.text).join('');
    for (let i = 0; i < sounded.length; ) {
      const two = sounded.slice(i, i + 2);
      const g = MULTI.includes(two) ? two : sounded[i];
      const l = byLetter.get(g);
      if (!l) throw new Error(`Graphème inconnu « ${g} » dans ${spec}`);
      letters.add(l.id);
      i += g.length;
    }
  }
  const plain = spec.replace(/[-[\]]/g, '');
  return { id: `mot:${plain.toLowerCase()}`, spec, say, emoji, syllables, letters: [...letters] };
}

export const WORDS: Word[] = [
  ['LA-MA', 'lama', '🦙'],
  ['LU-N[E]', 'lune', '🌙'],
  ['MA-LA-D[E]', 'malade', '🤒'],
  ['SO-FA', 'sofa', '🛋️'],
  ['VÉ-LO', 'vélo', '🚲'],
  ['NA-VI-R[E]', 'navire', '⛵'],
  ['FU-MÉ[E]', 'fumée', '💨'],
  ['LOU[P]', 'loup', '🐺'],
  ['SOU-RI[S]', 'souris', '🐭'],
  ['RI[Z]', 'riz', '🍚'],
  ['LI[T]', 'lit', '🛏️'],
  ['CHA[T]', 'chat', '🐱'],
  ['VA-CH[E]', 'vache', '🐄'],
  ['JU-DO', 'judo', '🥋'],
  ['PA-PA', 'papa', '👨'],
  ['PA-PI', 'papi', '👴'],
  ['PU-RÉ[E]', 'purée', '🥣'],
  ['MO-TO', 'moto', '🏍️'],
  ['TO-MA-T[E]', 'tomate', '🍅'],
  ['PA-TA-T[E]', 'patate', '🥔'],
  ['PI-RA-T[E]', 'pirate', '🏴‍☠️'],
  ['SA-LA-D[E]', 'salade', '🥗'],
  ['MOU-TON', 'mouton', '🐑'],
  ['LI-ON', 'lion', '🦁'],
  ['A-VI-ON', 'avion', '✈️'],
  ['DI-NO', 'dino', '🦕'],
  ['DÉ', 'dé', '🎲'],
  ['DOU-DOU', 'doudou', '🧸'],
  ['BÉ-BÉ', 'bébé', '👶'],
  ['BO-BO', 'bobo', '🩹'],
  ['BA-LLON', 'ballon', '🎈'],
  ['BON-BON', 'bonbon', '🍬'],
  ['RO-BO[T]', 'robot', '🤖'],
  ['MA-MAN', 'maman', '👩'],
  ['PAN-DA', 'panda', '🐼'],
  ['BA-NA-N[E]', 'banane', '🍌'],
  ['CA-FÉ', 'café', '☕'],
  ['CA-NA-PÉ', 'canapé', '🛋️'],
  ['CA-MI-ON', 'camion', '🚚'],
  ['CA-NAR[D]', 'canard', '🦆'],
  ['CHO-CO-LA[T]', 'chocolat', '🍫'],
  ['ROI', 'roi', '👑'],
  ['POI-SSON', 'poisson', '🐟'],
  ['ZÉ-RO', 'zéro', '0️⃣'],
  ['SA-PIN', 'sapin', '🌲'],
  ['LA-PIN', 'lapin', '🐰'],
].map(([spec, say, emoji]) => parseWord(spec, say, emoji));

export const WITCH_NAMES = ['LILA', 'PRUNE', 'MIRA', 'ZÉLIE', 'NOA', 'ÉMA'];

export const PRAISE = ['Bravo !', 'Super !', 'Oui !', 'Génial !', 'Bien joué !', 'Magique !'];
