import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/molecules/Card';
import Text from '@/components/atoms/Text';
import { motion } from 'framer-motion';

const StatsDisplay = ({ iconName, iconColor, bgColor, label, value, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card>
        <div className="flex items-center">
          <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
            <ApperIcon name={iconName} className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="ml-4">
            <Text as="p" className="text-sm font-medium text-gray-600">{label}</Text>
            <Text as="p" className="text-2xl font-bold text-gray-900">{value}</Text>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatsDisplay;