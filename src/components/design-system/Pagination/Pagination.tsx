/**
 * Pagination Component
 * Navigate through pages of data
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import { Button } from '../Button';

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxButtons?: number;
  className?: string;
};

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const PageButton = styled(Button)`
  min-width: 40px;
`;

const PageInfo = styled.span`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  white-space: nowrap;
`;

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxButtons = 5,
  className = '',
}) => {
  // Guard: don't render pagination when there are no pages
  const safeTotalPages = Math.max(0, totalPages);
  if (safeTotalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const halfMax = Math.floor(maxButtons / 2);
    let start = Math.max(1, currentPage - halfMax);
    let end = Math.min(totalPages, currentPage + halfMax);

    if (start > 1) pages.push(1);
    if (start > 2) pages.push('...');

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push('...');
    if (end < totalPages) pages.push(totalPages);

    return pages;
  };

  return (
    <PaginationContainer className={className}>
      <PageButton
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        ← Previous
      </PageButton>

      {getPageNumbers().map((page, idx) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${idx}`} style={{ color: theme.colors.text.tertiary }}>
              ...
            </span>
          );
        }

        return (
          <PageButton
            key={page}
            variant={page === currentPage ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </PageButton>
        );
      })}

      <PageButton
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next →
      </PageButton>

      <PageInfo>
        Page {currentPage} of {totalPages}
      </PageInfo>
    </PaginationContainer>
  );
};

Pagination.displayName = 'Pagination';

export default Pagination;
