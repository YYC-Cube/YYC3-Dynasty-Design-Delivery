import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  // Custom domain (dynasty.yyc3.top via public/CNAME) → site is served at the
  // host root, so assets resolve from '/'. For a project page without a custom
  // domain, switch this to `/${repoName}/`.
  base: '/',

  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    // @yyc3/i18n-core ships a single bundle that imports Node.js builtins
    // (crypto, path, fs, timers/promises) for its server-side modules
    // (AI providers, MCP server, security utils). In the browser these are
    // polyfilled so the i18n engine itself (translations, cache, ICU, RTL)
    // works without pulling in a Node runtime.
    nodePolyfills({
      include: ['crypto', 'path', 'fs', 'timers/promises'],
      globals: { Buffer: true, global: true, process: true },
    }),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // Restrict dev-server's dep optimizer to the real entry. Without this, Vite
  // crawls the project root and tries to pre-bundle `docs/YYC3-AI-Dev/` (a
  // separate related project) which fails on its unresolved workspace deps.
  optimizeDeps: {
    entries: ['index.html'],
  },

  // Lock the dev server to the repo root + src so nothing in docs/ can be
  // served or imported accidentally.
  server: {
    fs: {
      allow: [__dirname],
      deny: ['docs/YYC3-AI-Dev'],
    },
  },

  build: {
    rollupOptions: {
      output: {
        // Split large vendor libraries into separate chunks for better
        // caching and parallel download. Route-level lazy loading already
        // splits by route; this further isolates heavy shared deps.
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-accordion',
          ],
          'vendor-recharts': ['recharts'],
          'vendor-dnd': ['react-dnd', 'react-dnd-html5-backend'],
          'vendor-motion': ['motion'],
        },
      },
    },
  },
});
