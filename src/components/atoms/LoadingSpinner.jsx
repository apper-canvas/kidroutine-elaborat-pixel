import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const LoadingSpinner = ({ className = 'text-gray-400', size = 24 }) => {
  return (
    <div className="flex justify-center items-center">
      <ApperIcon name="Loader" size={size} className={`animate-spin ${className}`} />
    </div>
  );
};

export default LoadingSpinner;