import type { App } from '../main';
import { WITCH_NAMES } from '../content';
import { witchCanvas } from '../pixel';
import { speak } from '../speech';
import { h, sparkle } from '../ui';

// Premier lancement : l'enfant choisit le nom de sa sorcière.
export function showNameScreen(app: App): void {
  let chosen: string | null = null;
  const witch = h('div', { class: 'witch big bob' }, witchCanvas());
  const ok = h('button', { class: 'btn btn-go', disabled: 'true', onclick: () => confirm() }, '✔');

  const choose = (name: string, btn: HTMLElement) => {
    chosen = name;
    list.querySelectorAll('.name').forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');
    ok.removeAttribute('disabled');
    sparkle(witch, 8);
    speak(`Je m'appelle ${name.toLowerCase()} !`);
  };

  const list = h('div', { class: 'names' });
  for (const n of WITCH_NAMES) {
    const b: HTMLButtonElement = h('button', { class: 'name', onclick: () => choose(n, b) }, n);
    list.append(b);
  }
  // Un adulte peut saisir un autre nom.
  const other: HTMLButtonElement = h(
    'button',
    {
      class: 'name other',
      onclick: () => {
        const v = window.prompt('Nom de la sorcière ?')?.trim().toUpperCase();
        if (v) {
          other.textContent = v.slice(0, 12);
          choose(other.textContent, other);
        }
      },
    },
    '✏️',
  );
  list.append(other);

  function confirm() {
    if (!chosen) return;
    app.progress.witchName = chosen;
    app.save();
    app.go('home');
  }

  app.root.append(
    h(
      'div',
      { class: 'screen name-screen' },
      h('h1', { class: 'title' }, 'Comment je m’appelle ?'),
      h('div', { class: 'name-layout' }, witch, h('div', { class: 'panel' }, list, ok)),
    ),
  );
  speak('Bonjour ! Je suis une petite sorcière. Choisis mon nom !');
}
