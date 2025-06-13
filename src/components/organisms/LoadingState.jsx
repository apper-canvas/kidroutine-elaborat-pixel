import React from 'react';
import Card from '@/components/molecules/Card';
import LoadingSpinner from '@/components/atoms/LoadingSpinner'; // If you want a small spinner
import Text from '@/components/atoms/Text'; // For loading text

const LoadingState = ({ count = 3, type = 'card', message = 'Loading...' }) => {
  if (type === 'card') {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(count)].map((_, i) => (
              <Card key={i}>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Generic full-page or section loading with spinner and text
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingSpinner size={48} className="mb-4" />
      <Text as="p" className="text-gray-600">{message}</Text>
    </div>
  );
};

export default LoadingState;