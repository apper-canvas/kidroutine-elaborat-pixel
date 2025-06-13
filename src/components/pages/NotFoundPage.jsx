import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-96 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <Text as="h1" className="text-4xl font-bold text-gray-900 mb-2">404</Text>
          <Text as="p" className="text-xl text-gray-600 mb-8">Page not found</Text>
          <Text as="p" className="text-gray-500 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </Text>
          <Button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-white hover:bg-purple-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;