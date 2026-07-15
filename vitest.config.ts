import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // Only run tests in src/, never touch docs/ or node_modules/
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**', 'docs/**', 'vendor/**'],
    environment: 'node',
    globals: false,
    coverage: {
      provider: 'v8',
      include: ['src/app/domain/**/*.ts'],
      exclude: ['src/app/domain/index.ts', 'src/app/domain/**/*.test.ts'],
    },
  },
});
