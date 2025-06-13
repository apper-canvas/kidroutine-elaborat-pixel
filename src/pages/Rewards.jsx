import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import { childService, rewardService } from '../services';
import { toast } from 'react-toastify';

const Rewards = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newReward, setNewReward] = useState({
    title: '',
    pointsCost: 50,
    type: 'Activity',
    childId: ''
  });

  const rewardTypes = ['Activity', 'Privilege', 'Toy', 'Treat', 'Experience'];
  const presetRewards = [
    { title: '30min Extra Screen Time', cost: 30, type: 'Privilege', icon: '📱' },
    { title: 'Choose Tonight\'s Dinner', cost: 50, type: 'Privilege', icon: '🍽️' },
    { title: 'Stay Up 30min Later', cost: 40, type: 'Privilege', icon: '🌙' },
    { title: 'Park Visit', cost: 60, type: 'Activity', icon: '🏞️' },
    { title: 'Ice Cream Treat', cost: 35, type: 'Treat', icon: '🍦' },
    { title: 'Movie Night Choice', cost: 45, type: 'Activity', icon: '🎬' },
    { title: 'Extra Bedtime Story', cost: 25, type: 'Activity', icon: '📚' },
    { title: 'Small Toy ($10)', cost: 100, type: 'Toy', icon: '🧸' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const childrenData = await childService.getAll();
      setChildren(childrenData);
      
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
        await loadRewards(childrenData[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load rewards data');
      toast.error('Failed to load rewards data');
    } finally {
      setLoading(false);
    }
  };

  const loadRewards = async (childId) => {
    try {
      const rewardsData = await rewardService.getByChildId(childId);
      setRewards(rewardsData);
    } catch (err) {
      console.error('Failed to load rewards:', err);
    }
  };

  const handleCreateReward = async (e) => {
    e.preventDefault();
    if (!selectedChild) return;

    try {
      const rewardData = {
        ...newReward,
        childId: selectedChild.id
      };
      await rewardService.create(rewardData);
      await loadRewards(selectedChild.id);
      setShowCreateModal(false);
      setNewReward({
        title: '',
        pointsCost: 50,
        type: 'Activity',
        childId: ''
      });
      toast.success('Reward created successfully!');
    } catch (err) {
      toast.error('Failed to create reward');
    }
  };

  const handleRedeemReward = async (reward) => {
    if (!selectedChild || selectedChild.points < reward.pointsCost) {
      toast.error('Not enough points to redeem this reward');
      return;
    }

    try {
      // Deduct points from child
      const updatedChild = {
        ...selectedChild,
        points: selectedChild.points - reward.pointsCost
      };
      await childService.update(selectedChild.id, updatedChild);
      setSelectedChild(updatedChild);
      
      // Update children array
      const updatedChildren = children.map(child => 
        child.id === selectedChild.id ? updatedChild : child
      );
      setChildren(updatedChildren);
      
      toast.success(`${reward.title} redeemed! Enjoy your reward! 🎉`);
    } catch (err) {
      toast.error('Failed to redeem reward');
    }
  };

  const addPresetReward = async (preset) => {
    if (!selectedChild) return;

    try {
      const rewardData = {
        title: preset.title,
        pointsCost: preset.cost,
        type: preset.type,
        childId: selectedChild.id
      };
      await rewardService.create(rewardData);
      await loadRewards(selectedChild.id);
      toast.success('Reward added to catalog!');
    } catch (err) {
      toast.error('Failed to add reward');
    }
  };

  const deleteReward = async (rewardId) => {
    try {
      await rewardService.delete(rewardId);
      await loadRewards(selectedChild.id);
      toast.success('Reward removed');
    } catch (err) {
      toast.error('Failed to remove reward');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load rewards</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="Gift" className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
        <h3 className="mt-4 text-lg font-medium">No children to reward</h3>
        <p className="mt-2 text-gray-500">Add children first to set up rewards</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium"
        >
          Add Child
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Rewards Center</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedChild?.id || ''}
            onChange={(e) => {
              const child = children.find(c => c.id === e.target.value);
              setSelectedChild(child);
              loadRewards(child.id);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium"
          >
            <ApperIcon name="Plus" size={20} />
            <span>Add Reward</span>
          </motion.button>
        </div>
      </div>

      {/* Points Balance */}
      {selectedChild && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-secondary to-yellow-500 text-white rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{selectedChild.name}'s Points</h2>
              <p className="text-yellow-100">Available to spend</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{selectedChild.points}</div>
              <div className="text-yellow-100">points</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Available Rewards */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Rewards</h2>
        {rewards.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Gift" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No rewards available yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create First Reward
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward, index) => {
              const canAfford = selectedChild && selectedChild.points >= reward.pointsCost;
              
              return (
                <motion.div
                  key={reward.id}
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
                      <h3 className="font-semibold text-gray-900">{reward.title}</h3>
                      <span className="text-sm text-primary font-medium">{reward.type}</span>
                    </div>
                    <button
                      onClick={() => deleteReward(reward.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Star" className="w-4 h-4 text-secondary" />
                      <span className="text-lg font-bold text-gray-900">
                        {reward.pointsCost}
                      </span>
                      <span className="text-sm text-gray-600">points</span>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: canAfford ? 1.05 : 1 }}
                      whileTap={{ scale: canAfford ? 0.95 : 1 }}
                      onClick={() => canAfford && handleRedeemReward(reward)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        canAfford
                          ? 'bg-accent text-white hover:bg-green-600'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Redeem' : 'Need More Points'}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preset Rewards */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Add Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {presetRewards.map((preset, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
            >
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">{preset.icon}</div>
                <h3 className="font-medium text-gray-900 text-sm">{preset.title}</h3>
                <p className="text-xs text-gray-600">{preset.type}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-secondary">
                  {preset.cost} pts
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addPresetReward(preset)}
                  className="text-primary hover:text-purple-700 text-sm font-medium"
                >
                  Add
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Reward Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Create New Reward</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="X" size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleCreateReward} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reward Title
                    </label>
                    <input
                      type="text"
                      value={newReward.title}
                      onChange={(e) => setNewReward({...newReward, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Extra screen time"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Points Cost
                      </label>
                      <input
                        type="number"
                        value={newReward.pointsCost}
                        onChange={(e) => setNewReward({...newReward, pointsCost: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        min="1"
                        max="500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>
                      <select
                        value={newReward.type}
                        onChange={(e) => setNewReward({...newReward, type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {rewardTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Create Reward
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

export default Rewards;