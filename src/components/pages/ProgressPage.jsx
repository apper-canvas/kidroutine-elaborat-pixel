import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import { childService, scheduledTaskService } from '@/services';
import { toast } from 'react-toastify';
import PageHeader from '@/components/molecules/PageHeader';
import Select from '@/components/atoms/Select';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import ProgressStatsGrid from '@/components/organisms/ProgressStatsGrid';
import ProgressChartSection from '@/components/organisms/ProgressChartSection';
import DailyProgressList from '@/components/organisms/DailyProgressList';
import Button from '@/components/atoms/Button';
import { useNavigate } from 'react-router-dom';

const ProgressPage = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('week'); // Currently only 'week' is implemented for chart data
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      loadProgressData(selectedChild.id);
    }
  }, [selectedChild, timeframe]); // Reload data if child or timeframe changes

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const childrenData = await childService.getAll();
      setChildren(childrenData);
      
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
        // loadProgressData will be called by the useEffect hook
      } else {
        setProgressData({}); // Clear progress data if no children
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
      
      // Generate last 7 days (for 'week' timeframe)
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

      // Calculate overall stats for all time (not just week)
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

  if (loading) {
    return <LoadingState type="card" count={4} message="Loading progress data..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  if (children.length === 0) {
    return (
      <EmptyState 
        icon="TrendingUp" 
        title="No progress to show" 
        message="Add children and tasks to track progress" 
        actionButton={<Button 
                        onClick={() => navigate('/settings')} 
                        className="bg-primary text-white font-medium mt-4 px-6 py-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Get Started
                      </Button>}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <PageHeader 
        title="Progress Tracking"
        actions={
          <>
            <Select
              value={selectedChild?.id || ''}
              onChange={(e) => {
                const child = children.find(c => c.id === e.target.value);
                setSelectedChild(child);
              }}
              options={children.map(child => ({ value: child.id, label: child.name }))}
            />
            <Select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              options={[{value: 'week', label: 'This Week'}, {value: 'month', label: 'This Month (TBA)'}]}
            />
          </>
        }
      />

      {/* Stats Cards */}
      <ProgressStatsGrid progressData={progressData} selectedChild={selectedChild} />

      {/* Progress Chart */}
      <ProgressChartSection progressData={progressData} />

      {/* Daily Breakdown */}
      <DailyProgressList dailyProgressData={progressData.daily} />
    </div>
  );
};

export default ProgressPage;