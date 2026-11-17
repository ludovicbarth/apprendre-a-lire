// L'aventure : une suite de mondes. Chaque monde a quelques étapes (une partie = une étape)
// puis un dragon à vaincre. Le dernier monde cache le grand dragon du donjon.
import type { SceneId } from './scenes';
import type { DragonColors } from './art';

export interface World {
  scene: SceneId;
  name: string;
  dragonName: string;
  dragon: DragonColors;
  hp: number; // nombre de sorts (bonnes réponses) pour vaincre le dragon
}

export const STEPS_PER_WORLD = 4; // étapes avant le dragon

export const WORLDS: World[] = [
  { scene: 'prairie', name: 'La prairie enchantée', dragonName: 'Pistache, le dragon des fleurs', hp: 5,
    dragon: { body: '#7cc36a', dark: '#3f7f3a', belly: '#f3e9a8', wing: '#a6dc8f' } },
  { scene: 'campagne', name: 'Le chemin de campagne', dragonName: 'Caramel, le dragon des champs', hp: 5,
    dragon: { body: '#f0a94a', dark: '#b06a1f', belly: '#fff0c4', wing: '#ffd08a' } },
  { scene: 'foret', name: 'La forêt maléfique', dragonName: 'Myrtille, le dragon de la nuit', hp: 6,
    dragon: { body: '#6b5bd6', dark: '#3a2c8f', belly: '#d9d0ff', wing: '#9b8cf0' } },
  { scene: 'mer', name: 'Le bord de mer', dragonName: 'Lagon, le dragon des vagues', hp: 6,
    dragon: { body: '#3fb7c9', dark: '#1d7a8a', belly: '#d8fbff', wing: '#86e0ec' } },
  { scene: 'chateau', name: 'Le château en ruine', dragonName: 'Granit, le dragon des pierres', hp: 7,
    dragon: { body: '#9a8fb0', dark: '#5e5474', belly: '#ece6f5', wing: '#c3b8d6' } },
  { scene: 'donjon', name: 'Le donjon', dragonName: 'Braise, le grand dragon rouge', hp: 8,
    dragon: { body: '#e2533f', dark: '#9a2a1d', belly: '#ffe0a8', wing: '#f59a7a' } },
];
