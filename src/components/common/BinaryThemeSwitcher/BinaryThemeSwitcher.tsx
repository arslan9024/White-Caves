/**
 * BinaryThemeSwitcher.tsx — View Layer (4-Way Component Architecture)
 * Sits at folder root: Pure presentational shell drawing data variables and logic hooks.
 */

import React, { FC } from 'react';
import { useBinaryThemeSwitcherLogic, UseBinaryThemeSwitcherProps } from './logic/BinaryThemeSwitcher.logic';
import { SwitchContainer, ModeBtn } from './styles/BinaryThemeSwitcher.style';

export interface BinaryThemeSwitcherProps extends UseBinaryThemeSwitcherProps {
  className?: string;
}

export const BinaryThemeSwitcher: FC<BinaryThemeSwitcherProps> = ({
  onToggle,
  className,
}) => {
  const { themeMode, handleSelect, options } = useBinaryThemeSwitcherLogic({ onToggle });

  return (
    <SwitchContainer className={className} data-testid="binary-theme-switcher" aria-label="Select Theme Mode">
      {options.map(opt => (
        <ModeBtn
          key={opt.mode}
          $active={themeMode === opt.mode}
          onClick={() => handleSelect(opt.mode)}
          title={opt.ariaLabel}
          aria-label={opt.ariaLabel}
          data-testid={`theme-btn-${opt.mode}`}
        >
          <span>{opt.icon}</span>
          <span>{opt.label}</span>
        </ModeBtn>
      ))}
    </SwitchContainer>
  );
};

export default BinaryThemeSwitcher;
