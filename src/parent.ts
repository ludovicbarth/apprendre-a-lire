// Espace parent : protégé par une multiplication, géré par de simples boîtes de dialogue.
import type { App } from './main';
import { speak } from './speech';

export function parentGate(): boolean {
  const a = 3 + Math.floor(Math.random() * 6);
  const b = 4 + Math.floor(Math.random() * 6);
  const ans = window.prompt(`Espace parent : combien font ${a} × ${b} ?`);
  return ans !== null && Number(ans) === a * b;
}

export function parentMenu(app: App): void {
  if (!parentGate()) return;
  const p = app.progress;
  const choice = window.prompt(
    [
      'Espace parent',
      `Étoiles : ${p.stars} disponibles (${p.starsEarned} gagnées au total)`,
      '',
      '1 : changer le nom de la sorcière',
      '2 : effacer toute la progression',
      '3 : tester la voix',
      '4 : modifier le prix d’un cadeau',
      '5 : ajouter un cadeau',
      '6 : retirer un cadeau',
      '7 : donner ou retirer des étoiles',
    ].join('\n'),
  );
  const giftList = () => p.gifts.map((g, i) => `${i + 1} : ${g.emoji} ${g.name} (${g.price} ★)`).join('\n');
  const pickGift = (title: string) => {
    const n = Number(window.prompt(`${title}\n${giftList()}`));
    return p.gifts[n - 1];
  };

  switch (choice) {
    case '1':
      p.witchName = null;
      app.save();
      app.go('name');
      return;
    case '2':
      if (window.confirm('Effacer toute la progression (étoiles, aventure, lettres, bons) ?')) {
        const name = p.witchName;
        const gifts = p.gifts;
        app.reset();
        app.progress.witchName = name;
        app.progress.gifts = gifts;
        app.save();
      }
      break;
    case '3':
      speak('a, i, oh, u, é, euh. Bonjour, je lis avec toi !');
      break;
    case '4': {
      const g = pickGift('Quel cadeau ?');
      if (!g) break;
      const price = Number(window.prompt(`Nouveau prix pour ${g.name} (en étoiles) :`, String(g.price)));
      if (price > 0) g.price = Math.round(price);
      break;
    }
    case '5': {
      const name = window.prompt('Nom du cadeau (ex. : UNE HISTOIRE EN PLUS) :')?.trim();
      if (!name) break;
      const emoji = window.prompt('Un émoji pour l’illustrer (ex. 📖) :', '🎁')?.trim() || '🎁';
      const price = Number(window.prompt('Prix en étoiles :', '15'));
      if (!(price > 0)) break;
      p.gifts.push({ id: `perso-${Date.now()}`, name: name.toUpperCase(), say: name.toLowerCase(), emoji, price: Math.round(price) });
      p.gifts.sort((a, b) => a.price - b.price);
      break;
    }
    case '6': {
      const g = pickGift('Quel cadeau retirer ?');
      if (g && window.confirm(`Retirer ${g.name} ?`)) p.gifts = p.gifts.filter((x) => x !== g);
      break;
    }
    case '7': {
      const n = Number(window.prompt('Combien d’étoiles ajouter ? (nombre négatif pour en retirer)', '5'));
      if (Number.isFinite(n) && n !== 0) {
        p.stars = Math.max(0, p.stars + Math.round(n));
        if (n > 0) p.starsEarned += Math.round(n);
      }
      break;
    }
  }
  app.save();
  app.go('home');
}
