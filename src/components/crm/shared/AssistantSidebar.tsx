import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronRight, Star, Bell, Settings, HelpCircle } from 'lucide-react';
import { selectCurrentAssistant, selectFavorites, toggleFavorite } from '../../../store/slices/aiAssistantDashboardSlice';
import {
  AssistantSidebarContainer,
  SidebarHeader,
  AssistantAvatar,
  AssistantInfo,
  AssistantTitle,
  FavoriteButton,
  SidebarNav,
  SidebarDivider,
  SidebarSection,
  SidebarItem,
  ItemLabel,
  ItemBadge,
  ItemArrow,
  SidebarFooter,
  QuickActionButton
} from './AssistantSidebar.styles';

interface SidebarItemDef {
  id: string;
  label?: string;
  icon?: React.ComponentType<{ size?: number }>;
  badge?: number;
  divider?: boolean;
  section?: string;
}

interface AssistantSidebarProps {
  items?: SidebarItemDef[];
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  showHeader?: boolean;
  showQuickActions?: boolean;
  collapsed?: boolean;
}

const AssistantSidebar = memo(({ 
  items = [],
  activeItem,
  onItemClick,
  showHeader = true,
  showQuickActions = true,
  collapsed = false
}: AssistantSidebarProps) => {
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
    <AssistantSidebarContainer $collapsed={collapsed} $sidebarAccent={assistantColor}>
      {showHeader && currentAssistant && (
        <SidebarHeader>
          <AssistantAvatar $background={`${assistantColor}20`}>
            <span>{currentAssistant.avatar}</span>
          </AssistantAvatar>
          {!collapsed && (
            <AssistantInfo>
              <h3>{currentAssistant.name}</h3>
              <AssistantTitle>{currentAssistant.title}</AssistantTitle>
            </AssistantInfo>
          )}
          <FavoriteButton 
            $isFavorite={isFavorite}
            onClick={handleToggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star size={16} fill={isFavorite ? assistantColor : 'none'} />
          </FavoriteButton>
        </SidebarHeader>
      )}
      
      <SidebarNav>
        {items.map((item) => (
          <React.Fragment key={item.id}>
            {item.divider && <SidebarDivider />}
            {item.section && !collapsed && (
              <SidebarSection>{item.section}</SidebarSection>
            )}
            {!item.divider && !item.section && (
              <SidebarItem
                $active={activeItem === item.id}
                onClick={() => onItemClick?.(item.id)}
              >
                {item.icon && <item.icon size={18} />}
                {!collapsed && (
                  <>
                    <ItemLabel>{item.label}</ItemLabel>
                    {item.badge !== undefined && (
                      <ItemBadge>{item.badge}</ItemBadge>
                    )}
                    <ItemArrow>
                      <ChevronRight size={14} />
                    </ItemArrow>
                  </>
                )}
              </SidebarItem>
            )}
          </React.Fragment>
        ))}
      </SidebarNav>
      
      {showQuickActions && !collapsed && (
        <SidebarFooter>
          <QuickActionButton title="Notifications">
            <Bell size={18} />
          </QuickActionButton>
          <QuickActionButton title="Settings">
            <Settings size={18} />
          </QuickActionButton>
          <QuickActionButton title="Help">
            <HelpCircle size={18} />
          </QuickActionButton>
        </SidebarFooter>
      )}
    </AssistantSidebarContainer>
  );
});

AssistantSidebar.displayName = 'AssistantSidebar';
export default AssistantSidebar;
