import React, { memo, useState, useMemo, useCallback } from 'react';
import { Search, Filter, ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';
import {
  DataGridViewContainer,
  GridToolbar,
  GridSearch,
  GridFilterButton,
  GridTableWrapper,
  GridTable,
  GridTableHeader,
  GridTableCell,
  GridTableRow,
  ActionsColumn,
  RowActionsButton,
  GridPagination,
  PaginationInfo,
  PaginationControls,
  PaginationButton,
  PageNumber
} from './DataGridView.styles';

interface DataColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: DataRow) => React.ReactNode;
}

interface DataRow {
  id: string | number;
  [key: string]: any;
}

interface DataGridViewProps {
  data?: DataRow[];
  columns?: DataColumn[];
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  pageSize?: number;
  onRowClick?: (row: DataRow) => void;
  emptyMessage?: string;
  color?: string;
}

interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc';
}

const DataGridView = memo(
  ({
    data = [],
    columns = [],
    searchable = true,
    filterable = true,
    sortable = true,
    pageSize = 10,
    onRowClick,
    emptyMessage = 'No data available',
    color = 'var(--assistant-color, #0EA5E9)'
  }: DataGridViewProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);

    const handleSort = useCallback(
      (key: string) => {
        if (!sortable) return;
        setSortConfig(prev => ({
          key,
          direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
      },
      [sortable]
    );

    const filteredAndSortedData = useMemo(() => {
      let result = [...data];

      if (searchQuery && searchable) {
        const query = searchQuery.toLowerCase();
        result = result.filter(row =>
          columns.some(col => {
            const value = row[col.key];
            return value && String(value).toLowerCase().includes(query);
          })
        );
      }

      if (sortConfig.key && sortable) {
        result.sort((a, b) => {
          const aVal = a[sortConfig.key!];
          const bVal = b[sortConfig.key!];

          if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return result;
    }, [data, searchQuery, sortConfig, columns, searchable, sortable]);

    const paginatedData = useMemo(() => {
      const start = (currentPage - 1) * pageSize;
      return filteredAndSortedData.slice(start, start + pageSize);
    }, [filteredAndSortedData, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

    return (
      <DataGridViewContainer style={{ '--grid-accent': color } as React.CSSProperties}>
        {(searchable || filterable) && (
          <GridToolbar>
            {searchable && (
              <GridSearch>
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </GridSearch>
            )}
            {filterable && (
              <GridFilterButton type="button">
                <Filter size={16} />
                <span>Filter</span>
              </GridFilterButton>
            )}
          </GridToolbar>
        )}

        <GridTableWrapper>
          <GridTable>
            <thead>
              <tr>
                {columns.map(col => (
                  <GridTableHeader
                    key={col.key}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                    className={col.sortable !== false && sortable ? 'sortable' : ''}
                    style={{ width: col.width }}
                  >
                    <span>
                      {col.label}
                      {sortable &&
                        col.sortable !== false &&
                        sortConfig.key === col.key &&
                        (sortConfig.direction === 'asc' ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        ))}
                    </span>
                  </GridTableHeader>
                ))}
                <GridTableHeader style={{ width: '40px' }} />
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <GridTableRow>
                  <GridTableCell colSpan={columns.length + 1}>{emptyMessage}</GridTableCell>
                </GridTableRow>
              ) : (
                paginatedData.map((row, idx) => (
                  <GridTableRow
                    key={row.id || idx}
                    onClick={() => onRowClick?.(row)}
                    $clickable={!!onRowClick}
                  >
                    {columns.map(col => (
                      <GridTableCell key={col.key}>
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </GridTableCell>
                    ))}
                    <ActionsColumn>
                      <RowActionsButton type="button" aria-label="More actions">
                        <MoreHorizontal size={16} />
                      </RowActionsButton>
                    </ActionsColumn>
                  </GridTableRow>
                ))
              )}
            </tbody>
          </GridTable>
        </GridTableWrapper>

        {totalPages > 1 && (
          <GridPagination>
            <PaginationInfo>
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, filteredAndSortedData.length)} of{' '}
              {filteredAndSortedData.length}
            </PaginationInfo>
            <PaginationControls>
              <PaginationButton
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                type="button"
              >
                Previous
              </PaginationButton>
              <PageNumber>
                {currentPage} / {totalPages}
              </PageNumber>
              <PaginationButton
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                type="button"
              >
                Next
              </PaginationButton>
            </PaginationControls>
          </GridPagination>
        )}
      </DataGridViewContainer>
    );
  }
);

DataGridView.displayName = 'DataGridView';
export default DataGridView;
