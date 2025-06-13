import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import { childService, scheduledTaskService } from '../services';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [children, setChildren] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const childrenData = await childService.getAll();
      setChildren(childrenData);
      
      // Calculate stats for each child
      const statsData = {};
      for (const child of childrenData) {
        const tasks = await scheduledTaskService.getByChildId(child.id);
        const today = new Date().toISOString().split('T')[0];
        const todayTasks = tasks.filter(task => task.date === today);
        
        statsData[child.id] = {
          totalToday: todayTasks.length,
          completed: todayTasks.filter(task => task.status === 'completed').length,
          pending: todayTasks.filter(task => task.status === 'pending').length,
          needHelp: todayTasks.filter(task => task.status === 'need_help').length
        };
      }
      setStats(statsData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load dashboard</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="Users" className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
        <h3 className="mt-4 text-lg font-medium">No children added yet</h3>
        <p className="mt-2 text-gray-500">Add your first child to start tracking their routines</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium"
        >
          Add Child
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Calendar" size={16} />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Children Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child, index) => {
          const childStats = stats[child.id] || {};
          const completionRate = childStats.totalToday > 0 
            ? Math.round((childStats.completed / childStats.totalToday) * 100)
            : 0;

          return (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {child.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{child.name}</h3>
                  <p className="text-sm text-gray-600">Age {child.age}</p>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 32}`}
                      strokeDashoffset={`${2 * Math.PI * 32 * (1 - completionRate / 100)}`}
                      className="text-accent transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">{completionRate}%</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{childStats.completed || 0}</div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{child.points}</div>
                  <div className="text-xs text-gray-600">Points</div>
                </div>
              </div>

              {/* Alerts */}
              {childStats.needHelp > 0 && (
                <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                  <ApperIcon name="AlertTriangle" className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    {childStats.needHelp} task{childStats.needHelp > 1 ? 's' : ''} need help
                  </span>
                </div>
              )}

              {/* Tasks Summary */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Today's Tasks</span>
                  <span className="font-medium">
                    {childStats.completed || 0}/{childStats.totalToday || 0}
                  </span>
                </div>
                <div className="mt-2 flex space-x-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <ApperIcon name="Plus" className="w-6 h-6 text-primary" />
            <span className="font-medium text-gray-900">Add Task</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-colors"
          >
            <ApperIcon name="Calendar" className="w-6 h-6 text-secondary" />
            <span className="font-medium text-gray-900">Schedule</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 bg-accent/5 rounded-lg hover:bg-accent/10 transition-colors"
          >
            <ApperIcon name="Gift" className="w-6 h-6 text-accent" />
            <span className="font-medium text-gray-900">Rewards</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <ApperIcon name="BarChart" className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-gray-900">Reports</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;