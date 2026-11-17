import type { App } from '../main';
import { witchEl } from '../art';
import { icon } from '../icons';
import { parentMenu } from '../parent';
import { speak, speechAvailable } from '../speech';
import { h } from '../ui';
import { SOUNDS } from '../content';
import { WORLDS } from '../worlds';

export function showHome(app: App): void {
  const p = app.progress;
  const name = p.witchName ?? 'LILA';
  const world = WORLDS[Math.min(p.world, WORLDS.length - 1)];

  const letters = h('div', { class: 'letter-strip' });
  SOUNDS.forEach((s, i) => {
    const unlocked = i < p.unlocked && p.sounds[s.id].introduced;
    letters.append(h('div', { class: `mini-letter ${unlocked ? '' : 'locked'}` }, unlocked ? s.letter : '?'));
  });

  const witch = witchEl('big bob');
  witch.addEventListener('click', () => speak(`Coucou ! C'est moi, ${name.charAt(0) + name.slice(1).toLowerCase()} !`));

  const pending = p.coupons.filter((c) => !c.given).length;

  app.root.append(
    h(
      'div',
      { class: 'screen home' },
      h(
        'div',
        { class: 'topbar' },
        h('div', { class: 'stars' }, h('span', { class: 'star-ico' }, '★'), String(p.stars)),
        h('button', { class: 'btn-parent', 'aria-label': 'Espace parent', onclick: () => parentMenu(app) }, icon('gear')),
      ),
      h('div', { class: 'home-head' }, h('h1', { class: 'title' }, name), h('div', { class: 'world-chip' }, world.name)),
      witch,
      h('div', { class: 'strip-label' }, 'Mes lettres magiques'),
      letters,
      h(
        'div',
        { class: 'home-actions' },
        h('button', { class: 'btn btn-shop', onclick: () => app.go('shop') },
          h('span', { class: 'shop-ico' }, '🎁'), 'Boutique',
          pending ? h('span', { class: 'badge' }, String(pending)) : null),
        h('button', { class: 'btn btn-play', onclick: () => app.go('map') }, 'Jouer'),
      ),
      !speechAvailable() && h('p', { class: 'warn' }, 'La voix ne fonctionne pas dans ce navigateur. Utilisez Chrome.'),
    ),
  );
}
