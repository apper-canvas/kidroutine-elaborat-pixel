import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const RewardItem = ({ reward, selectedChildPoints, onRedeem, onDelete, index }) => {
  const canAfford = selectedChildPoints >= reward.pointsCost;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`border-2 rounded-lg p-4 transition-all ${
        canAfford 
          ? 'border-accent bg-green-50 hover:bg-green-100' 
          : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <Text as="h3" className="font-semibold text-gray-900">{reward.title}</Text>
          <Text as="span" className="text-sm text-primary font-medium">{reward.type}</Text>
        </div>
        <Button
          onClick={() => onDelete(reward.id)}
          className="text-gray-400 hover:text-red-500 p-1"
        >
          <ApperIcon name="Trash2" size={16} />
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <ApperIcon name="Star" className="w-4 h-4 text-secondary" />
          <Text as="span" className="text-lg font-bold text-gray-900">
            {reward.pointsCost}
          </Text>
          <Text as="span" className="text-sm text-gray-600">points</Text>
        </div>
        
        <Button
          onClick={() => canAfford && onRedeem(reward)}
          disabled={!canAfford}
          className={`px-4 py-2 rounded-lg font-medium text-sm ${
            canAfford
              ? 'bg-accent text-white hover:bg-green-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          whileHover={{ scale: canAfford ? 1.05 : 1 }}
          whileTap={{ scale: canAfford ? 0.95 : 1 }}
        >
          {canAfford ? 'Redeem' : 'Need More Points'}
        </Button>
      </div>
    </motion.div>
  );
};

export default RewardItem;