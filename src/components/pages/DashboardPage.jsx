import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import { childService, scheduledTaskService } from '@/services';
import { toast } from 'react-toastify';
import PageHeader from '@/components/molecules/PageHeader';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import ParentDashboardOverview from '@/components/organisms/ParentDashboardOverview';
import QuickActionsGrid from '@/components/organisms/QuickActionsGrid';
import Button from '@/components/atoms/Button';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [children, setChildren] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const childrenData = await childService.getAll();
      setChildren(childrenData);
      
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

  const quickActions = [
    { label: 'Add Task', iconName: 'Plus', iconColor: 'text-primary', bgColor: 'bg-primary/5', hoverBgColor: 'hover:bg-primary/10', onClick: () => navigate('/tasks') },
    { label: 'Schedule', iconName: 'Calendar', iconColor: 'text-secondary', bgColor: 'bg-secondary/5', hoverBgColor: 'hover:bg-secondary/10', onClick: () => navigate('/schedule') },
    { label: 'Rewards', iconName: 'Gift', iconColor: 'text-accent', bgColor: 'bg-accent/5', hoverBgColor: 'hover:bg-accent/10', onClick: () => navigate('/rewards') },
    { label: 'Reports', iconName: 'BarChart', iconColor: 'text-blue-600', bgColor: 'bg-blue-50', hoverBgColor: 'hover:bg-blue-100', onClick: () => navigate('/progress') },
  ];

  if (loading) {
    return <LoadingState type="card" count={3} message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <PageHeader 
        title="Parent Dashboard"
        actions={
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Calendar" size={16} />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        }
      />

      {children.length === 0 ? (
        <EmptyState 
          icon="Users" 
          title="No children added yet" 
          message="Add your first child to start tracking their routines" 
          actionButton={<Button 
                          onClick={() => navigate('/settings')} 
                          className="bg-primary text-white font-medium mt-4 px-6 py-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Add Child
                        </Button>}
        />
      ) : (
        <ParentDashboardOverview children={children} stats={stats} />
      )}

      {/* Quick Actions */}
      <QuickActionsGrid actions={quickActions} />
    </div>
  );
};

export default DashboardPage;