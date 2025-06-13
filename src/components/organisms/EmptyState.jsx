import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const EmptyState = ({ icon, title, message, actionButton }) => {
  return (
    <div className="text-center py-12">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <ApperIcon name={icon} className="w-16 h-16 text-gray-300 mx-auto" />
      </motion.div>
      <Text as="h3" className="mt-4 text-lg font-medium">{title}</Text>
      <Text as="p" className="mt-2 text-gray-500">{message}</Text>
      {actionButton}
    </div>
  );
};

export default EmptyState;