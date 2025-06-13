import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const TaskItem = ({ task, onDragStart, onDelete, index, draggable = false }) => {
  return (
    <motion.div
      key={task.id}
      draggable={draggable}
      onDragStart={draggable ? (e) => onDragStart(e, task) : null}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow
        ${draggable ? 'cursor-move hover:bg-gray-50' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Text as="div" className="text-3xl">{task.icon}</Text>
          <div>
            <Text as="h3" className="font-semibold text-gray-900 text-lg">{task.title}</Text>
            <Text as="span" className="text-sm text-primary font-medium">{task.category}</Text>
          </div>
        </div>
        {onDelete && (
          <Button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-500 p-1"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        )}
      </div>
      
      <Text as="p" className="text-gray-600 text-sm mb-4 break-words">
        {task.instructions || 'No instructions provided'}
      </Text>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Clock" size={14} />
            <Text as="span">{task.duration}min</Text>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Star" size={14} className="text-secondary" />
            <Text as="span">{task.points} pts</Text>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;