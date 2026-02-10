import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };
  
  const colorClasses = {
    primary: 'border-primary-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    neutral: 'border-neutral-500 border-t-transparent'
  };
  
  return (
    <div className="flex items-center justify-center">
      <div className={`
        ${sizeClasses[size]}
        ${colorClasses[color]}
        rounded-full
        spinner
      `.trim().replace(/\s+/g, ' ')}></div>
    </div>
  );
};

export default LoadingSpinner;