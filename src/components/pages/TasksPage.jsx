import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services';
import { toast } from 'react-toastify';
import PageHeader from '@/components/molecules/PageHeader';
import Button from '@/components/atoms/Button';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import TaskFormModal from '@/components/organisms/TaskFormModal';
import TaskLibrarySection from '@/components/organisms/TaskLibrarySection';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories = ['All', 'Health', 'Learning', 'Chores', 'Creativity', 'Free Time'];

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (newTaskData) => {
    try {
      await taskService.create(newTaskData);
      await loadTasks();
      setShowCreateModal(false);
      toast.success('Task created successfully!');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      await loadTasks();
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  if (loading) {
    return <LoadingState type="card" count={6} message="Loading tasks..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadTasks} />;
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <PageHeader 
        title="Task Library"
        actions={
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-primary text-white font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="Plus" size={20} />
            <span>Add Task</span>
          </Button>
        }
      />

      <TaskLibrarySection 
        tasks={tasks} 
        categories={categories} 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
        onDeleteTask={handleDeleteTask}
        onCreateTaskClick={() => setShowCreateModal(true)}
      />

      {/* Create Task Modal */}
      <TaskFormModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        onSubmit={handleCreateTask} 
      />
    </div>
  );
};

export default TasksPage;