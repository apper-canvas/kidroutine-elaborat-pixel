import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import { childService } from '@/services';
import { toast } from 'react-toastify';
import PageHeader from '@/components/molecules/PageHeader';
import Button from '@/components/atoms/Button';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import ChildManagementSection from '@/components/organisms/ChildManagementSection';
import ChildFormModal from '@/components/organisms/ChildFormModal';
import AppSettingsSection from '@/components/organisms/AppSettingsSection';
import DataManagementSection from '@/components/organisms/DataManagementSection';

const SettingsPage = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddChild, setShowAddChild] = useState(false);

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

  const handleAddChild = async (newChildData) => {
    try {
      await childService.create(newChildData);
      await loadChildren();
      setShowAddChild(false);
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
    return <LoadingState type="card" count={3} message="Loading settings..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadChildren} />;
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <PageHeader 
        title="Settings"
        actions={
          <Button
            onClick={() => setShowAddChild(true)}
            className="flex items-center space-x-2 bg-primary text-white font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="Plus" size={20} />
            <span>Add Child</span>
          </Button>
        }
      />

      {/* Children Management */}
      <ChildManagementSection
        children={children}
        onResetPoints={handleResetPoints}
        onDeleteChild={handleDeleteChild}
        onAddChildClick={() => setShowAddChild(true)}
      />

      {/* App Settings */}
      <AppSettingsSection />

      {/* Data Management */}
      <DataManagementSection />

      {/* Add Child Modal */}
      <ChildFormModal 
        isOpen={showAddChild} 
        onClose={() => setShowAddChild(false)} 
        onSubmit={handleAddChild} 
      />
    </div>
  );
};

export default SettingsPage;