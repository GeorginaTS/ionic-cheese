import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['leaflet', 'leaflet.markercluster'],
    exclude: ['zone.js', '@angular/fire', 'firebase'],
  },
  build: {
    commonjsOptions: {
      include: ['tailwind.config.js', 'node_modules/**'],
    },
    rollupOptions: {
      external: [
        '@capacitor/core',
        '@capacitor/camera',
        '@capacitor/filesystem',
        '@capacitor/geolocation',
      ],
    },
  },
  resolve: {
    alias: {
      // Resolució per a zone.js
      'zone.js': 'zone.js/dist/zone.js',
      '@capacitor/core': '@capacitor/core',
      '@capacitor/camera': '@capacitor/camera',
      '@capacitor/filesystem': '@capacitor/filesystem',
      '@capacitor/geolocation': '@capacitor/geolocation',
    },
  },
  server: {
    fs: {
      // Permet accés fora del directori arrel per a les dependències
      strict: false,
    },
  },
});
