import React from 'react';
import TaskItem from '@/components/molecules/TaskItem';
import CategoryFilter from '@/components/molecules/CategoryFilter';
import EmptyState from '@/components/organisms/EmptyState';
import Button from '@/components/atoms/Button';

const TaskLibrarySection = ({ tasks, categories, selectedCategory, onSelectCategory, onDeleteTask, onCreateTaskClick }) => {
  const categoryIcons = {
    Health: '🏃',
    Learning: '📚',
    Chores: '🧹',
    Creativity: '🎨',
    'Free Time': '🎮'
  };

  const filteredTasks = selectedCategory === 'All' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory);

  const formattedCategories = categories.map(cat => ({
    value: cat,
    label: cat,
    icon: categoryIcons[cat]
  }));

  return (
    <>
      {/* Category Filter */}
      <CategoryFilter 
        categories={formattedCategories} 
        selectedCategory={selectedCategory} 
        onSelectCategory={onSelectCategory} 
      />

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <EmptyState 
          icon="CheckSquare" 
          title="No tasks found" 
          message={selectedCategory === 'All' 
            ? 'Create your first task to get started'
            : `No tasks in ${selectedCategory} category`
          } 
          actionButton={<Button 
                          onClick={onCreateTaskClick} 
                          className="bg-primary text-white font-medium mt-4 px-6 py-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Create Task
                        </Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task, index) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onDelete={onDeleteTask} 
              index={index} 
            />
          ))}
        </div>
      )}
    </>
  );
};

export default TaskLibrarySection;