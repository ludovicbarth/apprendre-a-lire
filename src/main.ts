import '@fontsource/andika/700.css';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/700.css';
import './style.css';
import { load, save, reset, type Progress } from './progress';
import { setScene } from './scenes';
import { WORLDS } from './worlds';
import { showNameScreen } from './screens/name';
import { showHome } from './screens/home';
import { showMap } from './screens/map';
import { showShop } from './screens/shop';

export type ScreenName = 'name' | 'home' | 'map' | 'shop';

export interface App {
  progress: Progress;
  root: HTMLElement;
  save(): void;
  reset(): void;
  /** `walkFrom` : sur la carte, la sorcière part de cette étape et marche jusqu'à l'étape actuelle. */
  go(screen: ScreenName, opts?: { walkFrom?: number }): void;
  showWorldScene(): void;
}

const app: App = {
  progress: load(),
  root: document.getElementById('app')!,
  save() {
    save(this.progress);
  },
  reset() {
    this.progress = reset();
  },
  showWorldScene() {
    setScene(WORLDS[Math.min(this.progress.world, WORLDS.length - 1)].scene);
  },
  go(screen, opts = {}) {
    this.root.replaceChildren();
    this.showWorldScene();
    if (screen === 'name') showNameScreen(this);
    else if (screen === 'map') showMap(this, opts.walkFrom);
    else if (screen === 'shop') showShop(this);
    else showHome(this);
  },
};

app.go(app.progress.witchName ? 'home' : 'name');

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
