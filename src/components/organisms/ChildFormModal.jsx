import React from 'react';
import AppModal from '@/components/organisms/AppModal';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const ChildFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [childData, setChildData] = React.useState(initialData || {
    name: '',
    age: 5,
    avatar: '👦',
    points: 0
  });

  const avatarOptions = ['👦', '👧', '🧒', '👶', '🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(childData);
  };

  React.useEffect(() => {
    setChildData(initialData || {
      name: '',
      age: 5,
      avatar: '👦',
      points: 0
    });
  }, [initialData, isOpen]);

  return (
    <AppModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Child' : 'Add New Child'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Child's Name"
          type="text"
          value={childData.name}
          onChange={(e) => setChildData({...childData, name: e.target.value})}
          placeholder="Enter child's name"
          required
        />
        
        <FormField
          label="Age"
          type="number"
          value={childData.age}
          onChange={(e) => setChildData({...childData, age: parseInt(e.target.value)})}
          min="3"
          max="18"
          required
        />
        
        <FormField label="Choose Avatar">
          <div className="flex flex-wrap gap-2">
            {avatarOptions.map((avatar) => (
              <Button
                key={avatar}
                type="button"
                onClick={() => setChildData({...childData, avatar})}
                className={`text-2xl p-2 rounded-lg border-2 ${
                  childData.avatar === avatar 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {avatar}
              </Button>
            ))}
          </div>
        </FormField>
        
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
            {initialData ? 'Save Changes' : 'Add Child'}
          </Button>
        </div>
      </form>
    </AppModal>
  );
};

export default ChildFormModal;