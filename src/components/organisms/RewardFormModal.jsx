import React from 'react';
import AppModal from '@/components/organisms/AppModal';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const RewardFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [rewardData, setRewardData] = React.useState(initialData || {
    title: '',
    pointsCost: 50,
    type: 'Activity',
    childId: '' // This will be set by the page
  });

  const rewardTypes = ['Activity', 'Privilege', 'Toy', 'Treat', 'Experience'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(rewardData);
  };

  React.useEffect(() => {
    setRewardData(initialData || {
      title: '',
      pointsCost: 50,
      type: 'Activity',
      childId: ''
    });
  }, [initialData, isOpen]);

  return (
    <AppModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Reward' : 'Create New Reward'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Reward Title"
          type="text"
          value={rewardData.title}
          onChange={(e) => setRewardData({...rewardData, title: e.target.value})}
          placeholder="e.g., Extra screen time"
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Points Cost"
            type="number"
            value={rewardData.pointsCost}
            onChange={(e) => setRewardData({...rewardData, pointsCost: parseInt(e.target.value)})}
            min="1"
            max="500"
            required
          />
          
          <FormField
            label="Type"
            type="select"
            value={rewardData.type}
            onChange={(e) => setRewardData({...rewardData, type: e.target.value})}
            options={rewardTypes}
          />
        </div>
        
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-primary text-white hover:bg-purple-700"
          >
            {initialData ? 'Save Changes' : 'Create Reward'}
          </Button>
        </div>
      </form>
    </AppModal>
  );
};

export default RewardFormModal;