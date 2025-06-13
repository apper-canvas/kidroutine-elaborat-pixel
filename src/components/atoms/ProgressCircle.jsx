import React from 'react';

const ProgressCircle = ({ percentage, size = 32, strokeWidth = 4, circleClassName = 'text-gray-200', progressClassName = 'text-accent' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" style={{ width: size, height: size }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className={circleClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${progressClassName} transition-all duration-500`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Child can be a percentage text or any other content */}
      </div>
    </div>
  );
};

export default ProgressCircle;