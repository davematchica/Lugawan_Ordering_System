import React from 'react';
import Button from './Button';

const EmptyState = ({ 
  icon = '📋',
  title = 'No data found',
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-4 opacity-50">{icon}</div>
      <h3 className="text-xl font-bold text-neutral-700 mb-2">{title}</h3>
      {description && (
        <p className="text-neutral-500 mb-6 max-w-md">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;