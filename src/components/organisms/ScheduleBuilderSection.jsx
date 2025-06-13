import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/molecules/Card';
import TaskItem from '@/components/molecules/TaskItem';
import ScheduledTaskSlot from '@/components/molecules/ScheduledTaskSlot';
import Text from '@/components/atoms/Text';

const ScheduleBuilderSection = ({ 
  tasks, 
  scheduledTasks, 
  timeSlots, 
  onDragStart, 
  onDrop, 
  onRemoveScheduledTask 
}) => {

  const getTaskAtTime = (timeSlot) => {
    const scheduled = scheduledTasks.find(task => task.time === timeSlot);
    if (!scheduled) return null;
    
    const taskDetails = tasks.find(task => task.id === scheduled.taskId);
    return { ...scheduled, ...taskDetails };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Task Library */}
      <Card>
        <Text as="h2" className="text-lg font-semibold text-gray-900 mb-4">Available Tasks</Text>
        <div className="space-y-3">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart(e, task)}
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
            >
              <Text as="div" className="text-xl">{task.icon}</Text>
              <div className="flex-1 min-w-0">
                <Text as="h3" className="font-medium text-gray-900 text-sm truncate">{task.title}</Text>
                <Text as="p" className="text-xs text-gray-500">{task.category} • {task.duration}min</Text>
              </div>
              <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-400" />
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Schedule Timeline */}
      <Card className="lg:col-span-3">
        <Text as="h2" className="text-lg font-semibold text-gray-900 mb-4">
          Daily Schedule
        </Text>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {timeSlots.map((timeSlot) => (
            <ScheduledTaskSlot
              key={timeSlot}
              timeSlot={timeSlot}
              scheduledTask={getTaskAtTime(timeSlot)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              onRemoveTask={onRemoveScheduledTask}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ScheduleBuilderSection;