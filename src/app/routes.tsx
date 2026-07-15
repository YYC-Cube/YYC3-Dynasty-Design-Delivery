import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';

// ── Route-level lazy loading ──────────────────────────────────────────────
// Each page is split into its own chunk via React Router v7's native `lazy`
// property. This defers Suspense handling to the router (no manual Suspense
// boundaries needed) and reduces the initial bundle to the critical path
// (Root shell only). Heavy deps (recharts, react-dnd, recharts) are isolated
// into per-route chunks loaded on-demand.

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        index: true,
        lazy: () => import('./pages/WelcomePage').then((m) => ({ Component: m.WelcomePage })),
      },
      {
        path: 'court',
        lazy: () => import('./pages/CourtHall').then((m) => ({ Component: m.CourtHall })),
      },
      {
        path: 'edict',
        lazy: () => import('./pages/EdictBoard').then((m) => ({ Component: m.EdictBoard })),
      },
      {
        path: 'edict/:id',
        lazy: () => import('./pages/EdictBoard').then((m) => ({ Component: m.EdictBoard })),
      },
      {
        path: 'archive',
        lazy: () => import('./pages/ArchiveBoard').then((m) => ({ Component: m.ArchiveBoard })),
      },
      {
        path: 'timeline',
        lazy: () => import('./pages/TimelinePage').then((m) => ({ Component: m.TimelinePage })),
      },
      {
        path: 'monitor',
        lazy: () => import('./pages/TaishiMonitor').then((m) => ({ Component: m.TaishiMonitor })),
      },
      {
        path: 'honors',
        lazy: () => import('./pages/HonorsPage').then((m) => ({ Component: m.HonorsPage })),
      },
      {
        path: 'skills',
        lazy: () =>
          import('./pages/PlaceholderPage').then((m) => ({ Component: m.PlaceholderPage })),
      },
      {
        path: 'workflow',
        lazy: () =>
          import('./pages/PlaceholderPage').then((m) => ({ Component: m.PlaceholderPage })),
      },
      {
        path: 'bridge',
        lazy: () =>
          import('./pages/PlaceholderPage').then((m) => ({ Component: m.PlaceholderPage })),
      },
      {
        path: 'hr',
        lazy: () =>
          import('./pages/PlaceholderPage').then((m) => ({ Component: m.PlaceholderPage })),
      },
      {
        path: 'department/:id',
        lazy: () =>
          import('./pages/PlaceholderPage').then((m) => ({ Component: m.PlaceholderPage })),
      },
      {
        path: 'settings',
        lazy: () =>
          import('./pages/PlaceholderPage').then((m) => ({ Component: m.PlaceholderPage })),
      },
      {
        path: '*',
        lazy: () =>
          import('./pages/PlaceholderPage').then((m) => ({ Component: m.PlaceholderPage })),
      },
    ],
  },
  {
    path: '/dashboard',
    lazy: () => import('./dashboard/DashboardPage').then((m) => ({ Component: m.DashboardPage })),
  },
]);
