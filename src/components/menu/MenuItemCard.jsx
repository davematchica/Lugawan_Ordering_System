import React from 'react';
import Card from '../common/Card';
import { formatPrice } from '../../utils/priceHelpers';

const MenuItemCard = ({ item, onToggleAvailability, onEdit, onDelete }) => {
  return (
    <Card className="relative">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-neutral-800">{item.name}</h3>
            {!item.is_available && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                Out of Stock
              </span>
            )}
          </div>
          <div className="text-xl font-bold text-primary-600">
            {formatPrice(item.price)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Availability */}
          <button
            onClick={() => onToggleAvailability(item.id, item.is_available)}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${item.is_available ? 'bg-green-500' : 'bg-neutral-300'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${item.is_available ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-neutral-600 hover:text-primary-500 transition-colors touch-target"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-neutral-600 hover:text-red-500 transition-colors touch-target"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default MenuItemCard;