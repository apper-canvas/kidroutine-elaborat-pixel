import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Schedule from '../pages/Schedule';
import Tasks from '../pages/Tasks';
import Progress from '../pages/Progress';
import Rewards from '../pages/Rewards';
import Settings from '../pages/Settings';

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