import React from 'react';
import { getStatusInfo } from '../../data/orderStatuses';

const StatusBadge = ({ status, showIcon = true, size = 'md' }) => {
  const statusInfo = getStatusInfo(status);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5'
  };
  
  return (
    <span className={`badge badge-${status} ${sizeClasses[size]}`}>
      {showIcon && <span className="mr-1">{statusInfo.icon}</span>}
      {statusInfo.name}
    </span>
  );
};

export default StatusBadge;