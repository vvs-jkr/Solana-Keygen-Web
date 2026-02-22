import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/worker.ts'],
  project: ['src/**/*.{ts,tsx}', 'test/**/*.ts'],
  ignore: [
    // shadcn/ui generated components — не редактируются вручную
    'src/components/ui/**',
  ],
  ignoreDependencies: [
    // используется через @tailwindcss/vite plugin, не через import
    'tailwindcss',
    // CSS анимации для shadcn, подключаются через @import в CSS
    'tw-animate-css',
    // CLI инструмент для добавления shadcn компонентов
    'shadcn',
    // ESLint плагин, используется в eslint.config.js
    'eslint-plugin-jest',
  ],
}

export default config
