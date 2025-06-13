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
    component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: DashboardPage
  },
  schedule: {
    id: 'schedule',
    label: 'Schedule',
    path: '/schedule',
    icon: 'Calendar',
    component: SchedulePage
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: TasksPage
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: ProgressPage
  },
  rewards: {
    id: 'rewards',
    label: 'Rewards',
    path: '/rewards',
    icon: 'Gift',
    component: RewardsPage
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: SettingsPage
  }
};

// Export array format for Layout.jsx navigation
export const routeArray = Object.values(routes);

export const routeArray = Object.values(routes);