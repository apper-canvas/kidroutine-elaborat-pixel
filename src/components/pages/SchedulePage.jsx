import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import { childService, scheduledTaskService, taskService } from '@/services';
import { toast } from 'react-toastify';
import PageHeader from '@/components/molecules/PageHeader';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import ScheduleBuilderSection from '@/components/organisms/ScheduleBuilderSection';
import { useNavigate } from 'react-router-dom';

const SchedulePage = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const navigate = useNavigate();

  const timeSlots = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      loadScheduledTasks(selectedChild.id);
    }
  }, [selectedChild]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [childrenData, tasksData] = await Promise.all([
        childService.getAll(),
        taskService.getAll()
      ]);
      
      setChildren(childrenData);
      setTasks(tasksData);
      
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
        // scheduled tasks will be loaded by the useEffect hook
      } else {
        setScheduledTasks([]); // Clear scheduled tasks if no children
      }
    } catch (err) {
      setError(err.message || 'Failed to load schedule data');
      toast.error('Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  };

  const loadScheduledTasks = async (childId) => {
    try {
      const scheduled = await scheduledTaskService.getByChildId(childId);
      const today = new Date().toISOString().split('T')[0];
      const todayScheduled = scheduled.filter(task => task.date === today);
      setScheduledTasks(todayScheduled);
    } catch (err) {
      console.error('Failed to load scheduled tasks:', err);
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (e, timeSlot) => {
    e.preventDefault();
    
    if (!draggedTask || !selectedChild) return;

    try {
      const newScheduledTask = {
        taskId: draggedTask.id,
        childId: selectedChild.id,
        time: timeSlot,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      };

      await scheduledTaskService.create(newScheduledTask);
      await loadScheduledTasks(selectedChild.id);
      toast.success('Task scheduled successfully!');
    } catch (err) {
      toast.error('Failed to schedule task');
    }
    
    setDraggedTask(null);
  };

  const removeScheduledTask = async (taskId) => {
    try {
      await scheduledTaskService.delete(taskId);
      await loadScheduledTasks(selectedChild.id);
      toast.success('Task removed from schedule');
    } catch (err) {
      toast.error('Failed to remove task');
    }
  };

  if (loading) {
    return <LoadingState type="card" count={2} message="Loading schedule..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  if (children.length === 0) {
    return (
      <EmptyState 
        icon="Calendar" 
        title="No children to schedule" 
        message="Add a child first to create schedules" 
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
    <div className="space-y-6 max-w-full overflow-hidden">
      <PageHeader 
        title={`Schedule Builder - ${selectedChild?.name || ''}`}
        actions={
          <Select
            value={selectedChild?.id || ''}
            onChange={(e) => {
              const child = children.find(c => c.id === e.target.value);
              setSelectedChild(child);
            }}
            options={children.map(child => ({ value: child.id, label: child.name }))}
          />
        }
      />

      <ScheduleBuilderSection
        tasks={tasks}
        scheduledTasks={scheduledTasks}
        timeSlots={timeSlots}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onRemoveScheduledTask={removeScheduledTask}
      />
    </div>
  );
};

export default SchedulePage;