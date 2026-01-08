import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronRight, Star, Bell, Settings, HelpCircle } from 'lucide-react';
import { selectCurrentAssistant, selectFavorites, toggleFavorite } from '../../../store/slices/aiAssistantDashboardSlice';
import './SharedComponents.css';

const AssistantSidebar = memo(({ 
  items = [],
  activeItem,
  onItemClick,
  showHeader = true,
  showQuickActions = true,
  collapsed = false
}) => {
  const dispatch = useDispatch();
  const currentAssistant = useSelector(selectCurrentAssistant);
  const favorites = useSelector(selectFavorites);
  
  const isFavorite = currentAssistant && favorites.includes(currentAssistant.id);
  
  const handleToggleFavorite = useCallback(() => {
    if (currentAssistant) {
      dispatch(toggleFavorite(currentAssistant.id));
    }
  }, [dispatch, currentAssistant]);
  
  const assistantColor = currentAssistant?.colorScheme || '#0EA5E9';
  
  return (
    <div 
      className={`assistant-sidebar ${collapsed ? 'collapsed' : ''}`}
      style={{ '--sidebar-accent': assistantColor }}
    >
      {showHeader && currentAssistant && (
        <div className="sidebar-header">
          <div className="assistant-avatar" style={{ background: `${assistantColor}20` }}>
            <span>{currentAssistant.avatar}</span>
          </div>
          {!collapsed && (
            <div className="assistant-info">
              <h3>{currentAssistant.name}</h3>
              <span className="assistant-title">{currentAssistant.title}</span>
            </div>
          )}
          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleToggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star size={16} fill={isFavorite ? assistantColor : 'none'} />
          </button>
        </div>
      )}
      
      <nav className="sidebar-nav">
        {items.map((item, index) => (
          <React.Fragment key={item.id || index}>
            {item.divider && <div className="sidebar-divider" />}
            {item.section && !collapsed && (
              <div className="sidebar-section">{item.section}</div>
            )}
            {!item.divider && !item.section && (
              <button
                className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => onItemClick?.(item.id)}
              >
                {item.icon && <item.icon size={18} />}
                {!collapsed && (
                  <>
                    <span className="item-label">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="item-badge">{item.badge}</span>
                    )}
                    <ChevronRight size={14} className="item-arrow" />
                  </>
                )}
              </button>
            )}
          </React.Fragment>
        ))}
      </nav>
      
      {showQuickActions && !collapsed && (
        <div className="sidebar-footer">
          <button className="quick-action" title="Notifications">
            <Bell size={18} />
          </button>
          <button className="quick-action" title="Settings">
            <Settings size={18} />
          </button>
          <button className="quick-action" title="Help">
            <HelpCircle size={18} />
          </button>
        </div>
      )}
    </div>
  );
});

AssistantSidebar.displayName = 'AssistantSidebar';
export default AssistantSidebar;
