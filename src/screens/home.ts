import type { App } from '../main';
import { witchCanvas } from '../pixel';
import { speak, speechAvailable } from '../speech';
import { h } from '../ui';
import { runSession } from './game';
import { SOUNDS } from '../content';

export function showHome(app: App): void {
  const p = app.progress;
  const name = p.witchName ?? 'LILA';

  const runes = h('div', { class: 'rune-strip' });
  SOUNDS.forEach((s, i) => {
    const unlocked = i < p.unlocked && p.sounds[s.id].introduced;
    const lvl = p.sounds[s.id].level;
    runes.append(
      h('div', { class: `mini-rune ${unlocked ? '' : 'locked'}`, title: `niveau ${lvl}` }, unlocked ? s.letter : '?'),
    );
  });

  const witch = h('div', { class: 'witch big bob' }, witchCanvas());
  witch.addEventListener('click', () => speak(`Coucou ! C'est moi, ${name.charAt(0) + name.slice(1).toLowerCase()} !`));

  const parent = h('button', { class: 'btn-parent', onclick: () => parentMenu(app) }, '⚙');

  app.root.append(
    h(
      'div',
      { class: 'screen home' },
      h('div', { class: 'topbar' }, h('div', { class: 'stars' }, `★ ${p.stars}`), parent),
      h('h1', { class: 'title' }, name),
      witch,
      runes,
      h('button', { class: 'btn btn-play', onclick: () => runSession(app) }, 'JOUER'),
      !speechAvailable() && h('p', { class: 'warn' }, 'La voix ne fonctionne pas dans ce navigateur. Utilisez Chrome.'),
    ),
  );
}

function parentMenu(app: App): void {
  // Petite barrière pour les adultes.
  const a = 3 + Math.floor(Math.random() * 6);
  const b = 4 + Math.floor(Math.random() * 6);
  const ans = window.prompt(`Espace parent : combien font ${a} × ${b} ?`);
  if (ans === null || Number(ans) !== a * b) return;
  const choice = window.prompt(
    'Espace parent\n1 : changer le nom de la sorcière\n2 : effacer toute la progression\n3 : tester la voix',
  );
  if (choice === '1') {
    app.progress.witchName = null;
    app.save();
    app.go('name');
  } else if (choice === '2' && window.confirm('Effacer toute la progression ?')) {
    const name = app.progress.witchName;
    app.reset();
    app.progress.witchName = name;
    app.save();
    app.go('home');
  } else if (choice === '3') {
    speak('a, i, oh, u, é, euh. Bonjour, je lis avec toi !');
  }
}
