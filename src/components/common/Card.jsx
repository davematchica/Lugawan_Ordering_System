import React from 'react';

const Card = ({ 
  children, 
  hover = false,
  className = '',
  onClick,
  ...props 
}) => {
  const hoverClass = hover ? 'card-hover cursor-pointer' : '';
  
  return (
    <div
      className={`card ${hoverClass} ${className}`.trim()}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;