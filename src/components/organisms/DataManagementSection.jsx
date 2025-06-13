import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/molecules/Card';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const DataManagementSection = () => {
  // These actions would typically interact with actual data services
  const handleExportData = () => {
    alert('Export data functionality not implemented.');
  };

  const handleImportData = () => {
    alert('Import data functionality not implemented.');
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear ALL app data? This action cannot be undone.')) {
      alert('All data cleared!');
      // Implement actual data clearing logic
    }
  };

  const handleResetApp = () => {
    if (confirm('Are you sure you want to reset the entire app? This will erase all settings and data.')) {
      alert('App reset initiated!');
      // Implement actual app reset logic
    }
  };

  return (
    <Card>
      <Text as="h2" className="text-lg font-semibold text-gray-900 mb-4">Data Management</Text>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={handleExportData}
          className="flex items-center justify-center space-x-2 p-4 border border-gray-300 hover:bg-gray-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="Download" className="w-5 h-5 text-gray-600" />
          <Text as="span" className="font-medium text-gray-900">Export Data</Text>
        </Button>
        
        <Button
          onClick={handleImportData}
          className="flex items-center justify-center space-x-2 p-4 border border-gray-300 hover:bg-gray-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="Upload" className="w-5 h-5 text-gray-600" />
          <Text as="span" className="font-medium text-gray-900">Import Data</Text>
        </Button>
        
        <Button
          onClick={handleClearAllData}
          className="flex items-center justify-center space-x-2 p-4 border border-red-300 hover:bg-red-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="Trash2" className="w-5 h-5 text-red-600" />
          <Text as="span" className="font-medium text-red-900">Clear All Data</Text>
        </Button>
        
        <Button
          onClick={handleResetApp}
          className="flex items-center justify-center space-x-2 p-4 border border-gray-300 hover:bg-gray-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="RefreshCw" className="w-5 h-5 text-gray-600" />
          <Text as="span" className="font-medium text-gray-900">Reset App</Text>
        </Button>
      </div>
    </Card>
  );
};

export default DataManagementSection;