import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const ScheduledTaskSlot = ({ timeSlot, scheduledTask, onDragOver, onDrop, onRemoveTask }) => {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, timeSlot)}
      className={`flex items-center p-4 border-2 border-dashed rounded-lg min-h-16 transition-colors ${
        scheduledTask 
          ? 'border-primary bg-primary/5' 
          : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
      }`}
    >
      <Text as="span" className="text-sm font-medium text-gray-600 w-16 flex-shrink-0">
        {timeSlot}
      </Text>
      
      {scheduledTask ? (
        <div className="flex items-center space-x-3 flex-1 ml-4">
          <Text as="div" className="text-2xl">{scheduledTask.icon}</Text>
          <div className="flex-1 min-w-0">
            <Text as="h3" className="font-medium text-gray-900">{scheduledTask.title}</Text>
            <Text as="p" className="text-sm text-gray-600">
              {scheduledTask.category} • {scheduledTask.duration} minutes
            </Text>
          </div>
          <div className="flex items-center space-x-2">
            <Text as="span" className={`px-2 py-1 rounded-full text-xs font-medium ${
              scheduledTask.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : scheduledTask.status === 'need_help'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {scheduledTask.status === 'completed' ? 'Done' : 
               scheduledTask.status === 'need_help' ? 'Help' : 'Pending'}
            </Text>
            <Button
              onClick={() => onRemoveTask(scheduledTask.id)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      ) : (
        <Text as="div" className="flex-1 ml-4 text-gray-400 text-sm">
          Drag a task here to schedule
        </Text>
      )}
    </div>
  );
};

export default ScheduledTaskSlot;