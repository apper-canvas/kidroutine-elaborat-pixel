import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/molecules/Card';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const ParentTodaySchedule = ({ todaysTasks, onUpdateTaskStatus }) => {
  return (
    <Card>
      <div className="p-6 border-b border-gray-200">
        <Text as="h3" className="text-lg font-semibold text-gray-900">Today's Schedule</Text>
      </div>
      <div className="p-6">
        {todaysTasks.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <Text as="p" className="text-gray-500">No tasks scheduled for today</Text>
          </div>
        ) : (
          <div className="space-y-4">
            {todaysTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center space-x-4 p-4 rounded-lg border ${
                  task.status === 'completed' 
                    ? 'bg-green-50 border-green-200' 
                    : task.status === 'need_help'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Text as="div" className="text-2xl">{task.icon}</Text>
                <div className="flex-1">
                  <Text as="h4" className="font-medium text-gray-900">{task.title}</Text>
                  <Text as="p" className="text-sm text-gray-600">{task.time} • {task.category}</Text>
                </div>
                <div className="flex items-center space-x-2">
                  <Text as="span" className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : task.status === 'need_help'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status === 'completed' ? 'Done' : 
                     task.status === 'need_help' ? 'Needs Help' : 'Pending'}
                  </Text>
                  {task.status === 'need_help' && (
                    <Button
                      onClick={() => onUpdateTaskStatus(task.id, 'completed')}
                      className="text-primary hover:text-purple-700 text-sm font-medium p-1"
                    >
                      Mark Done
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ParentTodaySchedule;