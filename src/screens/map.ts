import type { App } from '../main';
import { dragonEl, witchEl } from '../art';
import { icon } from '../icons';
import { speak } from '../speech';
import { h, wait } from '../ui';
import { STEPS_PER_WORLD, WORLDS } from '../worlds';
import { runSession } from './game';

// Positions des étapes sur le chemin (en % de la zone carte). La dernière est le dragon.
const NODES: [number, number][] = [
  [10, 78],
  [28, 52],
  [48, 72],
  [66, 44],
  [86, 62],
];

/** Carte du monde actuel : un chemin d'étapes qui mène au dragon. */
export function showMap(app: App, walkFrom?: number): void {
  const p = app.progress;

  if (p.adventureDone) return showFinale(app);

  const world = WORLDS[p.world];
  const n = STEPS_PER_WORLD + 1;
  const nodes = NODES.slice(0, n);

  // Chemin courbe qui relie les étapes.
  let d = `M ${nodes[0][0]} ${nodes[0][1]}`;
  for (let i = 1; i < nodes.length; i++) {
    const [x0, y0] = nodes[i - 1];
    const [x1, y1] = nodes[i];
    const mx = (x0 + x1) / 2;
    d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
  }
  const path = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="map-path">
    <path d="${d}" stroke="rgba(255,255,255,.85)" stroke-width="5.5" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke" style="stroke-width:26px"/>
    <path d="${d}" stroke="rgba(123,63,196,.55)" stroke-width="2" fill="none" stroke-dasharray="2 14" stroke-linecap="round" vector-effect="non-scaling-stroke" style="stroke-width:8px"/>
  </svg>`;

  const area = h('div', { class: 'map-area' });
  area.innerHTML = path;

  nodes.forEach(([x, y], i) => {
    const isBoss = i === n - 1;
    const done = i < p.step;
    const current = i === p.step;
    const node = h(
      'button',
      {
        class: `node ${isBoss ? 'boss' : ''} ${done ? 'done' : ''} ${current ? 'current' : ''}`,
        style: `left:${x}%;top:${y}%`,
        'aria-label': isBoss ? 'Le dragon' : `Étape ${i + 1}`,
      },
      isBoss ? dragonEl(world.dragon, 'mini') : done ? '★' : String(i + 1),
    );
    if (current) node.addEventListener('click', () => start());
    else if (isBoss) node.addEventListener('click', () => speak(`Le dragon t'attend au bout du chemin !`));
    area.append(node);
  });

  // La sorcière se tient sur l'étape actuelle (ou y marche depuis l'étape précédente).
  const from = walkFrom !== undefined ? nodes[Math.min(walkFrom, n - 1)] : nodes[p.step];
  const to = nodes[p.step];
  const witch = witchEl('walker');
  witch.style.left = `${from[0]}%`;
  witch.style.top = `${from[1]}%`;
  area.append(witch);

  const play = h('button', { class: 'btn btn-play', onclick: () => start() }, p.step === n - 1 ? 'Combattre le dragon' : 'Jouer');

  function start() {
    runSession(app, p.step === n - 1 ? 'boss' : 'step');
  }

  app.root.append(
    h(
      'div',
      { class: 'screen map' },
      h(
        'div',
        { class: 'topbar' },
        h('button', { class: 'btn-home', 'aria-label': 'Maison', onclick: () => app.go('home') }, icon('home')),
        h('div', { class: 'world-title' }, h('small', {}, `Monde ${p.world + 1} sur ${WORLDS.length}`), world.name),
        h('div', { class: 'stars' }, h('span', { class: 'star-ico' }, '★'), String(p.stars)),
      ),
      area,
      play,
    ),
  );

  (async () => {
    if (walkFrom !== undefined && walkFrom !== p.step) {
      await wait(400);
      witch.classList.add('walking');
      witch.style.left = `${to[0]}%`;
      witch.style.top = `${to[1]}%`;
      await wait(1400);
      witch.classList.remove('walking');
    }
    if (p.step === n - 1) speak(`Attention ! ${world.dragonName} bloque le chemin. Lance tes sorts magiques en lisant les lettres !`);
    else if (p.step === 0 && walkFrom === undefined) speak(`Bienvenue dans ${world.name.toLowerCase()} !`);
  })();
}

function showFinale(app: App): void {
  const p = app.progress;
  const last = WORLDS[WORLDS.length - 1];
  app.root.append(
    h(
      'div',
      { class: 'screen map finale' },
      h('div', { class: 'topbar' },
        h('button', { class: 'btn-home', 'aria-label': 'Maison', onclick: () => app.go('home') }, icon('home')),
        h('div', { class: 'stars' }, h('span', { class: 'star-ico' }, '★'), String(p.stars))),
      h('div', { class: 'card finale-card' },
        h('div', { class: 'end-title' }, 'Aventure terminée !'),
        h('div', { class: 'finale-pair' }, witchEl('bob'), dragonEl(last.dragon, 'friendly')),
        h('p', { class: 'finale-text' }, 'Tous les dragons sont devenus tes amis.'),
        h('button', {
          class: 'btn btn-play',
          onclick: () => {
            p.world = 0;
            p.step = 0;
            p.adventureDone = false;
            app.save();
            app.go('map');
          },
        }, 'Nouvelle aventure'),
      ),
    ),
  );
  speak('Bravo ! Tu as vaincu tous les dragons. Ils sont devenus tes amis !');
}
