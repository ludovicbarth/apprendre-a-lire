import '@fontsource/andika/700.css';
import '@fontsource/press-start-2p/400.css';
import './style.css';
import { load, save, reset, type Progress } from './progress';
import { forestCanvas } from './pixel';
import { showNameScreen } from './screens/name';
import { showHome } from './screens/home';

export interface App {
  progress: Progress;
  root: HTMLElement;
  save(): void;
  reset(): void;
  go(screen: 'name' | 'home'): void;
}

const bg = forestCanvas(192, 108);
bg.id = 'bg';
document.body.prepend(bg);

const app: App = {
  progress: load(),
  root: document.getElementById('app')!,
  save() {
    save(this.progress);
  },
  reset() {
    this.progress = reset();
  },
  go(screen) {
    this.root.replaceChildren();
    if (screen === 'name') showNameScreen(this);
    else showHome(this);
  },
};

app.go(app.progress.witchName ? 'home' : 'name');

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
