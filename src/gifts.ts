// Cadeaux de la boutique : de vraies récompenses que l'enfant « achète » avec ses étoiles.
// Un achat crée un bon cadeau, que le parent marque comme donné. Prix modifiables dans l'espace parent.

export interface Gift {
  id: string;
  name: string; // en MAJUSCULES : l'enfant s'entraîne à le lire
  say: string; // pour la synthèse vocale
  emoji: string;
  price: number;
}

export const DEFAULT_GIFTS: Gift[] = [
  { id: 'pomme', name: 'UNE POMME', say: 'une pomme', emoji: '🍎', price: 5 },
  { id: 'chocolat', name: 'UN CHOCOLAT', say: 'un chocolat', emoji: '🍫', price: 10 },
  { id: 'jeu', name: 'UNE PARTIE DE JEU', say: 'une partie de jeu', emoji: '🎲', price: 20 },
  { id: 'macdo', name: 'UN MACDO', say: 'un macdo', emoji: '🍔', price: 60 },
  { id: 'magasin', name: 'UN TOUR AU PETIT MAGASIN', say: 'un tour au petit magasin', emoji: '🛍️', price: 100 },
];

/** Étoiles bonus quand un dragon est vaincu. */
export const DRAGON_BONUS = 10;
