import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressCircle from '@/components/atoms/ProgressCircle';
import Card from '@/components/molecules/Card';
import Text from '@/components/atoms/Text';

const ChildCardOverview = ({ child, stats, index }) => {
  const completionRate = stats.totalToday > 0 
    ? Math.round((stats.completed / stats.totalToday) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card>
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
            <Text as="span" className="text-white font-bold text-lg">
              {child.name.charAt(0)}
            </Text>
          </div>
          <div>
            <Text as="h3" className="text-lg font-semibold text-gray-900">{child.name}</Text>
            <Text as="p" className="text-sm text-gray-600">Age {child.age}</Text>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex items-center justify-center mb-4">
          <ProgressCircle percentage={completionRate} size={80} strokeWidth={4}>
            <Text as="span" className="text-sm font-bold text-gray-900">{completionRate}%</Text>
          </ProgressCircle>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <Text as="div" className="text-2xl font-bold text-accent">{stats.completed || 0}</Text>
            <Text as="div" className="text-xs text-gray-600">Completed</Text>
          </div>
          <div className="text-center">
            <Text as="div" className="text-2xl font-bold text-secondary">{child.points}</Text>
            <Text as="div" className="text-xs text-gray-600">Points</Text>
          </div>
        </div>

        {/* Alerts */}
        {stats.needHelp > 0 && (
          <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
            <ApperIcon name="AlertTriangle" className="w-4 h-4 text-yellow-600" />
            <Text as="span" className="text-sm text-yellow-800">
              {stats.needHelp} task{stats.needHelp > 1 ? 's' : ''} need help
            </Text>
          </div>
        )}

        {/* Tasks Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <Text as="span" className="text-gray-600">Today's Tasks</Text>
            <Text as="span" className="font-medium">
              {stats.completed || 0}/{stats.totalToday || 0}
            </Text>
          </div>
          <div className="mt-2 flex space-x-1">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ChildCardOverview;