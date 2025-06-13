import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/molecules/Card';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const QuickActionsGrid = ({ actions }) => {
  return (
    <Card>
      <Text as="h2" className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            className={`
              flex items-center space-x-3 p-4 rounded-lg
              ${action.bgColor} ${action.hoverBgColor}
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name={action.iconName} className={`w-6 h-6 ${action.iconColor}`} />
            <Text as="span" className="font-medium text-gray-900">{action.label}</Text>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActionsGrid;