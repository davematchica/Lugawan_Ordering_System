import React from 'react';
import MenuItemCard from './MenuItemCard';
import Card from '../common/Card';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';

const MenuItemList = ({ 
  title, 
  icon, 
  items, 
  emptyMessage,
  onAdd, 
  onToggleAvailability, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {title}
        </h2>
        <Button variant="primary" size="sm" onClick={onAdd}>
          <span className="text-lg mr-1">+</span> Add
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="text-center py-8">
          <div className="text-4xl mb-2 opacity-50">{icon}</div>
          <p className="text-neutral-500">{emptyMessage}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onToggleAvailability={onToggleAvailability}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItemList;