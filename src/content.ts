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
  say: string; // le son de la lettre pour la synthèse vocale (approché pour les consonnes : « meu »)
  more?: Example[]; // autres mots d'exemple
}

/**
 * Un mot d'exemple. La lettre étudiée est entre parenthèses : 'CH(A)T' met en couleur le A.
 */
const ex = ([spec, wordSay, emoji]: [string, string, string]): Example => {
  const i = spec.indexOf('(');
  const j = spec.indexOf(')');
  const word = spec.replace(/[()]/g, '');
  return { word, wordSay, emoji, highlight: [i, j - 1] };
};

type Ex = [string, string, string];

const vowel = (id: string, letter: string, say: string, examples: Ex[]): Letter => {
  const [first, ...more] = examples.map(ex);
  return { id, letter, kind: 'vowel', say, ...first, more };
};

/**
 * Consonne. `say` approche le son de la consonne seule (« meu » pour M, comme on le dit souvent en
 * classe), la synthèse vocale ne sachant pas prononcer « mmm ».
 */
const cons = (id: string, letter: string, say: string, examples: Ex[]): Letter => {
  const [first, ...more] = examples.map(ex);
  return { id, letter, kind: 'consonant', say, ...first, more };
};

/** Toutes les lettres, dans l'ordre de la méthode syllabique, avec 6 mots illustrés chacune. */
export const LETTERS: Letter[] = [
  vowel('a', 'A', 'a', [['(A)NANAS', 'ananas', '🍍'], ['(A)BEILLE', 'abeille', '🐝'], ['(A)VION', 'avion', '✈️'], ['(A)RBRE', 'arbre', '🌳'], ['CH(A)T', 'chat', '🐱'], ['V(A)CHE', 'vache', '🐄']]),
  vowel('i', 'I', 'i', [['L(I)T', 'lit', '🛏️'], ['R(I)Z', 'riz', '🍚'], ['K(I)WI', 'kiwi', '🥝'], ['G(I)RAFE', 'girafe', '🦒'], ['P(I)ZZA', 'pizza', '🍕'], ['SOUR(I)S', 'souris', '🐭']]),
  vowel('o', 'O', 'oh', [['(O)RANGE', 'orange', '🍊'], ['M(O)TO', 'moto', '🏍️'], ['R(O)BOT', 'robot', '🤖'], ['P(O)MME', 'pomme', '🍎'], ['T(O)MATE', 'tomate', '🍅'], ['(O)LIVE', 'olive', '🫒']]),
  vowel('u', 'U', 'u', [['L(U)NE', 'lune', '🌙'], ['J(U)S', 'jus', '🧃'], ['B(U)S', 'bus', '🚌'], ['T(U)LIPE', 'tulipe', '🌷'], ['L(U)NETTES', 'lunettes', '👓'], ['TORT(U)E', 'tortue', '🐢']]),
  vowel('e_acute', 'É', 'é', [['(É)TOILE', 'étoile', '⭐'], ['B(É)BÉ', 'bébé', '👶'], ['V(É)LO', 'vélo', '🚲'], ['CAF(É)', 'café', '☕'], ['FUS(É)E', 'fusée', '🚀'], ['(É)LÉPHANT', 'éléphant', '🐘']]),
  vowel('e', 'E', 'euh', [['CH(E)VAL', 'cheval', '🐴'], ['CH(E)MISE', 'chemise', '👔'], ['R(E)NARD', 'renard', '🦊'], ['F(E)NÊTRE', 'fenêtre', '🪟'], ['M(E)LON', 'melon', '🍈'], ['C(E)RISE', 'cerise', '🍒']]),
  cons('l', 'L', 'le', [['(L)ION', 'lion', '🦁'], ['(L)APIN', 'lapin', '🐰'], ['(L)UNE', 'lune', '🌙'], ['(L)IT', 'lit', '🛏️'], ['(L)IVRE', 'livre', '📖'], ['(L)OUP', 'loup', '🐺']]),
  cons('m', 'M', 'me', [['(M)AISON', 'maison', '🏠'], ['(M)OTO', 'moto', '🏍️'], ['(M)OUTON', 'mouton', '🐑'], ['(M)AMAN', 'maman', '👩'], ['(M)ELON', 'melon', '🍈'], ['(M)OUCHE', 'mouche', '🪰']]),
  cons('r', 'R', 'reu', [['(R)OBOT', 'robot', '🤖'], ['(R)ENARD', 'renard', '🦊'], ['(R)OI', 'roi', '👑'], ['(R)OSE', 'rose', '🌹'], ['(R)IZ', 'riz', '🍚'], ['(R)ADIO', 'radio', '📻']]),
  cons('s', 'S', 'se', [['(S)ERPENT', 'serpent', '🐍'], ['(S)OLEIL', 'soleil', '☀️'], ['(S)APIN', 'sapin', '🌲'], ['(S)OURIS', 'souris', '🐭'], ['(S)ALADE', 'salade', '🥗'], ['(S)AC', 'sac', '👜']]),
  cons('f', 'F', 'feu', [['(F)LEUR', 'fleur', '🌸'], ['(F)RAISE', 'fraise', '🍓'], ['(F)USÉE', 'fusée', '🚀'], ['(F)EU', 'feu', '🔥'], ['(F)OURMI', 'fourmi', '🐜'], ['(F)ROMAGE', 'fromage', '🧀']]),
  cons('v', 'V', 'veu', [['(V)ACHE', 'vache', '🐄'], ['(V)ÉLO', 'vélo', '🚲'], ['(V)OITURE', 'voiture', '🚗'], ['(V)OLCAN', 'volcan', '🌋'], ['(V)ALISE', 'valise', '🧳'], ['(V)IOLON', 'violon', '🎻']]),
  cons('n', 'N', 'ne', [['(N)UAGE', 'nuage', '☁️'], ['(N)EZ', 'nez', '👃'], ['(N)ID', 'nid', '🪺'], ['(N)EIGE', 'neige', '❄️'], ['(N)AVIRE', 'navire', '⛵'], ['(N)OUILLES', 'nouilles', '🍜']]),
  vowel('ou', 'OU', 'ou', [['L(OU)P', 'loup', '🐺'], ['M(OU)TON', 'mouton', '🐑'], ['P(OU)LE', 'poule', '🐔'], ['S(OU)RIS', 'souris', '🐭'], ['R(OU)E', 'roue', '🛞'], ['M(OU)CHE', 'mouche', '🪰']]),
  cons('ch', 'CH', 'cheu', [['(CH)AT', 'chat', '🐱'], ['(CH)IEN', 'chien', '🐶'], ['(CH)APEAU', 'chapeau', '🎩'], ['(CH)OCOLAT', 'chocolat', '🍫'], ['(CH)AMPIGNON', 'champignon', '🍄'], ['(CH)AUSSURE', 'chaussure', '👟']]),
  cons('j', 'J', 'je', [['(J)US', 'jus', '🧃'], ['(J)AMBE', 'jambe', '🦵'], ['(J)EAN', 'jean', '👖'], ['(J)UPE', 'jupe', '👗'], ['(J)AGUAR', 'jaguar', '🐆'], ['(J)ONGLEUR', 'jongleur', '🤹']]),
  cons('p', 'P', 'peu', [['(P)OMME', 'pomme', '🍎'], ['(P)APILLON', 'papillon', '🦋'], ['(P)OULE', 'poule', '🐔'], ['(P)IZZA', 'pizza', '🍕'], ['(P)INGOUIN', 'pingouin', '🐧'], ['(P)OIRE', 'poire', '🍐']]),
  cons('t', 'T', 'te', [['(T)ORTUE', 'tortue', '🐢'], ['(T)OMATE', 'tomate', '🍅'], ['(T)IGRE', 'tigre', '🐯'], ['(T)ÉLÉPHONE', 'téléphone', '📞'], ['(T)RAIN', 'train', '🚂'], ['(T)ENTE', 'tente', '⛺']]),
  vowel('on', 'ON', 'on', [['MOUT(ON)', 'mouton', '🐑'], ['B(ON)BON', 'bonbon', '🍬'], ['CAMI(ON)', 'camion', '🚚'], ['AVI(ON)', 'avion', '✈️'], ['LI(ON)', 'lion', '🦁'], ['POISS(ON)', 'poisson', '🐟']]),
  cons('d', 'D', 'de', [['(D)AUPHIN', 'dauphin', '🐬'], ['(D)INOSAURE', 'dinosaure', '🦕'], ['(D)É', 'dé', '🎲'], ['(D)ENT', 'dent', '🦷'], ['(D)RAGON', 'dragon', '🐉'], ['(D)OUCHE', 'douche', '🚿']]),
  cons('b', 'B', 'beu', [['(B)ALLON', 'ballon', '🎈'], ['(B)ANANE', 'banane', '🍌'], ['(B)ÉBÉ', 'bébé', '👶'], ['(B)ATEAU', 'bateau', '⛵'], ['(B)OUGIE', 'bougie', '🕯️'], ['(B)ALEINE', 'baleine', '🐋']]),
  vowel('an', 'AN', 'an', [['MAM(AN)', 'maman', '👩'], ['P(AN)DA', 'panda', '🐼'], ['OR(AN)GE', 'orange', '🍊'], ['(AN)GE', 'ange', '👼'], ['ÉLÉPH(AN)T', 'éléphant', '🐘'], ['ENF(AN)T', 'enfant', '🧒']]),
  cons('c', 'C', 'queue', [['(C)AROTTE', 'carotte', '🥕'], ['(C)ANARD', 'canard', '🦆'], ['(C)AMION', 'camion', '🚚'], ['(C)OCHON', 'cochon', '🐷'], ['(C)AFÉ', 'café', '☕'], ['(C)ROCODILE', 'crocodile', '🐊']]),
  cons('g', 'G', 'gueu', [['(G)ÂTEAU', 'gâteau', '🎂'], ['(G)ORILLE', 'gorille', '🦍'], ['(G)UITARE', 'guitare', '🎸'], ['(G)LACE', 'glace', '🍦'], ['(G)RENOUILLE', 'grenouille', '🐸'], ['(G)ANT', 'gant', '🧤']]),
  vowel('oi', 'OI', 'oua', [['R(OI)', 'roi', '👑'], ['(OI)SEAU', 'oiseau', '🐦'], ['P(OI)RE', 'poire', '🍐'], ['ÉT(OI)LE', 'étoile', '⭐'], ['P(OI)SSON', 'poisson', '🐟'], ['V(OI)TURE', 'voiture', '🚗']]),
  cons('z', 'Z', 'zeu', [['(Z)ÈBRE', 'zèbre', '🦓'], ['(Z)ÉRO', 'zéro', '0️⃣'], ['LÉ(Z)ARD', 'lézard', '🦎'], ['BRON(Z)E', 'bronze', '🥉'], ['GA(Z)ELLE', 'gazelle', '🦌'], ['GA(Z)', 'gaz', '⛽']]),
  vowel('in', 'IN', 'in', [['LAP(IN)', 'lapin', '🐰'], ['SAP(IN)', 'sapin', '🌲'], ['PINGOU(IN)', 'pingouin', '🐧'], ['DAUPH(IN)', 'dauphin', '🐬'], ['RAIS(IN)', 'raisin', '🍇'], ['JARD(IN)', 'jardin', '🪴']]),
];

/** Son complexe écrit avec deux lettres (OU, ON, AN, OI, IN). */
export const isComplex = (l: Letter) => l.kind === 'vowel' && l.letter.length > 1;

/**
 * Ordre de découverte : chaque partie commence par une lettre (6 cartes images), puis, pour une
 * consonne ou un son complexe, le chaudron des syllabes.
 */
export const FUSION_ORDER: Letter[] = LETTERS;

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
