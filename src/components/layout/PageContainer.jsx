import React from 'react';

const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen pb-20 ${className}`.trim()}>
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;