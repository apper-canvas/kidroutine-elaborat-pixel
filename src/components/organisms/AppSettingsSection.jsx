import React from 'react';
import Card from '@/components/molecules/Card';
import Text from '@/components/atoms/Text';
import ToggleSwitch from '@/components/atoms/ToggleSwitch';

const AppSettingsSection = () => {
  // These would typically be managed by a global state or context
  // For now, they are static toggles
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = React.useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  return (
    <Card>
      <Text as="h2" className="text-lg font-semibold text-gray-900 mb-4">App Settings</Text>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Text as="h3" className="font-medium text-gray-900">Notifications</Text>
            <Text as="p" className="text-sm text-gray-600">Receive reminders for tasks and progress updates</Text>
          </div>
          <ToggleSwitch 
            checked={notificationsEnabled} 
            onChange={() => setNotificationsEnabled(!notificationsEnabled)} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Text as="h3" className="font-medium text-gray-900">Sound Effects</Text>
            <Text as="p" className="text-sm text-gray-600">Play sounds when tasks are completed</Text>
          </div>
          <ToggleSwitch 
            checked={soundEffectsEnabled} 
            onChange={() => setSoundEffectsEnabled(!soundEffectsEnabled)} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Text as="h3" className="font-medium text-gray-900">Dark Mode</Text>
            <Text as="p" className="text-sm text-gray-600">Switch to dark theme</Text>
          </div>
          <ToggleSwitch 
            checked={darkModeEnabled} 
            onChange={() => setDarkModeEnabled(!darkModeEnabled)} 
          />
        </div>
      </div>
    </Card>
  );
};

export default AppSettingsSection;