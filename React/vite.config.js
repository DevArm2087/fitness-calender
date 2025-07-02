import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.svg', 'robots.txt'],
    //   manifest: {
    //     name: 'Fitness Calendar',
    //     short_name: 'FitCal',
    //     start_url: '/',
    //     display: 'standalone',
    //     background_color: '#ffffff',
    //     theme_color: '#317EFB',
    //     icons: [
    //       {
    //         src: '/icon.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: '/icon.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       }
    //     ]
    //   }
    // })
  ]
});
