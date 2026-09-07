import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['agenda-icon.svg'],
      manifest: {
        name: 'Agenda',
        short_name: 'Agenda',
        description: 'A faithful reconstruction of the classic Agenda calendar interaction model.',
        theme_color: '#f7f7f7',
        background_color: '#f7f7f7',
        display: 'standalone',
        start_url: './',
        icons: [
          {
            src: 'agenda-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true
  }
});
