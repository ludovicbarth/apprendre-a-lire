import type { App } from '../main';
import { LETTERS, PRAISE, SYLLABLES, WORDS, type Example, type Letter, type Syllable, type Word } from '../content';
import {
  availableSyllables,
  availableWords,
  knownLetters,
  MAX_LEVEL,
  nextFusion,
  pickWeighted,
  stat,
} from '../progress';
import { dragonEl, witchEl } from '../art';
import { DRAGON_BONUS } from '../gifts';
import { STEPS_PER_WORLD, WORLDS } from '../worlds';
import { icon } from '../icons';
import { recordFor, playBlob, recorderAvailable } from '../recorder';
import { speak, speakSound, stopSpeaking } from '../speech';
import { animate, h, shuffle, sparkle, wait } from '../ui';

const ROUNDS = 6;

class Quit extends Error {}

/** Un choix proposé à l'enfant (lettre, syllabe ou image). */
interface Choice {
  id: string;
  label: string;
  cls: string;
  say: string; // pour dire « Ça, c'est … »
}

/** Description d'un tour de jeu, quel que soit le type d'exercice. */
interface RoundSpec {
  statId: string;
  bubble: string;
  ask: () => Promise<void>; // consigne parlée (rejouée par le bouton « écouter »)
  header?: HTMLElement; // image ou mot affiché au-dessus des choix
  choices: Choice[];
  correctId: string;
  onWrong: (picked: Choice) => Promise<void>;
  onRight?: () => Promise<void>;
  /** Faut-il baisser le niveau de l'élément choisi par erreur ? */
  penalizePicked: boolean;
  /** Pour un mot : le bouton d'écoute est une aide (lit le mot), pas la consigne. */
  helpSay?: string;
}

/**
 * Une partie : la sorcière fait découvrir les nouvelles lettres, puis enchaîne des exercices variés
 * (sons des voyelles, première lettre d'un mot, syllabes, lecture de mots) avec révision espacée.
 * - mode `step` : une étape du chemin (8 tours) ;
 * - mode `boss` : combat contre le dragon du monde, chaque bonne réponse lance un sort.
 */
export async function runSession(app: App, mode: 'step' | 'boss' = 'step'): Promise<void> {
  const p = app.progress;
  const raw = p.witchName ?? 'LILA';
  const name = raw.charAt(0) + raw.slice(1).toLowerCase();
  let quit = false;
  const world = WORLDS[p.world];
  const startStep = p.step;

  app.root.replaceChildren();
  app.showWorldScene();

  // ------------------------------------------------------------ mise en page
  const starCount = h('span', {}, String(p.stars));
  const starsEl = h('div', { class: 'stars' }, h('span', { class: 'star-ico' }, '★'), starCount);
  const dots = h('div', { class: 'dots' });
  if (mode === 'step') for (let i = 0; i < ROUNDS; i++) dots.append(h('span', { class: 'dot' }));
  else dots.classList.add('hidden');
  const home = h('button', {
    class: 'btn-home',
    onclick: () => {
      quit = true;
      stopSpeaking();
      app.go('map');
    },
  }, icon('home'));
  const witch = witchEl('bob');
  const bubble = h('div', { class: 'bubble' });
  const stage = h('div', { class: 'stage' });
  const board = h('div', { class: 'board' });
  const dragon = mode === 'boss' ? dragonEl(world.dragon, 'angry') : null;
  const hpBar = h('div', { class: 'hp' });
  let hp = world.hp;
  const renderHp = () =>
    hpBar.replaceChildren(...Array.from({ length: world.hp }, (_, i) => h('span', { class: `heart ${i < hp ? '' : 'lost'}` }, '♥')));
  if (dragon) {
    renderHp();
    stage.append(h('div', { class: 'dragon-zone' }, hpBar, dragon));
  }
  stage.append(board);

  app.root.append(
    h(
      'div',
      { class: 'screen game' },
      h('div', { class: 'topbar' }, home, dots, starsEl),
      h('div', { class: 'game-layout' }, h('div', { class: 'witch-zone' }, bubble, witch), stage),
    ),
  );

  // ------------------------------------------------------------ outils
  const check = () => {
    if (quit) throw new Quit();
  };
  const talk = async (fn: () => Promise<void>) => {
    check();
    witch.classList.add('talking');
    try {
      await fn();
    } finally {
      witch.classList.remove('talking');
    }
    check();
  };
  const say = (text: string, bubbleText = text) => {
    // Espace insécable avant « ? ! : » : la ponctuation ne part pas seule à la ligne.
    bubble.textContent = bubbleText.replace(/ ([?!:])/g, '\u00a0$1');
    return talk(() => speak(text));
  };
  const sound = (text: string) => talk(() => speakSound(text));
  const word = (text: string) => talk(() => speak(text, { rate: 0.7 }));

  const addStar = () => {
    p.stars++;
    p.starsEarned++;
    starCount.textContent = String(p.stars);
    animate(starsEl, 'pop', 400);
  };
  const cast = () => {
    animate(witch, 'cast', 600);
    sparkle(witch);
  };
  /** Attend un clic sur « continuer » (ou la sortie de la partie). */
  const waitNext = (btn: HTMLElement) =>
    new Promise<void>((resolve) => {
      btn.onclick = () => resolve();
      home.addEventListener('click', () => resolve());
    }).then(check);

  const highlighted = (e: Example) => {
    const [a, b] = e.highlight;
    return h('div', { class: 'word' }, e.word.slice(0, a), h('span', { class: 'hl' }, e.word.slice(a, b)), e.word.slice(b));
  };

  /** Un mot écrit par syllabes de couleurs alternées, lettres muettes en gris. */
  const wordEl = (w: Word) =>
    h(
      'div',
      { class: 'word read' },
      ...w.syllables.map((syl, i) =>
        h('span', { class: `syl s${i % 2}` }, ...syl.map((part) => (part.silent ? h('span', { class: 'mute' }, part.text) : part.text))),
      ),
    );

  const letterCard = (l: Letter, e: Example = l) =>
    h('div', { class: 'card' }, h('div', { class: 'letter-big' }, l.letter), h('div', { class: 'picture' }, e.emoji), highlighted(e));

  // ------------------------------------------------------------ découverte d'une lettre
  async function sayLetter(l: Letter) {
    if (l.kind === 'vowel') {
      await sound(l.say);
      await wait(250);
      await say(`${l.say}, comme ${l.wordSay}`, `${l.letter} … comme ${l.word}`);
    } else {
      await say(`On l'entend au début de ${l.wordSay}.`, `${l.letter} … comme ${l.word}`);
      await wait(200);
      await word(l.wordSay);
    }
  }

  /** Présentation d'une lettre puis « À toi ! » : l'enfant répète au micro et s'écoute. */
  async function letterStep(l: Letter, intro: boolean) {
    check();
    const listen = h('button', { class: 'btn btn-round', 'aria-label': 'Écouter' }, icon('listen'));
    const mic = h('button', { class: 'btn btn-round mic', 'aria-label': 'À toi !' }, icon('mic'));
    const next = h('button', { class: 'btn btn-round btn-go', 'aria-label': 'Continuer' }, icon('next'));
    board.replaceChildren(letterCard(l), h('div', { class: 'actions' }, listen, recorderAvailable() && mic, next));

    if (intro) await say('Voici une nouvelle lettre magique !');
    await sayLetter(l);
    const model = l.kind === 'vowel' ? l.say : l.wordSay;
    await say(`À toi ! Répète : ${model}`, `À toi ! Répète : ${l.kind === 'vowel' ? l.letter : l.word}`);

    listen.onclick = () => sayLetter(l).catch(() => {});
    mic.onclick = async () => {
      if (mic.classList.contains('rec')) return;
      try {
        mic.classList.add('rec');
        bubble.textContent = 'Je t’écoute…';
        const blob = await recordFor(2500);
        mic.classList.remove('rec');
        bubble.textContent = 'Écoute-toi !';
        await playBlob(blob);
        await wait(300);
        bubble.textContent = 'Et moi :';
        await (l.kind === 'vowel' ? speakSound(l.say) : speak(l.wordSay, { rate: 0.7 }));
        bubble.textContent = 'Bravo ! Tu peux recommencer ou continuer.';
        cast();
      } catch {
        mic.classList.remove('rec');
        bubble.textContent = 'Le micro n’est pas disponible.';
      }
    };
    await waitNext(next);
  }

  // ------------------------------------------------------------ le chaudron : fusion des syllabes
  async function fusionStep(l: Letter) {
    const known = new Set(knownLetters(p).map((x) => x.id));
    let pairs: Syllable[];
    if (l.kind === 'consonant') {
      pairs = SYLLABLES.filter((s) => s.consonant === l.id && known.has(s.vowel));
      // A en premier, puis quelques autres voyelles
      pairs = [...pairs.filter((s) => s.vowel === 'a'), ...shuffle(pairs.filter((s) => s.vowel !== 'a'))].slice(0, 4);
    } else {
      pairs = shuffle(SYLLABLES.filter((s) => s.vowel === l.id && p.fused.includes(s.consonant))).slice(0, 4);
    }
    if (!pairs.length) return;

    const listen = h('button', { class: 'btn btn-round', 'aria-label': 'Écouter' }, icon('listen'));
    const next = h('button', { class: 'btn btn-round btn-go', 'aria-label': 'Continuer' }, icon('next'));
    board.replaceChildren(h('div', { class: 'card fusion' }, h('div', { class: 'letter-big' }, l.letter), h('div', { class: 'cauldron-pot' }, '🪄')));
    await say(
      l.kind === 'consonant'
        ? `Au chaudron magique ! Cette lettre chante au début de ${l.wordSay}. Mélangeons-la avec les voyelles !`
        : 'Au chaudron magique ! Mélangeons ce son avec des lettres !',
      'Le chaudron magique',
    );

    for (const s of pairs) {
      const c = LETTERS.find((x) => x.id === s.consonant)!;
      const v = LETTERS.find((x) => x.id === s.vowel)!;
      const left = h('div', { class: 'tile mini-tile' }, c.letter);
      const right = h('div', { class: 'tile mini-tile' }, v.letter);
      const result = h('div', { class: 'tile syl result' }, s.text);
      board.replaceChildren(
        h(
          'div',
          { class: 'card fusion' },
          h('div', { class: 'fusion-row' }, left, h('span', { class: 'plus' }, '+'), right),
          h('div', { class: 'cauldron-pot' }, '🪄'),
          result,
        ),
        h('div', { class: 'actions' }, listen, next),
      );
      const explain = () =>
        l.kind === 'consonant'
          ? say(`Avec ${v.say}, ça fait… ${s.say} !`, `${c.letter} + ${v.letter} = ${s.text}`)
          : say(`${s.say} !`, `${c.letter} + ${v.letter} = ${s.text}`);
      await wait(300);
      left.classList.add('merge-left');
      right.classList.add('merge-right');
      left.parentElement?.classList.add('merged');
      await wait(650);
      result.classList.add('show');
      sparkle(result, 10);
      await explain();
      listen.onclick = () => explain().catch(() => {});
      await waitNext(next);
    }
  }

  // ------------------------------------------------------------ types d'exercices
  const letterChoice = (l: Letter): Choice => ({
    id: l.id,
    label: l.letter,
    cls: l.letter.length > 1 ? 'tile syl' : 'tile',
    say: l.kind === 'vowel' ? l.say : '',
  });
  const others = <T extends { id: string }>(pool: T[], target: T, n: number, prefer?: (x: T) => boolean): T[] => {
    const rest = shuffle(pool.filter((x) => x.id !== target.id));
    const first = prefer ? rest.filter(prefer) : [];
    return [...first, ...rest.filter((x) => !first.includes(x))].slice(0, n);
  };

  /** Voyelle : la sorcière dit le son, l'enfant trouve la lettre. */
  function soundRound(l: Letter): RoundSpec {
    const vowels = knownLetters(p).filter((x) => x.kind === 'vowel');
    const pool = vowels.length >= 3 ? vowels : knownLetters(p);
    const choices = shuffle([l, ...others(pool, l, 2)]).map(letterChoice);
    return {
      statId: l.id,
      bubble: 'Quelle lettre fait ce son ?',
      ask: async () => {
        await say('Quelle lettre fait le son', 'Quelle lettre fait ce son ?');
        await wait(150);
        await sound(l.say);
      },
      choices,
      correctId: l.id,
      penalizePicked: true,
      onWrong: async (c) => {
        if (c.say) await say(`Non, ça c'est ${c.say}. Écoute :`, `Ça, c'est ${c.label}.`);
        else await say('Non. Écoute :');
        await sound(l.say);
      },
    };
  }

  /** Consonne : une image, l'enfant trouve la lettre du début du mot. */
  function initialRound(l: Letter): RoundSpec {
    const e = shuffle([l as Example, ...(l.more ?? [])])[0];
    const pool = knownLetters(p);
    const choices = shuffle([l, ...others(pool, l, 2, (x) => x.kind === 'consonant')]).map(letterChoice);
    const pic = h('div', { class: 'card pic-card' }, h('div', { class: 'picture' }, e.emoji));
    return {
      statId: l.id,
      bubble: 'Par quelle lettre commence ce mot ?',
      header: pic,
      ask: async () => {
        await say('Par quelle lettre commence…', 'Par quelle lettre commence ce mot ?');
        await word(e.wordSay);
      },
      choices,
      correctId: l.id,
      penalizePicked: true,
      onWrong: async () => {
        await say('Non. Écoute bien le début :', 'Écoute bien le début du mot…');
        await word(e.wordSay);
      },
      onRight: async () => {
        pic.append(highlighted(e));
        await word(e.wordSay);
      },
    };
  }

  /** Syllabe : la sorcière dit une syllabe, l'enfant la trouve parmi 3. */
  function syllableRound(s: Syllable, pool: Syllable[]): RoundSpec {
    const near = (x: Syllable) => x.consonant === s.consonant || x.vowel === s.vowel;
    const choices = shuffle([s, ...others(pool, s, 2, near)]).map((x) => ({ id: x.id, label: x.text, cls: 'tile syl', say: x.say }));
    return {
      statId: s.id,
      bubble: 'Quelle syllabe entends-tu ?',
      ask: async () => {
        await say('Quelle syllabe entends-tu ?');
        await wait(150);
        await sound(s.say);
      },
      choices,
      correctId: s.id,
      penalizePicked: true,
      onWrong: async (c) => {
        await say(`Non, ça c'est ${c.say}. Écoute :`, `Ça, c'est ${c.label}.`);
        await sound(s.say);
      },
    };
  }

  /** Mot : l'enfant lit le mot et touche la bonne image. */
  function wordRound(w: Word): RoundSpec {
    const seen = new Set([w.emoji]);
    const distract = shuffle(WORDS.filter((x) => x.id !== w.id))
      .filter((x) => !seen.has(x.emoji) && !!seen.add(x.emoji))
      .slice(0, 2);
    const choices = shuffle([w, ...distract]).map((x) => ({ id: x.id, label: x.emoji, cls: 'tile pic', say: x.say }));
    return {
      statId: w.id,
      bubble: 'Lis le mot, et touche la bonne image !',
      header: h('div', { class: 'card word-card' }, wordEl(w)),
      ask: () => say('Lis le mot, et touche la bonne image !'),
      choices,
      correctId: w.id,
      penalizePicked: false,
      helpSay: w.say,
      onWrong: async (c) => {
        await say(`Non, ça c'est ${c.say}. Relis bien le mot !`, `Ça, c'est ${c.say}… Relis bien le mot !`);
      },
      onRight: () => word(w.say),
    };
  }

  /**
   * Choisit le prochain exercice parmi ce que l'enfant connaît déjà, sans reposer une question
   * déjà vue récemment quand d'autres sont possibles.
   */
  function nextRound(recent: string[]): { spec: RoundSpec; letter?: Letter } {
    const notRecent = <T extends { id: string }>(xs: T[]) => xs.filter((x) => !recent.includes(x.id));
    const letters = knownLetters(p);
    const syls = availableSyllables(p);
    const words = availableWords(p);
    const kinds: ['letter' | 'syllable' | 'word', number][] = [['letter', 4]];
    if (syls.length >= 3 && notRecent(syls).length) kinds.push(['syllable', 4]);
    if (words.length >= 3 && notRecent(words).length) kinds.push(['word', 2 + Math.min(4, words.length / 4)]);
    let r = Math.random() * kinds.reduce((a, [, w]) => a + w, 0);
    let kind = kinds[0][0];
    for (const [k, w] of kinds) {
      r -= w;
      if (r <= 0) {
        kind = k;
        break;
      }
    }
    if (kind === 'syllable') return { spec: syllableRound(pickWeighted(syls, p, recent), syls) };
    if (kind === 'word') return { spec: wordRound(pickWeighted(words, p, recent)) };
    const l = pickWeighted(letters, p, recent);
    return { spec: l.kind === 'vowel' ? soundRound(l) : initialRound(l), letter: l };
  }

  /** Joue un tour. Renvoie vrai si la bonne réponse a été trouvée du premier coup. */
  async function playRound(spec: RoundSpec): Promise<boolean> {
    const listen = h('button', { class: `btn btn-round ${spec.helpSay ? 'help' : ''}`, 'aria-label': spec.helpSay ? 'Aide : écouter le mot' : 'Réécouter' }, icon('listen'));
    const tiles = spec.choices.map((c) => h('button', { class: c.cls }, c.label));
    board.replaceChildren(
      ...(spec.header ? [spec.header] : []),
      h('div', { class: 'tiles' }, ...tiles),
      h('div', { class: 'actions' }, listen),
    );
    bubble.textContent = spec.bubble.replace(/ ([?!:])/g, '\u00a0$1');
    let helped = false;
    listen.onclick = () => {
      if (spec.helpSay) {
        helped = true;
        word(spec.helpSay).catch(() => {});
      } else spec.ask().catch(() => {});
    };
    await spec.ask();

    let firstTry = true;
    const st = stat(p, spec.statId);
    while (true) {
      const picked = await new Promise<Choice>((resolve) => {
        tiles.forEach((t, i) => (t.onclick = () => resolve(spec.choices[i])));
        home.addEventListener('click', () => resolve(spec.choices[0]));
      });
      check();
      const btn = tiles[spec.choices.indexOf(picked)];
      if (picked.id === spec.correctId) {
        btn.classList.add('good');
        cast();
        sparkle(btn, 10);
        if (firstTry) {
          st.correct++;
          // Avec l'aide (mot lu par la sorcière), l'étoile est gagnée mais le mot n'est pas encore « acquis ».
          if (!helped) st.level = Math.min(MAX_LEVEL, st.level + 1);
          addStar();
        }
        app.save();
        if (spec.onRight) await spec.onRight();
        if (dragon) await hitDragon();
        else await say(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
        return firstTry;
      }
      if (firstTry) {
        st.wrong++;
        st.level = Math.max(0, st.level - 1);
        if (spec.penalizePicked) {
          const ps = stat(p, picked.id);
          ps.level = Math.max(0, ps.level - 1);
        }
        app.save();
      }
      firstTry = false;
      btn.classList.add('dim');
      if (dragon) animate(dragon, 'laugh', 600);
      animate(btn, 'shake', 450);
      await spec.onWrong(picked);
    }
  }

  /** Un sort file de la baguette vers le dragon. */
  async function hitDragon() {
    if (!dragon) return;
    const from = witch.getBoundingClientRect();
    const to = dragon.getBoundingClientRect();
    const spell = h('div', { class: 'spell' }, '★');
    spell.style.left = `${from.left + from.width * 0.85}px`;
    spell.style.top = `${from.top + from.height * 0.25}px`;
    document.body.append(spell);
    void spell.offsetWidth;
    spell.style.transform = `translate(${to.left + to.width * 0.35 - from.left - from.width * 0.85}px, ${to.top + to.height * 0.35 - from.top - from.height * 0.25}px) rotate(360deg)`;
    await wait(550);
    spell.remove();
    sparkle(dragon, 16);
    hp = Math.max(0, hp - 1);
    renderHp();
    await animate(dragon, 'hit', 500);
    const lines = hp > 0 ? ['Paf ! Bien visé !', 'Encore un sort !', 'Il recule !', 'Bravo, continue !'] : ['Dernier sort !'];
    await say(lines[Math.floor(Math.random() * lines.length)]);
  }

  // ------------------------------------------------------------ déroulé
  try {
    // Questions déjà posées : pas de répétition pendant la partie (12 dernières pour un long combat).
    const recent: string[] = [];
    const remember = (id: string) => {
      recent.push(id);
      if (recent.length > 12) recent.shift();
    };
    if (mode === 'step') {
      // 1. Le chaudron : une nouvelle consonne (ou un son complexe) en syllabes à chaque partie.
      const nf = nextFusion(p);
      p.sinceFusion = (p.sinceFusion ?? 0) + 1;
      if (nf) {
        p.sinceFusion = 0;
        if (nf.kind === 'vowel') await letterStep(nf, true);
        p.fused.push(nf.id);
        stat(p, nf.id).introduced = true;
        app.save();
        await fusionStep(nf);
      }

      // 2. Exercices variés sur tout l'alphabet, avec révision espacée.
      bubble.textContent = 'L’écho magique !';
      for (let r = 0; r < ROUNDS; r++) {
        const { spec } = nextRound(recent);
        remember(spec.statId);
        const ok = await playRound(spec);
        dots.children[r].classList.add(ok ? 'ok' : 'retry');
        await wait(300);
      }

      // 3. Fin de l'étape : on avance sur le chemin.
      p.step = Math.min(STEPS_PER_WORLD, p.step + 1);
      app.save();
      await stepEnd();
    } else {
      await say(`${world.dragonName} bloque le chemin ! Lance tes sorts !`, 'Lance tes sorts !');
      while (hp > 0) {
        const { spec } = nextRound(recent);
        remember(spec.statId);
        await playRound(spec);
        await wait(300);
      }
      await victory();
    }
  } catch (e) {
    if (!(e instanceof Quit)) throw e;
  }

  async function stepEnd() {
    check();
    const nextIsBoss = p.step === STEPS_PER_WORLD;
    board.replaceChildren(
      h(
        'div',
        { class: 'card end' },
        h('div', { class: 'end-title' }, 'Bravo !'),
        h('div', { class: 'end-stars' }, '★ ', String(p.stars)),
      ),
      h(
        'div',
        { class: 'actions' },
        h('button', { class: 'btn btn-round btn-go', 'aria-label': 'Continuer le chemin', onclick: () => app.go('map', { walkFrom: startStep }) }, icon('next')),
      ),
    );
    cast();
    await say(nextIsBoss ? `Bravo ! ${name} avance… Attention, le dragon est tout près !` : `Bravo ! ${name} avance sur le chemin !`);
  }

  async function victory() {
    check();
    if (!dragon) return;
    dragon.classList.remove('angry');
    dragon.classList.add('friendly');
    cast();
    sparkle(dragon, 30);
    p.stars += DRAGON_BONUS;
    p.starsEarned += DRAGON_BONUS;
    starCount.textContent = String(p.stars);
    animate(starsEl, 'pop', 400);
    const last = p.world >= WORLDS.length - 1;
    if (last) p.adventureDone = true;
    else {
      p.world++;
      p.step = 0;
    }
    app.save();
    board.replaceChildren(
      h('div', { class: 'card end' }, h('div', { class: 'end-title' }, 'Victoire !'), h('div', { class: 'end-new' }, `+${DRAGON_BONUS} ★ bonus`)),
      h('div', { class: 'actions' }, h('button', { class: 'btn btn-round btn-go', 'aria-label': 'Continuer', onclick: () => app.go('map') }, icon('next'))),
    );
    await say(`Victoire ! ${world.dragonName} devient ton ami. Tu gagnes ${DRAGON_BONUS} étoiles en plus !`, 'Victoire !');
  }
}
