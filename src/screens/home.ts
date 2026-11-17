import type { App } from '../main';
import { witchEl } from '../art';
import { icon } from '../icons';
import { parentMenu } from '../parent';
import { speak, speechAvailable } from '../speech';
import { h } from '../ui';
import { LETTERS } from '../content';
import { WORLDS } from '../worlds';

export function showHome(app: App): void {
  const p = app.progress;
  const name = p.witchName ?? 'LILA';
  const world = WORLDS[Math.min(p.world, WORLDS.length - 1)];

  const letters = h('div', { class: 'letter-strip' });
  LETTERS.forEach((s) => {
    // Lettres « magiques » : celles déjà passées au chaudron (les voyelles simples le sont d'emblée).
    const unlocked = (s.kind === 'vowel' && s.letter.length === 1) || p.fused.includes(s.id);
    letters.append(h('div', { class: `mini-letter ${unlocked ? '' : 'locked'}` }, unlocked ? s.letter : '?'));
  });

  const witch = witchEl('bob');
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
      h(
        'div',
        { class: 'home-main' },
        h('div', { class: 'home-witch' }, witch),
        h(
          'div',
          { class: 'home-side' },
          h('div', { class: 'home-head' }, h('h1', { class: 'title' }, name), h('div', { class: 'world-chip' }, world.name)),
          h('div', { class: 'strip-label' }, 'Mes lettres magiques'),
          letters,
          h(
            'div',
            { class: 'home-actions' },
            h('button', { class: 'btn btn-play', onclick: () => app.go('map') }, 'Jouer'),
            h('button', { class: 'btn btn-shop', onclick: () => app.go('shop') },
              h('span', { class: 'shop-ico' }, '🎁'), 'Boutique',
              pending ? h('span', { class: 'badge' }, String(pending)) : null),
          ),
          !speechAvailable() && h('p', { class: 'warn' }, 'La voix ne fonctionne pas dans ce navigateur. Utilisez Chrome.'),
        ),
      ),
    ),
  );
}
