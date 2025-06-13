import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressCircle from '@/components/atoms/ProgressCircle';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const ChildModeRoutine = ({ 
  selectedChild, 
  todaysTasks, 
  onUpdateTaskStatus,
  getCurrentTask,
  getNextTask
}) => {
  const currentTask = getCurrentTask();
  const nextTask = getNextTask();
  const completedToday = todaysTasks.filter(task => task.status === 'completed').length;
  const totalToday = todaysTasks.length;

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Child Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Text as="span" className="text-2xl font-heading text-white">
            {selectedChild?.name?.charAt(0) || 'K'}
          </Text>
        </div>
        <Text as="h1" className="text-2xl font-heading text-gray-900 mb-2">
          Hi {selectedChild?.name || 'Kiddo'}! 👋
        </Text>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Star" size={16} className="text-secondary" />
          <Text as="span">{selectedChild?.points || 0} points</Text>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto">
          <ProgressCircle percentage={totalToday > 0 ? (completedToday / totalToday) * 100 : 0} size={128} strokeWidth={8}>
            <div className="text-center">
              <Text as="div" className="text-2xl font-bold text-gray-900">
                {completedToday}/{totalToday}
              </Text>
              <Text as="div" className="text-xs text-gray-600">tasks done</Text>
            </div>
          </ProgressCircle>
        </div>
      </div>

      {/* Current Task */}
      {currentTask && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-primary to-purple-600 text-white rounded-2xl p-6 text-center"
        >
          <Text as="div" className="text-6xl mb-4">{currentTask.icon}</Text>
          <Text as="h3" className="text-xl font-bold mb-2">{currentTask.title}</Text>
          <Text as="p" className="text-purple-100 mb-6">{currentTask.instructions}</Text>
          
          <div className="flex space-x-3">
            <Button
              onClick={() => onUpdateTaskStatus(currentTask.id, 'completed')}
              className="flex-1 bg-white text-primary py-3 rounded-xl font-bold text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✓ Done!
            </Button>
            <Button
              onClick={() => onUpdateTaskStatus(currentTask.id, 'need_help')}
              className="flex-1 bg-purple-800 text-white py-3 rounded-xl font-bold text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🆘 Help
            </Button>
          </div>
        </motion.div>
      )}

      {/* Next Task */}
      {nextTask && !currentTask && (
        <div className="bg-white rounded-2xl p-6 text-center border-2 border-gray-100">
          <Text as="div" className="text-4xl mb-4">{nextTask.icon}</Text>
          <Text as="h3" className="text-lg font-bold text-gray-900 mb-2">Coming Up Next</Text>
          <Text as="p" className="text-gray-600 mb-2">{nextTask.title}</Text>
          <Text as="p" className="text-sm text-gray-500">at {nextTask.time}</Text>
        </div>
      )}

      {/* All Tasks Done */}
      {completedToday === totalToday && totalToday > 0 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-accent to-green-600 text-white rounded-2xl p-6 text-center"
        >
          <Text as="div" className="text-6xl mb-4">🎉</Text>
          <Text as="h3" className="text-xl font-bold mb-2">All Done!</Text>
          <Text as="p" className="text-green-100">Great job today! You completed all your tasks!</Text>
          <Text as="div" className="mt-4 text-2xl font-bold">+{completedToday * 10} points!</Text>
        </motion.div>
      )}

      {/* Today's Tasks */}
      <div className="space-y-3">
        <Text as="h3" className="text-lg font-bold text-gray-900">Today's Tasks</Text>
        {todaysTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-4 p-4 rounded-xl border-2 ${
              task.status === 'completed' 
                ? 'bg-green-50 border-green-200' 
                : task.status === 'need_help'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-white border-gray-200'
            }`}
          >
            <Text as="div" className="text-2xl">{task.icon}</Text>
            <div className="flex-1">
              <Text as="h4" className="font-medium text-gray-900">{task.title}</Text>
              <Text as="p" className="text-sm text-gray-600">{task.time}</Text>
            </div>
            <div className="flex items-center">
              {task.status === 'completed' && (
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-500" />
              )}
              {task.status === 'need_help' && (
                <ApperIcon name="HelpCircle" className="w-6 h-6 text-yellow-500" />
              )}
              {task.status === 'pending' && (
                <ApperIcon name="Clock" className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ChildModeRoutine;