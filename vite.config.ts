import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['leaflet', 'leaflet.markercluster'],
  },
  build: {
    commonjsOptions: {
      include: ['tailwind.config.js', 'node_modules/**'],
    },
  },
});
