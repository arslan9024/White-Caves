import React, { memo } from 'react';
import './SharedComponents.css';

const DualCategoryTabStrip = memo(({ 
  categories = [],
  activeCategory,
  onCategoryChange,
  counts = {},
  colorScheme = 'default'
}) => {
  const colors = {
    default: { active: '#3B82F6', inactive: '#64748B' },
    red: { active: '#EF4444', inactive: '#64748B' },
    green: { active: '#10B981', inactive: '#64748B' },
    amber: { active: '#F59E0B', inactive: '#64748B' }
  };
  
  const scheme = colors[colorScheme] || colors.default;
  
  return (
    <div className="dual-category-strip">
      {categories.map(category => (
        <button
          key={category.id}
          className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
          onClick={() => onCategoryChange(category.id)}
          style={{
            '--tab-active-color': scheme.active,
            '--tab-inactive-color': scheme.inactive
          }}
        >
          {category.icon && <category.icon size={16} />}
          <span className="tab-label">{category.label}</span>
          {counts[category.id] !== undefined && (
            <span className="tab-count">{counts[category.id]}</span>
          )}
        </button>
      ))}
    </div>
  );
});

DualCategoryTabStrip.displayName = 'DualCategoryTabStrip';
export default DualCategoryTabStrip;
