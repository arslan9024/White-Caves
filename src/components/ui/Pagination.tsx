/**
 * Pagination Component
 * ====================
 * Accessible pagination control with configurable items per page.
 */

import React, { useMemo, memo } from 'react';
import styled from 'styled-components';
import { spacing } from '../../styles/theme/spacing';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  maxPages?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
}

const PaginationContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  padding: 16px 0;
`;

const PaginationButton = styled.button<{ $isActive?: boolean; $isDisabled?: boolean }>`
  min-width: 40px;
  height: 40px;
  padding: 0 8px;
  border: 1px solid ${props => (props.$isActive ? '#3b82f6' : '#e5e7eb')};
  background-color: ${props => (props.$isActive ? '#3b82f6' : 'white')};
  color: ${props => (props.$isActive ? 'white' : '#1f2937')};
  border-radius: 4px;
  cursor: ${props => (props.$isDisabled ? 'not-allowed' : 'pointer')};
  font-size: 14px;
  font-weight: ${props => (props.$isActive ? '600' : '500')};
  transition: all 0.2s ease;
  opacity: ${props => (props.$isDisabled ? '0.5' : '1')};

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    ${props => !props.$isActive && 'background-color: #f3f4f6;'}
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const EllipsisSpan = styled.span`
  padding: 0 4px;
  color: #6b7280;
`;

/**
 * Pagination Component
 * Accessible pagination control
 */
export const Pagination: React.FC<PaginationProps> = memo(function Pagination({
  currentPage,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  maxPages = 7,
  showFirstLast = true,
  showPrevNext = true,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxPages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate which pages to show
      const leftSide = Math.floor(maxPages / 2);
      const rightSide = maxPages - leftSide - 1;

      let startPage = Math.max(1, currentPage - leftSide);
      let endPage = Math.min(totalPages, currentPage + rightSide);

      // Adjust if at boundaries
      if (currentPage - leftSide < 1) {
        endPage = Math.min(totalPages, endPage + (leftSide - currentPage + 1));
      }
      if (currentPage + rightSide > totalPages) {
        startPage = Math.max(1, startPage - (currentPage + rightSide - totalPages));
      }

      // Add first page
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      // Add range
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  }, [totalPages, currentPage, maxPages]);

  return (
    <PaginationContainer role="navigation" aria-label="Pagination">
      {showFirstLast && (
        <PaginationButton
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          $isDisabled={currentPage <= 1}
          aria-label="First page"
        >
          «
        </PaginationButton>
      )}

      {showPrevNext && (
        <PaginationButton
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          $isDisabled={currentPage <= 1}
          aria-label="Previous page"
        >
          ‹
        </PaginationButton>
      )}

      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <EllipsisSpan key={`ellipsis-${index}`}>
              ...
            </EllipsisSpan>
          );
        }

        return (
          <PaginationButton
            key={page}
            onClick={() => onPageChange(page as number)}
            $isActive={currentPage === page}
            aria-current={currentPage === page ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </PaginationButton>
        );
      })}

      {showPrevNext && (
        <PaginationButton
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages || totalPages <= 0}
          $isDisabled={currentPage >= totalPages || totalPages <= 0}
          aria-label="Next page"
        >
          ›
        </PaginationButton>
      )}

      {showFirstLast && (
        <PaginationButton
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages || totalPages <= 0}
          $isDisabled={currentPage >= totalPages || totalPages <= 0}
          aria-label="Last page"
        >
          »
        </PaginationButton>
      )}
    </PaginationContainer>
  );
});

export default Pagination;
