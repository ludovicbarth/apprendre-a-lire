import type { App } from '../main';
import { PRAISE, SOUNDS, type Sound } from '../content';
import { maybeUnlock, MAX_LEVEL, pickWeighted, unlockedSounds } from '../progress';
import { pixelEmoji, witchCanvas } from '../pixel';
import { recordFor, playBlob, recorderAvailable } from '../recorder';
import { speak, speakSound, stopSpeaking } from '../speech';
import { animate, h, shuffle, sparkle, wait } from '../ui';

const ROUNDS = 8;

class Quit extends Error {}

/**
 * « L'écho magique » : la sorcière prononce un son, l'enfant touche la rune correspondante.
 * Les nouveaux sons sont d'abord présentés (image + mot + répétition au micro).
 */
export async function runSession(app: App): Promise<void> {
  const p = app.progress;
  const raw = p.witchName ?? 'LILA';
  const name = raw.charAt(0) + raw.slice(1).toLowerCase();
  let quit = false;

  app.root.replaceChildren();

  // --- Mise en page commune ---
  const starsEl = h('div', { class: 'stars' }, `★ ${p.stars}`);
  const dots = h('div', { class: 'dots' });
  for (let i = 0; i < ROUNDS; i++) dots.append(h('span', { class: 'dot' }));
  const home = h('button', {
    class: 'btn-home',
    onclick: () => {
      quit = true;
      stopSpeaking();
      app.go('home');
    },
  }, '⌂');
  const witch = h('div', { class: 'witch bob' }, witchCanvas());
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
    await speak(text);
    check();
  };
  const sound = async (s: Sound) => {
    check();
    await speakSound(s.say);
    check();
  };
  const addStar = () => {
    p.stars++;
    starsEl.textContent = `★ ${p.stars}`;
    animate(starsEl, 'pop', 400);
  };
  const cast = () => {
    animate(witch, 'cast', 600);
    sparkle(witch);
  };

  // --- Carte « rune » : grande lettre, image pixel, mot avec le son en couleur ---
  function runeCard(s: Sound): HTMLElement {
    const [a, b] = s.highlight;
    return h(
      'div',
      { class: 'card' },
      h('div', { class: 'rune-big' }, s.letter),
      h('div', { class: 'picture' }, pixelEmoji(s.emoji)),
      h('div', { class: 'word' }, s.word.slice(0, a), h('span', { class: 'hl' }, s.word.slice(a, b)), s.word.slice(b)),
    );
  }

  async function sayRune(s: Sound) {
    await sound(s);
    await wait(250);
    await say(`${s.say}, comme ${s.wordSay}`, `${s.letter} … comme ${s.word}`);
  }

  /** Présentation d'un son puis « À toi ! » : l'enfant répète au micro et s'écoute. */
  async function repeatStep(s: Sound, intro: boolean) {
    check();
    const listen = h('button', { class: 'btn btn-round', title: 'Écouter' }, '🔊');
    const mic = h('button', { class: 'btn btn-round mic', title: 'À toi !' }, '🎤');
    const next = h('button', { class: 'btn btn-go', title: 'Continuer' }, '➜');
    const actions = h('div', { class: 'actions' }, listen, recorderAvailable() && mic, next);
    stage.replaceChildren(runeCard(s), actions);

    if (intro) await say('Voici une nouvelle rune magique !');
    await sayRune(s);
    await say(`À toi ! Répète : ${s.say}`, `À toi ! Répète : ${s.letter}`);

    await new Promise<void>((resolve) => {
      listen.onclick = () => sayRune(s).catch(() => {});
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

  /** Un tour de quiz. Renvoie vrai si la bonne rune a été trouvée du premier coup. */
  async function quizRound(target: Sound, pool: Sound[]): Promise<boolean> {
    const others = shuffle(pool.filter((s) => s.id !== target.id)).slice(0, 2);
    const choices = shuffle([target, ...others]);
    const listen = h('button', { class: 'btn btn-round', title: 'Réécouter' }, '🔊');
    const runes = choices.map((s) => h('button', { class: 'rune', 'data-id': s.id }, s.letter));
    stage.replaceChildren(h('div', { class: 'runes' }, ...runes), h('div', { class: 'actions' }, listen));

    const ask = async () => {
      bubble.textContent = 'Trouve la rune…';
      await speak('Trouve la rune');
      await wait(150);
      await sound(target);
    };
    listen.onclick = () => ask().catch(() => {});
    await ask();

    let firstTry = true;
    const sp = p.sounds[target.id];
    while (true) {
      const picked = await new Promise<Sound>((resolve) => {
        runes.forEach((r, i) => (r.onclick = () => resolve(choices[i])));
        home.addEventListener('click', () => resolve(target));
      });
      check();
      const btn = runes[choices.indexOf(picked)];
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
    await say(`On joue à l'écho magique ! Je dis un son, tu touches la bonne rune.`, 'L’écho magique !');
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
    const newRune = p.unlocked > before ? SOUNDS[p.unlocked - 1] : null;
    await endScreen(newRune);
  } catch (e) {
    if (!(e instanceof Quit)) throw e;
  }

  async function endScreen(newRune: Sound | null) {
    check();
    stage.replaceChildren(
      h(
        'div',
        { class: 'card end' },
        h('div', { class: 'end-title' }, 'BRAVO !'),
        h('div', { class: 'end-stars' }, `★ ${p.stars}`),
        newRune && h('div', { class: 'end-new' }, 'Nouvelle rune : ', h('span', { class: 'rune small' }, '?')),
      ),
      h(
        'div',
        { class: 'actions' },
        h('button', { class: 'btn btn-round', onclick: () => app.go('home') }, '⌂'),
        h('button', {
          class: 'btn btn-go',
          onclick: () => {
            app.root.replaceChildren();
            runSession(app);
          },
        }, '↻'),
      ),
    );
    cast();
    await say(`Bravo ! Grâce à toi, ${name} a gagné des étoiles magiques !`);
    if (newRune) await say('Et une nouvelle rune est apparue ! Tu la découvriras à la prochaine partie.');
  }
}
