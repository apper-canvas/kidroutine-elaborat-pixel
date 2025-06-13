import React from 'react';
import AppModal from '@/components/organisms/AppModal';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const TaskFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [taskData, setTaskData] = React.useState(initialData || {
    title: '',
    category: 'Health',
    duration: 30,
    points: 10,
    instructions: '',
    icon: '🏃'
  });

  const categories = ['Health', 'Learning', 'Chores', 'Creativity', 'Free Time'];
  const commonIcons = ['🏃', '🦷', '📚', '✏️', '🧹', '🍽️', '🎨', '🎮', '🛏️', '🧸'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(taskData);
  };

  React.useEffect(() => {
    setTaskData(initialData || {
      title: '',
      category: 'Health',
      duration: 30,
      points: 10,
      instructions: '',
      icon: '🏃'
    });
  }, [initialData, isOpen]);

  return (
    <AppModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Task' : 'Create New Task'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Task Title"
          type="text"
          value={taskData.title}
          onChange={(e) => setTaskData({...taskData, title: e.target.value})}
          placeholder="e.g., Brush teeth"
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Category"
            type="select"
            value={taskData.category}
            onChange={(e) => setTaskData({...taskData, category: e.target.value})}
            options={categories}
          />
          
          <FormField
            label="Duration (min)"
            type="number"
            value={taskData.duration}
            onChange={(e) => setTaskData({...taskData, duration: parseInt(e.target.value)})}
            min="5"
            max="120"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Points"
            type="number"
            value={taskData.points}
            onChange={(e) => setTaskData({...taskData, points: parseInt(e.target.value)})}
            min="1"
            max="50"
          />
          
          <FormField label="Icon">
            <div className="flex flex-wrap gap-2">
              {commonIcons.map((icon) => (
                <Button
                  key={icon}
                  type="button"
                  onClick={() => setTaskData({...taskData, icon})}
                  className={`text-xl p-2 rounded-lg border-2 ${
                    taskData.icon === icon 
                      ? 'border-primary bg-primary/10' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {icon}
                </Button>
              ))}
            </div>
          </FormField>
        </div>
        
        <FormField
          label="Instructions"
          type="textarea"
          value={taskData.instructions}
          onChange={(e) => setTaskData({...taskData, instructions: e.target.value})}
          placeholder="How to complete this task..."
        />
        
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-primary text-white hover:bg-purple-700"
          >
            {initialData ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </AppModal>
  );
};

export default TaskFormModal;