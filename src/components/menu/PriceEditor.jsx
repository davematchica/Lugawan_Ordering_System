import React from 'react';
import Input from '../common/Input';

const PriceEditor = ({ value, onChange, error }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-neutral-700 mb-2">
        Price (₱) *
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 font-semibold">
          ₱
        </span>
        <Input
          type="number"
          placeholder="0.00"
          value={value}
          onChange={onChange}
          className={`pl-8 ${error ? 'border-red-500' : ''}`}
          step="0.01"
          min="0"
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default PriceEditor;