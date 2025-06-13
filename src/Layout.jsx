import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon'; // Corrected import to use alias
import { routeArray } from '@/config/routes'; // Corrected import to use alias

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="h-screen overflow-hidden">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Star" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">KidRoutine Pro</span>
            </div>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <ApperIcon name={route.icon} size={20} />
                <span className="font-medium">{route.label}</span>
              </NavLink>
            ))}
          </nav>

{/* Mode Toggle - Placeholder for future development if global mode is desired */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <ApperIcon name="User" size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Parent Mode</span>
              </div>
              <button 
                className="px-3 py-1 text-xs font-medium text-primary bg-purple-100 rounded-full"
                onClick={() => { /* Implement mode switch logic here */ }}
              >
                Switch to Child
              </button>
</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col lg:ml-64 h-screen overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Calendar" size={16} />
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                  <ApperIcon name="Bell" size={20} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={16} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;