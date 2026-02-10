import React from 'react';

const Select = ({ 
  label,
  options = [],
  error,
  required = false,
  className = '',
  placeholder = 'Select an option',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-neutral-700 mb-2">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      
      <select
        className={`select ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''} ${className}`.trim()}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option 
            key={option.value || index} 
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
};

export default Select;