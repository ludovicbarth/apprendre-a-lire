# La Sorcière des Runes

Jeu pour apprendre à lire (6 ans), en français, sur tablette Android.
Une petite sorcière en pixel art lance des sorts avec des **runes** : chaque rune est une lettre
en MAJUSCULE, et l'enfant apprend son **son** (et non son nom) en écoutant et en répétant.

## Phase 1 (prototype)

- Choix du nom de la sorcière par l'enfant au premier lancement.
- **Découverte d'une rune** : grande lettre, image, mot avec le son en couleur,
  voix de synthèse (« a… comme ananas »), puis **🎤 À toi !** : l'enfant s'enregistre,
  se réécoute et compare avec la sorcière (rien n'est conservé ni envoyé).
- **L'écho magique** : la sorcière dit un son, l'enfant touche la bonne rune parmi 3.
  8 tours par partie, sans chrono ni pénalité ; une erreur fait réentendre la différence.
- Révision espacée : les sons fragiles reviennent plus souvent. On commence avec A, I, O ;
  U, É et E se débloquent quand les sons précédents sont acquis.
- Progression et étoiles sauvegardées sur la tablette. Fonctionne hors ligne après la première ouverture.
- Espace parent (⚙, protégé par une multiplication) : changer le nom, effacer la progression, tester la voix.

Les images sont provisoires (émojis pixelisés) et seront remplacées par de vrais dessins pixel art.

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

Code : `src/content.ts` (sons, mots, images), `src/screens/game.ts` (déroulé du jeu),
`src/pixel.ts` (sorcière et décor en pixel art), `src/speech.ts` (voix), `src/progress.ts` (progression).
