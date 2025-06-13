import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import HomePage from './components/pages/HomePage';
import DashboardPage from './components/pages/DashboardPage';
import SchedulePage from './components/pages/SchedulePage';
import TasksPage from './components/pages/TasksPage';
import ProgressPage from './components/pages/ProgressPage';
import RewardsPage from './components/pages/RewardsPage';
import SettingsPage from './components/pages/SettingsPage';
import NotFoundPage from './components/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
<Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="rewards" element={<RewardsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;