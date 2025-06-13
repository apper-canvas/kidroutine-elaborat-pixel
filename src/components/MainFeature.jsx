import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';
import { childService, scheduledTaskService, taskService } from '../services';
import { toast } from 'react-toastify';

const MainFeature = ({ mode = 'parent' }) => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [todaysTasks, setTodaysTasks] = useState([]);
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
      
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
        await loadChildTasks(childrenData[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadChildTasks = async (childId) => {
    try {
      const tasks = await scheduledTaskService.getByChildId(childId);
      const today = new Date().toISOString().split('T')[0];
      const todayTasks = tasks.filter(task => task.date === today);
      
      // Enrich with task details
      const enrichedTasks = await Promise.all(
        todayTasks.map(async (scheduledTask) => {
          const taskDetails = await taskService.getById(scheduledTask.taskId);
          return { ...scheduledTask, ...taskDetails };
        })
      );
      
      setTodaysTasks(enrichedTasks);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await scheduledTaskService.update(taskId, { status });
      await loadChildTasks(selectedChild.id);
      
      if (status === 'completed') {
        // Award points
        const updatedChild = { ...selectedChild, points: selectedChild.points + 10 };
        await childService.update(selectedChild.id, updatedChild);
        setSelectedChild(updatedChild);
        toast.success('Task completed! +10 points earned!');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const getCurrentTask = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    return todaysTasks.find(task => {
      const [hour, minute] = task.time.split(':').map(Number);
      const taskTime = hour * 60 + minute;
      const taskEndTime = taskTime + (task.duration || 30);
      
      return currentTime >= taskTime && currentTime <= taskEndTime && task.status === 'pending';
    });
  };

  const getNextTask = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    return todaysTasks.find(task => {
      const [hour, minute] = task.time.split(':').map(Number);
      const taskTime = hour * 60 + minute;
      
      return taskTime > currentTime && task.status === 'pending';
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="animate-pulse bg-white rounded-lg p-6 shadow-sm"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
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
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="Users" className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
        <h3 className="mt-4 text-lg font-medium">No children added yet</h3>
        <p className="mt-2 text-gray-500">Add your first child to get started with routines</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium"
        >
          Add Child
        </motion.button>
      </motion.div>
    );
  }

  if (mode === 'child') {
    const currentTask = getCurrentTask();
    const nextTask = getNextTask();
    const completedToday = todaysTasks.filter(task => task.status === 'completed').length;
    const totalToday = todaysTasks.length;

    return (
      <div className="max-w-md mx-auto space-y-6">
        {/* Child Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-heading text-white">
              {selectedChild?.name?.charAt(0) || 'K'}
            </span>
          </div>
          <h1 className="text-2xl font-heading text-gray-900 mb-2">
            Hi {selectedChild?.name || 'Kiddo'}! 👋
          </h1>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Star" size={16} className="text-secondary" />
            <span>{selectedChild?.points || 0} points</span>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - completedToday / totalToday)}`}
                className="text-accent transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {completedToday}/{totalToday}
                </div>
                <div className="text-xs text-gray-600">tasks done</div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Task */}
        {currentTask && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-primary to-purple-600 text-white rounded-2xl p-6 text-center"
          >
            <div className="text-6xl mb-4">{currentTask.icon}</div>
            <h3 className="text-xl font-bold mb-2">{currentTask.title}</h3>
            <p className="text-purple-100 mb-6">{currentTask.instructions}</p>
            
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTaskStatus(currentTask.id, 'completed')}
                className="flex-1 bg-white text-primary py-3 rounded-xl font-bold text-lg"
              >
                ✓ Done!
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTaskStatus(currentTask.id, 'need_help')}
                className="flex-1 bg-purple-800 text-white py-3 rounded-xl font-bold text-lg"
              >
                🆘 Help
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Next Task */}
        {nextTask && !currentTask && (
          <div className="bg-white rounded-2xl p-6 text-center border-2 border-gray-100">
            <div className="text-4xl mb-4">{nextTask.icon}</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Coming Up Next</h3>
            <p className="text-gray-600 mb-2">{nextTask.title}</p>
            <p className="text-sm text-gray-500">at {nextTask.time}</p>
          </div>
        )}

        {/* All Tasks Done */}
        {completedToday === totalToday && totalToday > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-accent to-green-600 text-white rounded-2xl p-6 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2">All Done!</h3>
            <p className="text-green-100">Great job today! You completed all your tasks!</p>
            <div className="mt-4 text-2xl font-bold">+{completedToday * 10} points!</div>
          </motion.div>
        )}

        {/* Today's Tasks */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900">Today's Tasks</h3>
          {todaysTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-4 p-4 rounded-xl border-2 ${
                task.status === 'completed' 
                  ? 'bg-green-50 border-green-200' 
                  : task.status === 'need_help'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="text-2xl">{task.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                <p className="text-sm text-gray-600">{task.time}</p>
              </div>
              <div className="flex items-center">
                {task.status === 'completed' && (
                  <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-500" />
                )}
                {task.status === 'need_help' && (
                  <ApperIcon name="HelpCircle" className="w-6 h-6 text-yellow-500" />
                )}
                {task.status === 'pending' && (
                  <ApperIcon name="Clock" className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Parent Mode
  return (
    <div className="space-y-6">
      {/* Child Selector */}
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold text-gray-900">Today's Overview</h2>
        <select
          value={selectedChild?.id || ''}
          onChange={(e) => {
            const child = children.find(c => c.id === e.target.value);
            setSelectedChild(child);
            loadChildTasks(child.id);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {children.map((child) => (
            <option key={child.id} value={child.id}>{child.name}</option>
          ))}
        </select>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-accent" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {todaysTasks.filter(task => task.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {todaysTasks.filter(task => task.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertCircle" className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Need Help</p>
              <p className="text-2xl font-bold text-gray-900">
                {todaysTasks.filter(task => task.status === 'need_help').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Star" className="w-6 h-6 text-secondary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Points</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedChild?.points || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
        </div>
        <div className="p-6">
          {todaysTasks.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tasks scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todaysTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg border ${
                    task.status === 'completed' 
                      ? 'bg-green-50 border-green-200' 
                      : task.status === 'need_help'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-2xl">{task.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600">{task.time} • {task.category}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : task.status === 'need_help'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status === 'completed' ? 'Done' : 
                       task.status === 'need_help' ? 'Needs Help' : 'Pending'}
                    </span>
                    {task.status === 'need_help' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        className="text-primary hover:text-purple-700 text-sm font-medium"
                      >
                        Mark Done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainFeature;