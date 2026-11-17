import type { App } from '../main';
import { PRAISE, SOUNDS, type Sound } from '../content';
import { maybeUnlock, MAX_LEVEL, pickWeighted, unlockedSounds } from '../progress';
import { witchEl } from '../art';
import { icon } from '../icons';
import { recordFor, playBlob, recorderAvailable } from '../recorder';
import { speak, speakSound, stopSpeaking } from '../speech';
import { animate, h, shuffle, sparkle, wait } from '../ui';

const ROUNDS = 8;

class Quit extends Error {}

/**
 * « L'écho magique » : la sorcière prononce un son, l'enfant touche la lettre magique correspondante.
 * Les nouveaux sons sont d'abord présentés (image + mot + répétition au micro).
 */
export async function runSession(app: App): Promise<void> {
  const p = app.progress;
  const raw = p.witchName ?? 'LILA';
  const name = raw.charAt(0) + raw.slice(1).toLowerCase();
  let quit = false;

  app.root.replaceChildren();

  // --- Mise en page commune ---
  const starCount = h('span', {}, String(p.stars));
  const starsEl = h('div', { class: 'stars' }, h('span', { class: 'star-ico' }, '★'), starCount);
  const dots = h('div', { class: 'dots' });
  for (let i = 0; i < ROUNDS; i++) dots.append(h('span', { class: 'dot' }));
  const home = h('button', {
    class: 'btn-home',
    onclick: () => {
      quit = true;
      stopSpeaking();
      app.go('home');
    },
  }, icon('home'));
  const witch = witchEl('bob');
  const bubble = h('div', { class: 'bubble' });
  const stage = h('div', { class: 'stage' });

  app.root.append(
    h(
      'div',
      { class: 'screen game' },
      h('div', { class: 'topbar' }, home, dots, starsEl),
      h('div', { class: 'game-layout' }, h('div', { class: 'witch-zone' }, bubble, witch), stage),
    ),
  );

  const check = () => {
    if (quit) throw new Quit();
  };
  const say = async (text: string, bubbleText = text) => {
    check();
    bubble.textContent = bubbleText;
    witch.classList.add('talking');
    await speak(text);
    witch.classList.remove('talking');
    check();
  };
  const sound = async (s: Sound) => {
    check();
    witch.classList.add('talking');
    await speakSound(s.say);
    witch.classList.remove('talking');
    check();
  };
  const addStar = () => {
    p.stars++;
    starCount.textContent = String(p.stars);
    animate(starsEl, 'pop', 400);
  };
  const cast = () => {
    animate(witch, 'cast', 600);
    sparkle(witch);
  };

  // --- Carte « lettre magique » : grande lettre, image, mot avec le son en couleur ---
  function letterCard(s: Sound): HTMLElement {
    const [a, b] = s.highlight;
    return h(
      'div',
      { class: 'card' },
      h('div', { class: 'letter-big' }, s.letter),
      h('div', { class: 'picture' }, s.emoji),
      h('div', { class: 'word' }, s.word.slice(0, a), h('span', { class: 'hl' }, s.word.slice(a, b)), s.word.slice(b)),
    );
  }

  async function sayLetter(s: Sound) {
    await sound(s);
    await wait(250);
    await say(`${s.say}, comme ${s.wordSay}`, `${s.letter} … comme ${s.word}`);
  }

  /** Présentation d'un son puis « À toi ! » : l'enfant répète au micro et s'écoute. */
  async function repeatStep(s: Sound, intro: boolean) {
    check();
    const listen = h('button', { class: 'btn btn-round', 'aria-label': 'Écouter' }, icon('listen'));
    const mic = h('button', { class: 'btn btn-round mic', 'aria-label': 'À toi !' }, icon('mic'));
    const next = h('button', { class: 'btn btn-round btn-go', 'aria-label': 'Continuer' }, icon('next'));
    const actions = h('div', { class: 'actions' }, listen, recorderAvailable() && mic, next);
    stage.replaceChildren(letterCard(s), actions);

    if (intro) await say('Voici une nouvelle lettre magique !');
    await sayLetter(s);
    await say(`À toi ! Répète : ${s.say}`, `À toi ! Répète : ${s.letter}`);

    await new Promise<void>((resolve) => {
      listen.onclick = () => sayLetter(s).catch(() => {});
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
          await speakSound(s.say);
          bubble.textContent = 'Bravo ! Tu peux recommencer ou continuer.';
          cast();
        } catch {
          mic.classList.remove('rec');
          bubble.textContent = 'Le micro n’est pas disponible.';
        }
      };
      next.onclick = () => resolve();
      home.addEventListener('click', () => resolve());
    });
    check();
  }

  /** Un tour de quiz. Renvoie vrai si la bonne lettre a été trouvée du premier coup. */
  async function quizRound(target: Sound, pool: Sound[]): Promise<boolean> {
    const others = shuffle(pool.filter((s) => s.id !== target.id)).slice(0, 2);
    const choices = shuffle([target, ...others]);
    const listen = h('button', { class: 'btn btn-round', 'aria-label': 'Réécouter' }, icon('listen'));
    const tiles = choices.map((s) => h('button', { class: 'tile', 'data-id': s.id }, s.letter));
    stage.replaceChildren(h('div', { class: 'tiles' }, ...tiles), h('div', { class: 'actions' }, listen));

    const ask = async () => {
      bubble.textContent = 'Quelle lettre fait ce son ?';
      witch.classList.add('talking');
      await speak('Quelle lettre fait le son');
      witch.classList.remove('talking');
      await wait(150);
      await sound(target);
    };
    listen.onclick = () => ask().catch(() => {});
    await ask();

    let firstTry = true;
    const sp = p.sounds[target.id];
    while (true) {
      const picked = await new Promise<Sound>((resolve) => {
        tiles.forEach((r, i) => (r.onclick = () => resolve(choices[i])));
        home.addEventListener('click', () => resolve(target));
      });
      check();
      const btn = tiles[choices.indexOf(picked)];
      if (picked.id === target.id) {
        btn.classList.add('good');
        cast();
        sparkle(btn, 10);
        if (firstTry) {
          sp.level = Math.min(MAX_LEVEL, sp.level + 1);
          sp.correct++;
          addStar();
        }
        app.save();
        await say(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
        return firstTry;
      }
      // Erreur : on fait entendre la différence, sans pénalité visible.
      if (firstTry) {
        sp.wrong++;
        sp.level = Math.max(0, sp.level - 1);
        p.sounds[picked.id].level = Math.max(0, p.sounds[picked.id].level - 1);
        app.save();
      }
      firstTry = false;
      btn.classList.add('dim');
      animate(btn, 'shake', 450);
      await say(`Ça, c'est ${picked.say}.`, `Ça, c'est ${picked.letter}.`);
      await say('Écoute bien…');
      await sound(target);
    }
  }

  try {
    // 1. Présenter les sons débloqués pas encore vus.
    for (const s of unlockedSounds(p)) {
      if (!p.sounds[s.id].introduced) {
        await repeatStep(s, true);
        p.sounds[s.id].introduced = true;
        app.save();
      }
    }

    // 2. Quiz avec révision espacée.
    await say(`On joue à l'écho magique ! Je dis un son, et tu touches la bonne lettre.`, 'L’écho magique !');
    const pool = unlockedSounds(p).filter((s) => p.sounds[s.id].introduced);
    let last: string | undefined;
    for (let r = 0; r < ROUNDS; r++) {
      const target = pickWeighted(pool, p, last);
      last = target.id;
      const ok = await quizRound(target, pool);
      dots.children[r].classList.add(ok ? 'ok' : 'retry');
      if (!ok) await repeatStep(target, false);
      await wait(400);
    }

    // 3. Fin de partie.
    const before = p.unlocked;
    maybeUnlock(p);
    app.save();
    const newLetter = p.unlocked > before ? SOUNDS[p.unlocked - 1] : null;
    await endScreen(newLetter);
  } catch (e) {
    if (!(e instanceof Quit)) throw e;
  }

  async function endScreen(newLetter: Sound | null) {
    check();
    stage.replaceChildren(
      h(
        'div',
        { class: 'card end' },
        h('div', { class: 'end-title' }, 'Bravo !'),
        h('div', { class: 'end-stars' }, '★ ', String(p.stars)),
        newLetter && h('div', { class: 'end-new' }, 'Une nouvelle lettre magique t’attend !'),
      ),
      h(
        'div',
        { class: 'actions' },
        h('button', { class: 'btn btn-round', 'aria-label': 'Maison', onclick: () => app.go('home') }, icon('home')),
        h('button', {
          class: 'btn btn-round btn-go',
          'aria-label': 'Rejouer',
          onclick: () => {
            app.root.replaceChildren();
            runSession(app);
          },
        }, icon('replay')),
      ),
    );
    cast();
    await say(`Bravo ! Grâce à toi, ${name} a gagné des étoiles magiques !`);
    if (newLetter) await say('Et une nouvelle lettre magique est apparue ! Tu la découvriras à la prochaine partie.');
  }
}
