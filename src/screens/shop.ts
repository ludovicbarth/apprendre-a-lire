import type { App } from '../main';
import type { Gift } from '../gifts';
import { icon } from '../icons';
import { parentGate } from '../parent';
import { speak } from '../speech';
import { h, sparkle, animate } from '../ui';

/** La boutique : échanger ses étoiles contre de vrais cadeaux (bons à montrer aux parents). */
export function showShop(app: App): void {
  const p = app.progress;

  const starCount = h('span', {}, String(p.stars));
  const starsEl = h('div', { class: 'stars' }, h('span', { class: 'star-ico' }, '★'), starCount);
  const grid = h('div', { class: 'gift-grid' });
  const couponsBox = h('div', { class: 'coupons' });

  function render() {
    starCount.textContent = String(p.stars);
    grid.replaceChildren(
      ...p.gifts.map((g) => {
        const can = p.stars >= g.price;
        const missing = g.price - p.stars;
        const pct = Math.min(100, Math.round((p.stars / g.price) * 100));
        return h(
          'button',
          { class: `gift ${can ? 'can' : 'locked'}`, onclick: (e: Event) => choose(g, e.currentTarget as HTMLElement) },
          h('div', { class: 'gift-emoji' }, g.emoji),
          h('div', { class: 'gift-name' }, g.name),
          h('div', { class: 'gift-price' }, h('span', { class: 'star-ico' }, '★'), String(g.price)),
          can
            ? h('div', { class: 'gift-ok' }, 'Je peux l’avoir !')
            : h('div', { class: 'gift-bar' }, h('div', { class: 'gift-fill', style: `width:${pct}%` }), h('span', {}, `encore ${missing} ★`)),
        );
      }),
    );

    const pending = p.coupons.filter((c) => !c.given);
    couponsBox.replaceChildren(
      ...(pending.length
        ? [
            h('div', { class: 'coupons-title' }, 'Mes bons cadeaux'),
            h('div', { class: 'coupon-list' },
              ...pending.map((c) =>
                h('div', { class: 'coupon' },
                  h('span', { class: 'coupon-emoji' }, c.emoji),
                  h('span', { class: 'coupon-name' }, c.name),
                  h('button', {
                    class: 'coupon-given',
                    'aria-label': 'Cadeau donné (parent)',
                    onclick: () => {
                      if (!parentGate()) return;
                      c.given = true;
                      app.save();
                      render();
                    },
                  }, '✓ donné'),
                ),
              ),
            ),
          ]
        : []),
    );
  }

  function choose(g: Gift, el: HTMLElement) {
    if (p.stars < g.price) {
      animate(el, 'shake', 450);
      speak(`Pour ${g.say}, il te faut encore ${g.price - p.stars} étoiles. Continue à jouer !`);
      return;
    }
    speak(`Tu veux ${g.say} pour ${g.price} étoiles ?`);
    const close = () => overlay.remove();
    const overlay = h(
      'div',
      { class: 'overlay' },
      h(
        'div',
        { class: 'card confirm' },
        h('div', { class: 'gift-emoji big' }, g.emoji),
        h('div', { class: 'gift-name' }, g.name),
        h('div', { class: 'gift-price' }, h('span', { class: 'star-ico' }, '★'), String(g.price)),
        h(
          'div',
          { class: 'actions' },
          h('button', { class: 'btn btn-round btn-no', 'aria-label': 'Non', onclick: close }, '✕'),
          h('button', {
            class: 'btn btn-round btn-go',
            'aria-label': 'Oui',
            onclick: () => {
              close();
              buy(g);
            },
          }, '✓'),
        ),
      ),
    );
    document.body.append(overlay);
  }

  function buy(g: Gift) {
    p.stars -= g.price;
    p.coupons.push({
      id: `bon-${Date.now()}`,
      giftId: g.id,
      name: g.name,
      emoji: g.emoji,
      date: new Date().toISOString(),
      given: false,
    });
    app.save();
    render();
    animate(starsEl, 'pop', 400);
    const coupon = couponsBox.querySelector('.coupon:last-child');
    if (coupon) sparkle(coupon, 18);
    speak(`Youpi ! Tu as gagné ${g.say} ! Montre ton bon cadeau à papa ou maman.`);
  }

  render();
  app.root.append(
    h(
      'div',
      { class: 'screen shop' },
      h(
        'div',
        { class: 'topbar' },
        h('button', { class: 'btn-home', 'aria-label': 'Maison', onclick: () => app.go('home') }, icon('home')),
        h('h1', { class: 'title small' }, 'La boutique'),
        starsEl,
      ),
      h('div', { class: 'shop-body' }, grid, couponsBox),
    ),
  );
  speak('Bienvenue à la boutique ! Échange tes étoiles contre des cadeaux.');
}
