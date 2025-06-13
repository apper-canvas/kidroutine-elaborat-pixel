import React from 'react';
import ChildCardOverview from '@/components/molecules/ChildCardOverview';
import Text from '@/components/atoms/Text';

const ParentDashboardOverview = ({ children, stats }) => {
  if (children.length === 0) {
    return (
      <div className="text-center py-12">
        <Text as="h3" className="mt-4 text-lg font-medium">No children added yet</Text>
        <Text as="p" className="mt-2 text-gray-500">Add your first child to start tracking their routines</Text>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children.map((child, index) => (
        <ChildCardOverview 
          key={child.id} 
          child={child} 
          stats={stats[child.id] || {}} 
          index={index} 
        />
      ))}
    </div>
  );
};

export default ParentDashboardOverview;