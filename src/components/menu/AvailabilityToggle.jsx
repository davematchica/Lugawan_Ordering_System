import React from 'react';

const AvailabilityToggle = ({ isAvailable, onChange }) => {
  return (
    <button
      onClick={onChange}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${isAvailable ? 'bg-green-500' : 'bg-neutral-300'}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${isAvailable ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
};

export default AvailabilityToggle;