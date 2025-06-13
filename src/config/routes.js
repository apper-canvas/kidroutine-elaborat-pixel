import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import SchedulePage from '@/components/pages/SchedulePage';
import TasksPage from '@/components/pages/TasksPage';
import ProgressPage from '@/components/pages/ProgressPage';
import RewardsPage from '@/components/pages/RewardsPage';
import SettingsPage from '@/components/pages/SettingsPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  schedule: {
    id: 'schedule',
    label: 'Schedule',
    path: '/schedule',
    icon: 'Calendar',
    component: Schedule
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: Progress
  },
  rewards: {
    id: 'rewards',
    label: 'Rewards',
    path: '/rewards',
    icon: 'Gift',
    component: Rewards
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);