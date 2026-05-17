import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setCurrentSubModule } from '../../store/navigationSlice';
import { getSubNavItems, getModuleById } from '../../features/featureRegistry';
import {
  SubNavBarWrapper,
  SubNavBarContainer,
  SubNavBarHeader,
  ModuleIcon,
  ModuleTitle,
  SubNavBarNav,
  SubNavItem,
  SubNavIcon,
  SubNavLabel,
  SubNavBadge,
  SubNavIndicator,
  SubNavBarActions,
  SubNavActionButton,
  ActionIcon,
  ActionLabel,
} from './SubNavBar/SubNavBar.styles';

interface SubNavBarProps {
  moduleId?: string;
  onSubModuleChange?: (subModuleId: string) => void;
}

interface SubNavItemType {
  id: string;
  label: string;
  icon: string;
  badgeCount?: number;
}

const SubNavBar: React.FC<SubNavBarProps> = ({ moduleId, onSubModuleChange }) => {
  const dispatch = useDispatch();
  const currentSubModule = useSelector((state: RootState) => state.navigation.currentSubModule);
  const activeRole = useSelector((state: RootState) => state.navigation.activeRole);

  const role = moduleId || activeRole || '';
  const subNavItems = getSubNavItems(role, role) as SubNavItemType[];
  const currentModule = getModuleById(role);

  const handleSubModuleClick = (subModule: SubNavItemType) => {
    dispatch(setCurrentSubModule(subModule.id));
    if (onSubModuleChange) {
      onSubModuleChange(subModule.id);
    }
  };

  if (subNavItems.length === 0) return null;

  return (
    <SubNavBarWrapper>
      <SubNavBarContainer>
        <SubNavBarHeader>
          {currentModule && (
            <>
              <ModuleIcon>{currentModule.icon}</ModuleIcon>
              <ModuleTitle>{currentModule.name}</ModuleTitle>
            </>
          )}
        </SubNavBarHeader>

        <SubNavBarNav>
          {subNavItems.map((item) => (
            <SubNavItem
              key={item.id}
              $isActive={currentSubModule === item.id}
              onClick={() => handleSubModuleClick(item)}
              aria-label={item.label}
              title={item.label}
              type="button"
            >
              <SubNavIcon>{item.icon}</SubNavIcon>
              <SubNavLabel>{item.label}</SubNavLabel>
              {item.badgeCount && item.badgeCount > 0 && (
                <SubNavBadge $isActive={currentSubModule === item.id}>{item.badgeCount}</SubNavBadge>
              )}
              {currentSubModule === item.id && <SubNavIndicator />}
            </SubNavItem>
          ))}
        </SubNavBarNav>

        <SubNavBarActions>
          <SubNavActionButton type="button">
            <ActionIcon>⚡</ActionIcon>
            <ActionLabel>Quick Action</ActionLabel>
          </SubNavActionButton>
        </SubNavBarActions>
      </SubNavBarContainer>
    </SubNavBarWrapper>
  );
};

export default SubNavBar;
