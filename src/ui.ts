// Petits utilitaires DOM.

type Child = Node | string | null | undefined | false;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | ((e: Event) => void)> = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (typeof v === 'function') el.addEventListener(k.replace(/^on/, ''), v);
    else el.setAttribute(k, v);
  }
  for (const c of children) if (c) el.append(c);
  return el;
}

export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** Relance une animation CSS sur un élément. */
export function animate(el: Element, cls: string, ms: number): Promise<void> {
  el.classList.remove(cls);
  void (el as HTMLElement).offsetWidth;
  el.classList.add(cls);
  return wait(ms).then(() => el.classList.remove(cls));
}

/** Fait jaillir des étincelles violettes autour d'un élément. */
export function sparkle(target: Element, count = 14): void {
  const r = target.getBoundingClientRect();
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 90;
    s.style.left = `${r.left + r.width / 2}px`;
    s.style.top = `${r.top + r.height / 2}px`;
    s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    s.style.animationDelay = `${Math.random() * 120}ms`;
    if (Math.random() < 0.35) s.classList.add('gold');
    document.body.append(s);
    setTimeout(() => s.remove(), 1100);
  }
}
