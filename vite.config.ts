import { defineConfig } from 'vite';

// base relative : l'app fonctionne aussi bien sur GitHub Pages que dans une WebView Android.
export default defineConfig({
  base: './',
  define: {
    // Date de la version, affichée dans l'espace parent.
    __BUILD__: JSON.stringify(new Date().toISOString().slice(0, 16).replace('T', ' ')),
  },
});
