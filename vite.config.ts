import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// ── Manual chunk groups ──────────────────────────────────────────────────
// Third-party code is isolated into dedicated vendor chunks so the entry
// (`index`) chunk stays small and libraries can be cached across deploys.
// Recharts is split further so its bulky d3 layer (`vendor-d3`, pulled in
// through `victory-vendor`) is not bundled together with the charting core
// (`vendor-recharts`).

function packageName(id: string): string {
  const tail = id.split('node_modules/').pop() ?? '';
  const segments = tail.split('/');
  return tail.startsWith('@') ? `${segments[0]}/${segments[1]}` : segments[0];
}

function manualVendorChunk(id: string): string | undefined {
  // @yyc3 packages are linked from ./vendor, not node_modules.
  if (id.includes('/vendor/@yyc3/')) return 'vendor-i18n';
  if (!id.includes('node_modules')) return undefined;

  const pkg = packageName(id);

  if (/^(react|react-dom|react-router|scheduler|react-is)$/.test(pkg)) return 'vendor-react';
  if (/^(@radix-ui|@floating-ui)\//.test(pkg)) return 'vendor-radix';
  if (pkg === 'victory-vendor' || /^d3-/.test(pkg)) return 'vendor-d3';
  if (/^(recharts|recharts-scale|react-smooth|decimal\.js-light|lodash)$/.test(pkg))
    return 'vendor-recharts';
  if (/^(motion|framer-motion|motion-dom|motion-utils)$/.test(pkg)) return 'vendor-motion';
  if (/^react-dnd($|-html5-backend$)/.test(pkg)) return 'vendor-dnd';
  if (pkg === 'lucide-react') return 'vendor-icons';
  if (/^(react-hook-form|react-day-picker|date-fns|input-otp)$/.test(pkg)) return 'vendor-forms';
  if (/^(sonner|cmdk|vaul|embla-carousel-react|react-resizable-panels|next-themes)$/.test(pkg))
    return 'vendor-ui';
  if (/^@yyc3\//.test(pkg)) return 'vendor-i18n';

  // Everything else stays under Rollup's default chunking so no artificial
  // cross-chunk cycles (and no catch-all bucket that would pull lazy-only deps
  // into the eager graph) are introduced.
  return undefined;
}

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
    // No Node.js polyfills are configured. Client code imports only the
    // browser-safe entry of @yyc3/i18n-core (`@yyc3/i18n-core/browser`), whose
    // module graph never touches Node builtins (crypto/path/fs/timers); the
    // server-side entry (AI providers, MCP server, security utils) is
    // intentionally never imported from client code. Consequently no `process`
    // / `global` / `Buffer` shim is injected anywhere in the bundle. Should a
    // dependency ever require one, reinstall `vite-plugin-node-polyfills` and
    // re-add `nodePolyfills()` here.
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
        // Function form gives precise control over which vendor package lands
        // in which chunk (see manualVendorChunk above). Route-level lazy
        // loading already splits by route; this further isolates heavy shared
        // deps so the entry chunk stays lean.
        manualChunks: manualVendorChunk,
      },
    },
  },
});
