// FILE: src/components/dashboard/VSCodeBreadcrumbs/VSCodeBreadcrumbs.view.tsx
/**
 * White Caves Real Estate LLC - VSCode Breadcrumbs Presentational View
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { ChevronRight, ChevronDown, ChevronLeft } from 'lucide-react';
import {
  BreadcrumbsBar,
  HistoryNavButtons,
  NavArrowBtn,
  BreadcrumbItem,
  BreadcrumbButton,
  SiblingPopover,
  SiblingOption,
} from './VSCodeBreadcrumbs.styles';
import { useVSCodeBreadcrumbsLogic } from './VSCodeBreadcrumbs.logic';
import type { VSCodeBreadcrumbsProps } from './VSCodeBreadcrumbs.types';
import { useTheme } from '../../../context/ThemeContext';

export const VSCodeBreadcrumbs: FC<VSCodeBreadcrumbsProps> = props => {
  const { isDark } = useTheme();
  const {
    segments,
    openPopoverIndex,
    popoverRef,
    handleSegmentClick,
    togglePopover,
    handleHistoryBack,
    handleHistoryForward,
  } = useVSCodeBreadcrumbsLogic(props);

  return (
    <BreadcrumbsBar
      $isDark={isDark}
      data-testid="vscode-breadcrumbs-bar"
      className={props.className}
    >
      {/* History Forward / Backward Navigation Arrows */}
      <HistoryNavButtons>
        <NavArrowBtn
          type="button"
          onClick={handleHistoryBack}
          title="Navigate Back"
          data-testid="breadcrumb-history-back"
        >
          <ChevronLeft size={13} />
        </NavArrowBtn>
        <NavArrowBtn
          type="button"
          onClick={handleHistoryForward}
          title="Navigate Forward"
          data-testid="breadcrumb-history-forward"
        >
          <ChevronRight size={13} />
        </NavArrowBtn>
      </HistoryNavButtons>

      {/* Breadcrumb Hierarchy Trail */}
      {segments.map((seg, idx) => {
        const isLast = idx === segments.length - 1;
        const hasSiblings = seg.siblings && seg.siblings.length > 0;
        const isPopoverOpen = openPopoverIndex === idx;

        return (
          <BreadcrumbItem key={`${seg.id}-${idx}`}>
            {idx > 0 && <ChevronRight size={11} className="text-slate-600 mx-0.5 flex-shrink-0" />}

            <BreadcrumbButton
              type="button"
              $isLast={isLast}
              onClick={() => handleSegmentClick(seg.route)}
              data-testid={`breadcrumb-segment-${seg.id.toLowerCase()}`}
            >
              {seg.icon && <span className="mr-0.5">{seg.icon}</span>}
              <span className="id-badge">{seg.id}</span>
              <span>{seg.label}</span>
              {hasSiblings && (
                <span
                  onClick={e => togglePopover(idx, e)}
                  className="p-0.5 rounded hover:bg-white/10 text-slate-500 hover:text-white"
                  title="Show siblings"
                >
                  <ChevronDown size={10} />
                </span>
              )}
            </BreadcrumbButton>

            {/* Sibling Jump Popover Dropdown */}
            {isPopoverOpen && hasSiblings && (
              <SiblingPopover ref={popoverRef} data-testid="breadcrumb-sibling-popover">
                <div className="px-2 py-1 text-[9px] uppercase font-bold text-slate-500 border-b border-slate-800 mb-1">
                  Jump to Sibling
                </div>
                {seg.siblings!.map(sib => (
                  <SiblingOption
                    key={sib.id}
                    type="button"
                    onClick={() => handleSegmentClick(sib.route)}
                    data-testid={`breadcrumb-sibling-option-${sib.id.toLowerCase()}`}
                  >
                    <span>{sib.label}</span>
                    <span className="sib-id">{sib.id}</span>
                  </SiblingOption>
                ))}
              </SiblingPopover>
            )}
          </BreadcrumbItem>
        );
      })}
    </BreadcrumbsBar>
  );
};

export default VSCodeBreadcrumbs;
