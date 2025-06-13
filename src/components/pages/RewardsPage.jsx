import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import { childService, rewardService } from '@/services';
import { toast } from 'react-toastify';
import PageHeader from '@/components/molecules/PageHeader';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import RewardCatalogSection from '@/components/organisms/RewardCatalogSection';
import PresetRewardSection from '@/components/organisms/PresetRewardSection';
import RewardFormModal from '@/components/organisms/RewardFormModal';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const RewardsPage = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (selectedChild) {
      loadRewards(selectedChild.id);
    }
  }, [selectedChild]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const childrenData = await childService.getAll();
      setChildren(childrenData);
      
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
        // rewards will be loaded by the useEffect hook
      } else {
        setRewards([]); // Clear rewards if no children
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

  const handleCreateReward = async (newRewardData) => {
    if (!selectedChild) return;

    try {
      const rewardData = {
        ...newRewardData,
        childId: selectedChild.id
      };
      await rewardService.create(rewardData);
      await loadRewards(selectedChild.id);
      setShowCreateModal(false);
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
      
      // Update children array (if needed elsewhere, though setSelectedChild updates local state)
      setChildren(prevChildren => prevChildren.map(child => 
        child.id === selectedChild.id ? updatedChild : child
      ));
      
      toast.success(`${reward.title} redeemed! Enjoy your reward! 🎉`);
    } catch (err) {
      toast.error('Failed to redeem reward');
    }
  };

  const addPresetReward = async (preset) => {
    if (!selectedChild) {
        toast.error('Please select a child first.');
        return;
    }

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
    return <LoadingState type="card" count={6} message="Loading rewards..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  if (children.length === 0) {
    return (
      <EmptyState 
        icon="Gift" 
        title="No children to reward" 
        message="Add children first to set up rewards" 
        actionButton={<Button 
                        onClick={() => navigate('/settings')} 
                        className="bg-primary text-white font-medium mt-4 px-6 py-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add Child
                      </Button>}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <PageHeader 
        title="Rewards Center"
        actions={
          <>
            <Select
              value={selectedChild?.id || ''}
              onChange={(e) => {
                const child = children.find(c => c.id === e.target.value);
                setSelectedChild(child);
              }}
              options={children.map(child => ({ value: child.id, label: child.name }))}
            />
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-primary text-white font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Plus" size={20} />
              <Text as="span">Add Reward</Text>
            </Button>
          </>
        }
      />

      {/* Points Balance */}
      {selectedChild && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-secondary to-yellow-500 text-white rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <Text as="h2" className="text-2xl font-bold">{selectedChild.name}'s Points</Text>
              <Text as="p" className="text-yellow-100">Available to spend</Text>
            </div>
            <div className="text-right">
              <Text as="div" className="text-4xl font-bold">{selectedChild.points}</Text>
              <Text as="div" className="text-yellow-100">points</Text>
            </div>
          </div>
        </motion.div>
      )}

      {/* Available Rewards */}
      <RewardCatalogSection 
        rewards={rewards} 
        selectedChildPoints={selectedChild?.points || 0} 
        onRedeemReward={handleRedeemReward} 
        onDeleteReward={deleteReward}
        onCreateRewardClick={() => setShowCreateModal(true)}
      />

      {/* Preset Rewards */}
      <PresetRewardSection 
        presets={presetRewards} 
        onAddReward={addPresetReward} 
      />

      {/* Create Reward Modal */}
      <RewardFormModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        onSubmit={handleCreateReward} 
      />
    </div>
  );
};

export default RewardsPage;