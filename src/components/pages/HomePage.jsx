import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { childService, scheduledTaskService, taskService } from '@/services';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import ChildModeRoutine from '@/components/organisms/ChildModeRoutine';
import ParentTodaySchedule from '@/components/organisms/ParentTodaySchedule';
import Select from '@/components/atoms/Select';
import Card from '@/components/molecules/Card';
import StatsDisplay from '@/components/molecules/StatsDisplay';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [mode, setMode] = useState('parent'); // 'parent' or 'child'
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      loadChildTasks(selectedChild.id);
    }
  }, [selectedChild]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const childrenData = await childService.getAll();
      setChildren(childrenData);
      
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
        // Tasks will be loaded by the useEffect hook above
      } else {
        setTodaysTasks([]); // No children, no tasks
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

  const updateTaskStatus = async (scheduledTaskId, status) => {
    try {
      await scheduledTaskService.update(scheduledTaskId, { status });
      
      if (status === 'completed') {
        // Award points (assuming task points are 10 as per original MainFeature logic)
        const taskDetails = todaysTasks.find(t => t.id === scheduledTaskId);
        const pointsToAward = taskDetails?.points || 10;
        
        const updatedChild = { ...selectedChild, points: selectedChild.points + pointsToAward };
        await childService.update(selectedChild.id, updatedChild);
        setSelectedChild(updatedChild);
        toast.success(`Task completed! +${pointsToAward} points earned!`);
      }
      await loadChildTasks(selectedChild.id); // Reload tasks to reflect status change
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

    // Filter out completed tasks and tasks in the past
    const pendingFutureTasks = todaysTasks.filter(task => {
        const [hour, minute] = task.time.split(':').map(Number);
        const taskTime = hour * 60 + minute;
        return taskTime > currentTime && task.status === 'pending';
    });

    // Sort by time to get the closest next task
    pendingFutureTasks.sort((a, b) => {
        const [aHour, aMinute] = a.time.split(':').map(Number);
        const aTime = aHour * 60 + aMinute;
        const [bHour, bMinute] = b.time.split(':').map(Number);
        const bTime = bHour * 60 + bMinute;
        return aTime - bTime;
    });

    return pendingFutureTasks[0] || null;
  };

  if (loading) {
    return <LoadingState type="card" count={3} message="Loading home content..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  if (children.length === 0) {
    return (
      <EmptyState 
        icon="Users" 
        title="No children added yet" 
        message="Add your first child to get started with routines" 
        actionButton={<Button 
                        onClick={() => navigate('/settings')} 
                        className="bg-primary text-white font-medium mt-4 px-6 py-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add Child
                      </Button>}
      />
    );
  }

  return (
    <div className="max-w-full overflow-hidden space-y-6">
      {/* Mode Toggle & Header */}
      <div className="flex items-center justify-between">
        <Text as="h1" className="text-2xl font-bold text-gray-900">
          {mode === 'parent' ? 'Parent Dashboard' : 'Kid Zone'}
        </Text>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            onClick={() => setMode('parent')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${
              mode === 'parent' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name="User" size={16} />
            <Text as="span">Parent</Text>
          </Button>
          <Button
            onClick={() => setMode('child')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${
              mode === 'child' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name="Heart" size={16} />
            <Text as="span">Child</Text>
          </Button>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg border-l-4 ${
        mode === 'parent' 
          ? 'bg-blue-50 border-blue-400' 
          : 'bg-purple-50 border-purple-400'
      }`}>
        <Text as="p" className="text-sm text-gray-700">
          {mode === 'parent' 
            ? 'Manage your children\'s schedules, track progress, and set up rewards.'
            : 'Complete your daily tasks and earn points for awesome rewards!'
          }
        </Text>
      </div>

      {/* Main Content Area based on Mode */}
      {mode === 'child' ? (
        <ChildModeRoutine 
          selectedChild={selectedChild} 
          todaysTasks={todaysTasks} 
          onUpdateTaskStatus={updateTaskStatus}
          getCurrentTask={getCurrentTask}
          getNextTask={getNextTask}
        />
      ) : (
        <div className="space-y-6">
          {/* Child Selector */}
          <div className="flex items-center space-x-4">
            <Text as="h2" className="text-2xl font-bold text-gray-900">Today's Overview</Text>
            <Select
              value={selectedChild?.id || ''}
              onChange={(e) => {
                const child = children.find(c => c.id === e.target.value);
                setSelectedChild(child);
              }}
              options={children.map(child => ({ value: child.id, label: child.name }))}
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsDisplay
              iconName="CheckCircle"
              iconColor="text-accent"
              bgColor="bg-accent/10"
              label="Completed"
              value={todaysTasks.filter(task => task.status === 'completed').length}
            />
            <StatsDisplay
              iconName="Clock"
              iconColor="text-yellow-600"
              bgColor="bg-yellow-100"
              label="Pending"
              value={todaysTasks.filter(task => task.status === 'pending').length}
            />
            <StatsDisplay
              iconName="AlertCircle"
              iconColor="text-red-600"
              bgColor="bg-red-100"
              label="Need Help"
              value={todaysTasks.filter(task => task.status === 'need_help').length}
            />
            <StatsDisplay
              iconName="Star"
              iconColor="text-secondary"
              bgColor="bg-secondary/10"
              label="Points"
              value={selectedChild?.points || 0}
            />
          </div>
          <ParentTodaySchedule todaysTasks={todaysTasks} onUpdateTaskStatus={updateTaskStatus} />
        </div>
      )}
    </div>
  );
};

export default HomePage;