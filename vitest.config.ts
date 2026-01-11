import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

const isCI = process.env.CI === 'true'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', '.next', 'storybook-static'],
    // Parallelization optimizations
    pool: 'forks',
    fileParallelism: true,
    // Faster test isolation (disable if tests have side effects)
    isolate: true,
    // Reduce test output noise in CI (dot reporter is minimal)
    reporters: isCI ? ['dot'] : ['default'],
    coverage: {
      provider: 'v8',
      // Use minimal reporters in CI, full reporters locally
      reporter: isCI ? ['lcov', 'json-summary'] : ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.stories.tsx',
        '.next/',
        'storybook-static/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
