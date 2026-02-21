import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import path from 'path'

export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],

  worker: {
    format: 'es',
    plugins: () => [wasm(), topLevelAwait()],
  },

  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      '~/shared': path.resolve(__dirname, 'src/shared'),
      '~/entities': path.resolve(__dirname, 'src/entities'),
      '~/features': path.resolve(__dirname, 'src/features'),
      '~/widgets': path.resolve(__dirname, 'src/widgets'),
      '~/pages': path.resolve(__dirname, 'src/pages'),
      '~/app': path.resolve(__dirname, 'src/app'),
      '@wasm': path.resolve(__dirname, 'wasm/pkg'),
    },
  },

  server: {
    port: 3003,
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },

  build: {
    outDir: 'dist',
    target: 'esnext',
  },
})
