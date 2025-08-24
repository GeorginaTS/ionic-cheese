import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['leaflet', 'leaflet.markercluster'],
    exclude: ['zone.js', '@angular/fire', 'firebase'],
  },
  build: {
    commonjsOptions: {
      include: ['node_modules/**'],
    },
  },
  resolve: {
    alias: {
      // Resolució per a zone.js
      'zone.js': 'zone.js/dist/zone.js',
    },
  },
  server: {
    fs: {
      // Permet accés fora del directori arrel per a les dependències
      strict: false,
    },
  },
});
