import React from 'react';
import Text from '@/components/atoms/Text';

const PageHeader = ({ title, actions, children }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Text as="h1" className="text-2xl font-bold text-gray-900">
        {title}
      </Text>
      {actions && <div className="flex items-center space-x-4">{actions}</div>}
      {children}
    </div>
  );
};

export default PageHeader;