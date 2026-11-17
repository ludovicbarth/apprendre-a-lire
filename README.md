# Lettres Magiques

Jeu pour apprendre à lire (6 ans), en français, sur tablette Android.
Une gentille petite sorcière fait découvrir ses **lettres magiques** : chaque lettre est écrite
en MAJUSCULE, et l'enfant apprend son **son** (et non son nom) en écoutant et en répétant.

## Phase 1 (prototype)

- Choix du nom de la sorcière par l'enfant au premier lancement.
- **Tout l'alphabet dès le départ** (l'enfant connaît ses lettres) : voyelles A, I, O, U, É, E
  par leur son, consonnes par le début des mots (la synthèse vocale ne sait pas prononcer
  une consonne seule).
- **La lettre du jour** : chaque partie commence par une lettre présentée avec **6 cartes images**
  (A : ananas, abeille, avion, arbre, chat, vache…). Pour chaque carte, la sorcière dit le son de
  la lettre puis le mot entier, et l'enfant peut répéter au micro. Ordre : les voyelles, puis les
  consonnes et les sons complexes. Le son d'une consonne seule est approché (« meu » pour M),
  la synthèse vocale ne sachant pas dire « mmm ».
- **Le chaudron magique** : après la lettre du jour, une nouvelle consonne (L, M, R, S, F, V, N, CH, J,
  P, T, D, B, C, G, Z) ou un son complexe (OU, ON, AN, OI, IN, avec sa carte de découverte et
  **🎤 À toi !**) fusionne avec les voyelles : M + A = MA… Cela ouvre ses syllabes et les mots
  qui l'utilisent. La suivante attend que deux syllabes de la précédente soient réussies.
- **L'écho magique** : 6 tours courts par partie, sans chrono ni pénalité ; une erreur fait
  réentendre la différence, et une même question ne revient pas dans les tours suivants.
- **Exercices mélangés** à chaque partie, selon ce que l'enfant connaît :
  son d'une voyelle → trouver la lettre ; image → trouver la première lettre du mot ;
  syllabe entendue → la retrouver parmi 3 ; **mot écrit → toucher la bonne image** (vraie lecture).
  Les mots sont découpés en syllabes de couleurs alternées, les lettres muettes en gris ;
  un bouton d'aide lit le mot si besoin. Environ 200 syllabes et 45 mots.
- Révision espacée : les éléments fragiles reviennent plus souvent.
- Progression et étoiles sauvegardées sur la tablette. Fonctionne hors ligne après la première ouverture.
- **L'aventure** : 6 mondes avec chacun leur décor (prairie enchantée, chemin de campagne,
  forêt maléfique, bord de mer, château en ruine, donjon). Chaque partie fait avancer la sorcière
  d'une étape sur le chemin ; au bout, un dragon grognon à vaincre en lançant des sorts
  (une bonne réponse = un sort). Vaincu, il devient gentil et rapporte 10 étoiles bonus.
  Le dernier monde cache le grand dragon rouge du donjon.
- **La boutique** : les étoiles s'échangent contre de vrais cadeaux (une pomme 5 ★, un chocolat 10 ★,
  une partie de jeu 20 ★, un McDo 60 ★, un tour au petit magasin 100 ★). Un achat donne un
  **bon cadeau** à montrer aux parents, qui le marquent « donné » (protégé par une multiplication).
- Espace parent (⚙, protégé par une multiplication) : changer le nom, effacer la progression,
  tester la voix, passer la lettre suivante au chaudron, modifier les prix, ajouter ou retirer des cadeaux, donner ou retirer des étoiles.

La sorcière et le décor sont des illustrations vectorielles (`src/art.ts`). Les images des mots sont
provisoires (émojis) et seront remplacées par de vraies illustrations.

## Essayer sur la tablette

Le jeu est publié automatiquement sur GitHub Pages à chaque push, une fois Pages activé
(Settings → Pages → Source : **GitHub Actions**). Ouvrir l'adresse dans **Chrome** sur la tablette,
puis menu ⋮ → **Ajouter à l'écran d'accueil** pour l'avoir en plein écran comme une application.

La voix utilise le moteur de synthèse vocale d'Android : vérifier qu'une voix **française** est installée
(Paramètres → Gestion globale → Synthèse vocale → Moteur Google → Installer les données vocales → Français).

## Développement

```bash
npm install
npm run dev      # serveur local, accessible depuis la tablette sur le même Wi-Fi
npm run build    # version de production dans dist/
```

Code : `src/content.ts` (sons, mots, images), `src/screens/game.ts` (déroulé du jeu et combat), `src/worlds.ts` (mondes et dragons),
`src/scenes.ts` (décors), `src/gifts.ts` (cadeaux), `src/screens/map.ts` et `src/screens/shop.ts`,
`src/art.ts` (sorcière et décor), `src/speech.ts` (voix), `src/progress.ts` (progression).
