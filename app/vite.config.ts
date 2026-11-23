import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        id: '/',
        name: 'Game Edukasi Berhadapan',
        short_name: 'Game Edukasi',
        description:
          'Balap Karung, Panjat Pinang, dan Tarik Tambang untuk dua pemain.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        lang: 'id',
        background_color: '#f7fbf5',
        theme_color: '#24463d',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
      includeAssets: ['images/*.svg', 'icons/*.png'],
    }),
  ],
})
