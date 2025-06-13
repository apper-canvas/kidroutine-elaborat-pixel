import React from 'react';
import StatsDisplay from '@/components/molecules/StatsDisplay';

const ProgressStatsGrid = ({ progressData, selectedChild }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatsDisplay
        iconName="Target"
        iconColor="text-accent"
        bgColor="bg-accent/10"
        label="Overall Rate"
        value={`${progressData.overall || 0}%`}
        delay={0}
      />
      <StatsDisplay
        iconName="Flame"
        iconColor="text-secondary"
        bgColor="bg-secondary/10"
        label="Current Streak"
        value={`${progressData.streak || 0} days`}
        delay={0.1}
      />
      <StatsDisplay
        iconName="CheckCircle"
        iconColor="text-primary"
        bgColor="bg-primary/10"
        label="Tasks Done"
        value={progressData.totalCompleted || 0}
        delay={0.2}
      />
      <StatsDisplay
        iconName="Star"
        iconColor="text-blue-600"
        bgColor="bg-blue-100"
        label="Points Earned"
        value={selectedChild?.points || 0}
        delay={0.3}
      />
    </div>
  );
};

export default ProgressStatsGrid;