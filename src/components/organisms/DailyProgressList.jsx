import React from 'react';
import Card from '@/components/molecules/Card';
import Text from '@/components/atoms/Text';

const DailyProgressList = ({ dailyProgressData }) => {
  return (
    <Card>
      <Text as="h2" className="text-lg font-semibold text-gray-900 mb-4">Daily Breakdown</Text>
<div className="space-y-3">
        {dailyProgressData && dailyProgressData.length > 0 ? (
          dailyProgressData.map((day) => (
            <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Text as="div" className="text-sm font-medium text-gray-900 w-16">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
                <Text as="div" className="text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </Text>
              </div>
              
              <div className="flex items-center space-x-4">
                <Text as="span" className="text-sm text-gray-600">
                  {day.completed}/{day.total} tasks
                </Text>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${day.rate}%` }}
                    ></div>
                  </div>
                  <Text as="span" className="text-sm font-medium text-gray-900 w-10">
                    {day.rate}%
                  </Text>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Text>No daily data available</Text>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DailyProgressList;