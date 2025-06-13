import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import { childService } from '../services';
import { toast } from 'react-toastify';

const Settings = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChild, setNewChild] = useState({
    name: '',
    age: 5,
    avatar: '👦',
    points: 0
  });

  const avatarOptions = ['👦', '👧', '🧒', '👶', '🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️'];

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await childService.getAll();
      setChildren(data);
    } catch (err) {
      setError(err.message || 'Failed to load children');
      toast.error('Failed to load children');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    try {
      await childService.create(newChild);
      await loadChildren();
      setShowAddChild(false);
      setNewChild({
        name: '',
        age: 5,
        avatar: '👦',
        points: 0
      });
      toast.success('Child added successfully!');
    } catch (err) {
      toast.error('Failed to add child');
    }
  };

  const handleDeleteChild = async (childId) => {
    if (!confirm('Are you sure you want to remove this child? This will delete all their data.')) {
      return;
    }

    try {
      await childService.delete(childId);
      await loadChildren();
      toast.success('Child removed successfully');
    } catch (err) {
      toast.error('Failed to remove child');
    }
  };

  const handleResetPoints = async (child) => {
    if (!confirm(`Reset ${child.name}'s points to 0?`)) {
      return;
    }

    try {
      await childService.update(child.id, { ...child, points: 0 });
      await loadChildren();
      toast.success('Points reset successfully');
    } catch (err) {
      toast.error('Failed to reset points');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load settings</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadChildren}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddChild(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium"
        >
          <ApperIcon name="Plus" size={20} />
          <span>Add Child</span>
        </motion.button>
      </div>

      {/* Children Management */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Manage Children</h2>
        
        {children.length === 0 ? (
          <div className="text-center py-8">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="Users" className="w-12 h-12 text-gray-300 mx-auto" />
            </motion.div>
            <h3 className="mt-4 text-lg font-medium">No children added yet</h3>
            <p className="mt-2 text-gray-500">Add your first child to start managing routines</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddChild(true)}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium"
            >
              Add Child
            </motion.button>
          </div>
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
                  <div className="text-3xl">{child.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{child.name}</h3>
                    <p className="text-sm text-gray-600">Age {child.age} • {child.points} points</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleResetPoints(child)}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    Reset Points
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteChild(child.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Remove
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* App Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">App Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-600">Receive reminders for tasks and progress updates</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Sound Effects</h3>
              <p className="text-sm text-gray-600">Play sounds when tasks are completed</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
              <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Dark Mode</h3>
              <p className="text-sm text-gray-600">Switch to dark theme</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
              <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ApperIcon name="Download" className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Export Data</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ApperIcon name="Upload" className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Import Data</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center space-x-2 p-4 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <ApperIcon name="Trash2" className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-900">Clear All Data</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ApperIcon name="RefreshCw" className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Reset App</span>
          </motion.button>
        </div>
      </div>

      {/* Add Child Modal */}
      <AnimatePresence>
        {showAddChild && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowAddChild(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Add New Child</h2>
                  <button
                    onClick={() => setShowAddChild(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="X" size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleAddChild} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Child's Name
                    </label>
                    <input
                      type="text"
                      value={newChild.name}
                      onChange={(e) => setNewChild({...newChild, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter child's name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      value={newChild.age}
                      onChange={(e) => setNewChild({...newChild, age: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      min="3"
                      max="18"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose Avatar
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {avatarOptions.map((avatar) => (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => setNewChild({...newChild, avatar})}
                          className={`text-2xl p-2 rounded-lg border-2 ${
                            newChild.avatar === avatar 
                              ? 'border-primary bg-primary/10' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddChild(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add Child
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;