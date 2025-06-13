import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import ApperIcon from '../components/ApperIcon';
import { childService, scheduledTaskService } from '../services';
import { toast } from 'react-toastify';

const Progress = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('week');

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
        await loadProgressData(childrenData[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load progress data');
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const loadProgressData = async (childId) => {
    try {
      const tasks = await scheduledTaskService.getByChildId(childId);
      
      // Generate last 7 days
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toISOString().split('T')[0]);
      }

      // Calculate daily completion rates
      const dailyStats = days.map(date => {
        const dayTasks = tasks.filter(task => task.date === date);
        const completed = dayTasks.filter(task => task.status === 'completed').length;
        const total = dayTasks.length;
        
        return {
          date,
          completed,
          total,
          rate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
      });

      // Calculate overall stats
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.status === 'completed').length;
      const overallRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Calculate streak
      let currentStreak = 0;
      for (let i = dailyStats.length - 1; i >= 0; i--) {
        if (dailyStats[i].rate >= 80) { // 80% completion considered a good day
          currentStreak++;
        } else {
          break;
        }
      }

      setProgressData({
        daily: dailyStats,
        overall: overallRate,
        streak: currentStreak,
        totalCompleted: completedTasks,
        totalTasks
      });
    } catch (err) {
      console.error('Failed to load progress data:', err);
    }
  };

  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      background: 'transparent'
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#7C3AED'],
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 5
    },
    xaxis: {
      categories: progressData.daily?.map(day => 
        new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
      ) || [],
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        },
        formatter: (value) => `${value}%`
      }
    },
    markers: {
      size: 6,
      colors: ['#7C3AED'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 8
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}% completion`
      }
    }
  };

  const chartSeries = [{
    name: 'Completion Rate',
    data: progressData.daily?.map(day => day.rate) || []
  }];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load progress</h3>
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
          <ApperIcon name="TrendingUp" className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
        <h3 className="mt-4 text-lg font-medium">No progress to show</h3>
        <p className="mt-2 text-gray-500">Add children and tasks to track progress</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium"
        >
          Get Started
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedChild?.id || ''}
            onChange={(e) => {
              const child = children.find(c => c.id === e.target.value);
              setSelectedChild(child);
              loadProgressData(child.id);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" className="w-6 h-6 text-accent" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overall Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {progressData.overall || 0}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Flame" className="w-6 h-6 text-secondary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">
                {progressData.streak || 0} days
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tasks Done</p>
              <p className="text-2xl font-bold text-gray-900">
                {progressData.totalCompleted || 0}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Star" className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Points Earned</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedChild?.points || 0}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Weekly Progress</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Completion Rate</span>
          </div>
        </div>
        
        {progressData.daily && progressData.daily.length > 0 ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="line"
            height={350}
          />
        ) : (
          <div className="flex items-center justify-center h-80 text-gray-500">
            <div className="text-center">
              <ApperIcon name="BarChart" className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No data available for the selected timeframe</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Daily Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Breakdown</h2>
        <div className="space-y-3">
          {progressData.daily?.map((day, index) => (
            <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-900 w-16">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {day.completed}/{day.total} tasks
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${day.rate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-10">
                    {day.rate}%
                  </span>
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500">
              No daily data available
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Progress;