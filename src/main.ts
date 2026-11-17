import '@fontsource/andika/700.css';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/700.css';
import './style.css';
import { load, save, reset, type Progress } from './progress';
import { forestEl } from './art';
import { showNameScreen } from './screens/name';
import { showHome } from './screens/home';

export interface App {
  progress: Progress;
  root: HTMLElement;
  save(): void;
  reset(): void;
  go(screen: 'name' | 'home'): void;
}

document.body.prepend(forestEl());

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
