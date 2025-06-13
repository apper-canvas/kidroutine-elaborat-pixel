import React from 'react';
import Card from '@/components/molecules/Card';
import RewardItem from '@/components/molecules/RewardItem';
import EmptyState from '@/components/organisms/EmptyState';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const RewardCatalogSection = ({ rewards, selectedChildPoints, onRedeemReward, onDeleteReward, onCreateRewardClick }) => {
  return (
    <Card>
      <Text as="h2" className="text-lg font-semibold text-gray-900 mb-4">Available Rewards</Text>
      {rewards.length === 0 ? (
        <EmptyState
          icon="Gift"
          title="No rewards available yet"
          message="Create your first reward to get started"
          actionButton={<Button
                          onClick={onCreateRewardClick}
                          className="bg-primary text-white hover:bg-purple-700 px-4 py-2 mt-4"
                        >
                          Create First Reward
                        </Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward, index) => (
            <RewardItem
              key={reward.id}
              reward={reward}
              selectedChildPoints={selectedChildPoints}
              onRedeem={onRedeemReward}
              onDelete={onDeleteReward}
              index={index}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default RewardCatalogSection;