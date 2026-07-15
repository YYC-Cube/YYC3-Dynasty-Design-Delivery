import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { WelcomePage } from './pages/WelcomePage';
import { CourtHall } from './pages/CourtHall';
import { EdictBoard } from './pages/EdictBoard';
import { ArchiveBoard } from './pages/ArchiveBoard';
import { TimelinePage } from './pages/TimelinePage';
import { TaishiMonitor } from './pages/TaishiMonitor';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { HonorsPage } from './pages/HonorsPage';
import { DashboardPage } from './dashboard/DashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: WelcomePage },
      { path: 'court', Component: CourtHall },
      { path: 'edict', Component: EdictBoard },
      { path: 'edict/:id', Component: EdictBoard },
      { path: 'archive', Component: ArchiveBoard },
      { path: 'timeline', Component: TimelinePage },
      { path: 'monitor', Component: TaishiMonitor },
      { path: 'honors', Component: HonorsPage },
      { path: 'skills', Component: PlaceholderPage },
      { path: 'workflow', Component: PlaceholderPage },
      { path: 'bridge', Component: PlaceholderPage },
      { path: 'hr', Component: PlaceholderPage },
      { path: 'department/:id', Component: PlaceholderPage },
      { path: 'settings', Component: PlaceholderPage },
      { path: '*', Component: PlaceholderPage },
    ],
  },
  // Standalone fullscreen command-center layout (own header, not under Root/Navigation).
  // Wraps its own WorkflowProvider + DndProvider internally.
  { path: '/dashboard', Component: DashboardPage },
]);
