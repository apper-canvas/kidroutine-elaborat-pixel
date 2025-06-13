import React from 'react';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import { motion } from 'framer-motion';

const PresetRewardCard = ({ preset, onAdd, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
    >
      <div className="text-center mb-3">
        <Text as="div" className="text-3xl mb-2">{preset.icon}</Text>
        <Text as="h3" className="font-medium text-gray-900 text-sm">{preset.title}</Text>
        <Text as="p" className="text-xs text-gray-600">{preset.type}</Text>
      </div>
      
      <div className="flex items-center justify-between">
        <Text as="span" className="text-sm font-bold text-secondary">
          {preset.cost} pts
        </Text>
        <Button
          onClick={() => onAdd(preset)}
          className="text-primary hover:text-purple-700 text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add
        </Button>
      </div>
    </motion.div>
  );
};

export default PresetRewardCard;