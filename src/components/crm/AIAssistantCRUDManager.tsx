/**
 * AI Assistant CRUD Manager Component
 * ===================================
 * Manager component orchestrating all CRUD operations,
 * displaying list of assistants, and managing modal state
 */

import React, { FC, useEffect, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import {
  Plus, Edit2, Trash2, Eye, Search, Filter, RotateCw,
} from 'lucide-react';
import { Pagination } from '../ui';
import AIAssistantCRUDModal from './AIAssistantCRUDModal';
import {
  AIAssistantFormData,
  AIAssistantCRUDManagerProps,
  CRUDSearchFilters,
} from './AIAssistantCRUD.types';
import {
  useAIAssistantCRUDModal,
  useAIAssistantCRUDAPI,
  useAIAssistantCRUDSearch,
} from './aiAssistantCRUDHooks';

// ============================================================================
// STYLES
// ============================================================================

const ManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #fafafa;
  border-radius: 12px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const ToolBar = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 8px;
  flex: 1;
  min-width: 250px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  background: ${(props) => (props.$variant === 'secondary' ? '#e0e0e0' : '#0066cc')};
  color: ${(props) => (props.$variant === 'secondary' ? '#333' : 'white')};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const AssistantsTable = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 150px;
  gap: 12px;
  padding: 15px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  font-weight: 600;
  font-size: 13px;
  color: #666;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 150px;
  gap: 12px;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
  transition: background 0.2s ease;

  &:hover {
    background: #f9f9f9;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CellContent = styled.div`
  font-size: 14px;
  color: #333;
`;

const CellLabel = styled.div`
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  font-weight: 600;

  @media (min-width: 769px) {
    display: none;
  }
`;

const StatusBadge = styled.span<{ $active?: boolean }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background: ${(props) => (props.$active ? '#e8f5e9' : '#ffebee')};
  color: ${(props) => (props.$active ? '#2e7d32' : '#c62828')};
`;

const ActionsCell = styled.div`
  display: flex;
  gap: 6px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const IconButton = styled.button<{ $danger?: boolean }>`
  padding: 6px 8px;
  border: none;
  background: ${(props) => (props.$danger ? '#ffebee' : '#f5f5f5')};
  color: ${(props) => (props.$danger ? '#d32f2f' : '#666')};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$danger ? '#ef9a9a' : '#e0e0e0')};
    color: ${(props) => (props.$danger ? '#b71c1c' : '#333')};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;

  svg {
    margin-bottom: 12px;
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// ============================================================================
// COMPONENT
// ============================================================================

const AIAssistantCRUDManager: FC<AIAssistantCRUDManagerProps> = ({
  onAssistantCreated,
  onAssistantUpdated,
  onAssistantDeleted,
  showAuditTrail = false,
}) => {
  const modal = useAIAssistantCRUDModal();
  const api = useAIAssistantCRUDAPI();
  const search = useAIAssistantCRUDSearch();

  const [assistants, setAssistants] = useState<AIAssistantFormData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filters, setFilters] = useState<CRUDSearchFilters>({
    sortBy: 'name',
    sortOrder: 'asc',
  });

  // Load all assistants
  const loadAssistants = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.readAll();
      if (response.success && response.data) {
        setAssistants(response.data);
      }
    } catch (error) {
      console.error('Failed to load assistants:', error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadAssistants();
  }, [loadAssistants]);

  // Handle search
  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      if (query.trim()) {
        await search.search({
          ...filters,
          searchQuery: query,
        });
      } else {
        loadAssistants();
      }
    },
    [search, filters, loadAssistants]
  );

  // Handle modal callbacks
  const handleSuccess = useCallback(
    (data: AIAssistantFormData, mode: string) => {
      if (mode === 'create' && onAssistantCreated) {
        onAssistantCreated(data);
      } else if (mode === 'edit' && onAssistantUpdated) {
        onAssistantUpdated(data);
      } else if (mode === 'delete' && onAssistantDeleted && data.id) {
        onAssistantDeleted(data.id);
      }
      loadAssistants();
    },
    [onAssistantCreated, onAssistantUpdated, onAssistantDeleted, loadAssistants]
  );

  // Sorted and filtered assistants
  const displayedAssistants = searchQuery ? search.assistants : assistants;

  // Calculate paginated assistants
  const paginatedAssistants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return displayedAssistants.slice(startIndex, startIndex + itemsPerPage);
  }, [displayedAssistants, currentPage, itemsPerPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <ManagerContainer>
      <Header>
        <Title>AI Assistants Management</Title>
        <Button onClick={() => modal.openCreate()}>
          <Plus size={16} />
          Create New
        </Button>
      </Header>

      <ToolBar>
        <SearchContainer>
          <Search size={18} color="#999" />
          <SearchInput
            type="text"
            placeholder="Search assistants..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </SearchContainer>
        <Button $variant="secondary" onClick={() => loadAssistants()}>
          <RotateCw size={16} />
          Refresh
        </Button>
      </ToolBar>

      {/* Assistants Table */}
      <AssistantsTable>
        {isLoading ? (
          <EmptyState>
            <LoadingSpinner />
            <p>Loading assistants...</p>
          </EmptyState>
        ) : displayedAssistants.length === 0 ? (
          <EmptyState>
            <p>No assistants found</p>
          </EmptyState>
        ) : (
          <>
            <TableHeader>
              <div>Name</div>
              <div>Department</div>
              <div>Status</div>
              <div>Capabilities</div>
              <div>Actions</div>
            </TableHeader>

            {paginatedAssistants.map((assistant) => (
              <TableRow key={assistant.id}>
                <CellContent>
                  <CellLabel>Name</CellLabel>
                  <strong>{assistant.name}</strong>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {assistant.title}
                  </div>
                </CellContent>

                <CellContent>
                  <CellLabel>Department</CellLabel>
                  {assistant.department}
                </CellContent>

                <CellContent>
                  <CellLabel>Status</CellLabel>
                  <StatusBadge $active={assistant.isActive}>
                    {assistant.isActive ? 'Active' : 'Inactive'}
                  </StatusBadge>
                </CellContent>

                <CellContent>
                  <CellLabel>Capabilities</CellLabel>
                  {assistant.capabilities.slice(0, 2).join(', ')}
                  {assistant.capabilities.length > 2 && (
                    <span style={{ color: '#0066cc' }}>
                      {' '}
                      +
                      {assistant.capabilities.length - 2}
                    </span>
                  )}
                </CellContent>

                <ActionsCell>
                  <IconButton
                    title="View"
                    onClick={() => modal.openView(assistant.id || '')}
                  >
                    <Eye size={16} />
                  </IconButton>
                  <IconButton
                    title="Edit"
                    onClick={() => modal.openEdit(assistant.id || '')}
                  >
                    <Edit2 size={16} />
                  </IconButton>
                  <IconButton
                    $danger
                    title="Delete"
                    onClick={() => modal.openDelete(assistant.id || '')}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </ActionsCell>
              </TableRow>
            ))}
          </>
        )}
      </AssistantsTable>

      {/* Pagination */}
      {displayedAssistants.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalItems={displayedAssistants.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          showFirstLast
          showPrevNext
        />
      )}

      {/* CRUD Modal */}
      <AIAssistantCRUDModal
        isOpen={modal.isOpen}
        mode={modal.mode}
        assistantId={modal.selectedAssistantId}
        onClose={modal.close}
        onSuccess={handleSuccess}
        onError={(error) => {
          console.error('CRUD error:', error);
        }}
      />
    </ManagerContainer>
  );
};

export default AIAssistantCRUDManager;
