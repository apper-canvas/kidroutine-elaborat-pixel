import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="text-center py-12">
      <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">Something went wrong</Text>
      <Text as="p" className="text-gray-600 mb-4">{message}</Text>
      <Button
        onClick={onRetry}
        className="bg-primary text-white hover:bg-purple-700"
      >
        Try Again
      </Button>
    </div>
  );
};

export default ErrorState;