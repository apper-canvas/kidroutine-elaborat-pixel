import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [mode, setMode] = useState('parent');

  return (
    <div className="max-w-full overflow-hidden">
      {/* Mode Toggle */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'parent' ? 'Parent Dashboard' : 'Kid Zone'}
          </h1>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('parent')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'parent' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ApperIcon name="User" size={16} />
              <span>Parent</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('child')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'child' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ApperIcon name="Heart" size={16} />
              <span>Child</span>
            </motion.button>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border-l-4 ${
          mode === 'parent' 
            ? 'bg-blue-50 border-blue-400' 
            : 'bg-purple-50 border-purple-400'
        }`}>
          <p className="text-sm text-gray-700">
            {mode === 'parent' 
              ? 'Manage your children\'s schedules, track progress, and set up rewards.'
              : 'Complete your daily tasks and earn points for awesome rewards!'
            }
          </p>
        </div>
      </div>

      {/* Main Feature */}
      <MainFeature mode={mode} />
    </div>
  );
};

export default Home;