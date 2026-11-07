import React, { memo } from 'react';
import { CATEGORIES } from './authTypes';

interface CategorySelectionCardProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
  onContinue: () => void;
}

export const CategorySelectionCard = memo(function CategorySelectionCard({
  selectedCategory,
  onSelectCategory,
  onContinue,
}: CategorySelectionCardProps) {
  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Select Your Category</h1>
          <p>Choose the category that best describes you</p>
        </div>

        <div className="category-selection">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span className="category-label">{cat.label}</span>
              <span className="category-desc">{cat.description}</span>
            </button>
          ))}
        </div>

        <button className="btn btn-primary" onClick={onContinue} disabled={!selectedCategory}>
          Continue
        </button>
      </div>
    </div>
  );
});

export default CategorySelectionCard;
