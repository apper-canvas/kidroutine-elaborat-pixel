import React from 'react';
import Card from '@/components/molecules/Card';
import PresetRewardCard from '@/components/molecules/PresetRewardCard';
import Text from '@/components/atoms/Text';

const PresetRewardSection = ({ presets, onAddReward }) => {
  return (
    <Card>
      <Text as="h2" className="text-lg font-semibold text-gray-900 mb-4">Quick Add Rewards</Text>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {presets.map((preset, index) => (
          <PresetRewardCard 
            key={index} 
            preset={preset} 
            onAdd={onAddReward} 
            index={index} 
          />
        ))}
      </div>
    </Card>
  );
};

export default PresetRewardSection;