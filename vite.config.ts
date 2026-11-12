// Configuration de Vite : serveur de développement et construction du widget.
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  // Chemin de publication sur GitHub Pages (docs/02 §9.3).
  base: '/grist-widget-pilotage/',
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      // Deux pages publiées : le widget et la sonde de validation de l'API Grist (T1.02).
      input: {
        widget: 'index.html',
        sonde: 'outils/sonde-grist/index.html',
      },
    },
  },
});
