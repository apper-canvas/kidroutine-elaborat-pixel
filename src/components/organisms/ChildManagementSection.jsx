import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/molecules/Card';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import EmptyState from '@/components/organisms/EmptyState';

const ChildManagementSection = ({ children, onResetPoints, onDeleteChild, onAddChildClick }) => {
  return (
    <Card>
      <Text as="h2" className="text-lg font-semibold text-gray-900 mb-4">Manage Children</Text>
      
      {children.length === 0 ? (
        <EmptyState 
          icon="Users" 
          title="No children added yet" 
          message="Add your first child to start managing routines" 
          actionButton={<Button 
                          onClick={onAddChildClick} 
                          className="bg-primary text-white font-medium mt-4 px-6 py-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Add Child
                        </Button>}
        />
      ) : (
        <div className="space-y-4">
          {children.map((child, index) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <Text as="div" className="text-3xl">{child.avatar}</Text>
                <div>
                  <Text as="h3" className="font-semibold text-gray-900">{child.name}</Text>
                  <Text as="p" className="text-sm text-gray-600">Age {child.age} • {child.points} points</Text>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => onResetPoints(child)}
                  className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset Points
                </Button>
                <Button
                  onClick={() => onDeleteChild(child.id)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-800 hover:bg-red-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Remove
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ChildManagementSection;