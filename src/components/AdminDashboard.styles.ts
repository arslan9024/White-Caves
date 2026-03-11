import styled from 'styled-components';

export const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

export const AccessDeniedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;

  .access-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary, #1a1a2e);
  }

  p {
    color: var(--text-secondary, #6b7280);
  }
`;

export const Notification = styled.div<{ type: 'success' | 'error' }>`
  position: fixed;
  top: 100px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease;
  background: ${props => props.type === 'success' 
    ? 'linear-gradient(135deg, #10b981, #059669)' 
    : 'linear-gradient(135deg, #ef4444, #dc2626)'};

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color, #e5e7eb);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const Title = styled.div`
  h2 {
    font-size: 1.75rem;
    color: var(--text-primary, #1a1a2e);
    margin-bottom: 0.25rem;
  }

  p {
    color: var(--text-secondary, #6b7280);
  }
`;

export const Stats = styled.div`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: var(--bg-secondary, #f9fafb);
  border-radius: 12px;
`;

export const StatNumber = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary, #c9a050);
`;

export const StatLabel = styled.span`
  font-size: 0.75rem;
  color: var(--text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const Tab = styled.button<{ active?: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${props => props.active ? 'var(--primary, #c9a050)' : 'var(--bg-secondary, #f9fafb)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary, #6b7280)'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? 'var(--primary, #c9a050)' : 'var(--bg-tertiary, #f3f4f6)'};
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    white-space: nowrap;
  }
`;

export const Content = styled.div`
  background: var(--bg-primary, white);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

export const ListSection = styled.div`
  padding: 1.5rem;
`;

export const ListControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    font-size: 0.95rem;
    background: var(--bg-primary, white);
    color: var(--text-primary, #1a1a2e);
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: var(--primary, #c9a050);
    }
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
  }

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

export const TypeFilter = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  background: var(--bg-primary, white);
  color: var(--text-primary, #1a1a2e);
  min-width: 150px;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: var(--primary, #c9a050);
  }
`;

export const AddPropertyBtn = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--primary, #c9a050);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: var(--primary-dark, #b8923f);
    transform: translateY(-1px);
  }
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const PropertyTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 1rem;
    background: var(--bg-secondary, #f9fafb);
    color: var(--text-secondary, #6b7280);
    font-weight: 600;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    color: var(--text-primary, #1a1a2e);
  }

  tbody tr:hover {
    background: var(--bg-secondary, #f9fafb);
  }

  @media (max-width: 768px) {
    th,
    td {
      padding: 0.75rem 0.5rem;
      font-size: 0.85rem;
    }
  }
`;

export const PropertyCell = styled.td`
  min-width: 250px;
`;

export const PropertyPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const PropertyThumb = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

export const PropertyTitle = styled.span`
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.3;
`;

export const TypeBadge = styled.span<{ type: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.type?.toLowerCase()) {
      case 'villa': return '#fef3c7';
      case 'apartment': return '#dbeafe';
      case 'penthouse': return '#ede9fe';
      case 'townhouse': return '#d1fae5';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.type?.toLowerCase()) {
      case 'villa': return '#d97706';
      case 'apartment': return '#2563eb';
      case 'penthouse': return '#7c3aed';
      case 'townhouse': return '#059669';
      default: return '#6b7280';
    }
  }};
`;

export const PriceCell = styled.td`
  font-weight: 600;
  color: var(--primary, #c9a050);
`;

export const ActionsCell = styled.td`
  white-space: nowrap;
`;

export const ActionBtn = styled.button<{ variant?: 'edit' | 'delete' }>`
  padding: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.7;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
    color: ${props => props.variant === 'delete' ? '#ef4444' : 'inherit'};
  }
`;

export const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary, #6b7280);

  span {
    font-size: 3rem;
    display: block;
    margin-bottom: 1rem;
  }
`;

export const PropertyForm = styled.form`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const FormSection = styled.div`
  margin-bottom: 2rem;

  h3 {
    font-size: 1.1rem;
    color: var(--text-primary, #1a1a2e);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color, #e5e7eb);
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};

  label {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-secondary, #6b7280);
  }

  input,
  select,
  textarea {
    padding: 0.75rem;
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    font-size: 0.95rem;
    background: var(--bg-primary, white);
    color: var(--text-primary, #1a1a2e);
    font-family: inherit;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: var(--primary, #c9a050);
    }

    &.error {
      border-color: #ef4444;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  select {
    cursor: pointer;
  }
`;

export const FormError = styled.span`
  display: block;
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

export const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const AmenityCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--bg-secondary, #f9fafb);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-tertiary, #f3f4f6);
  }

  input {
    accent-color: var(--primary, #c9a050);
    cursor: pointer;
  }

  span {
    font-size: 0.9rem;
    color: var(--text-primary, #1a1a2e);
  }
`;

export const ImagesSection = styled.div`
  padding: 1rem;
  background: var(--bg-secondary, #f9fafb);
  border-radius: 12px;
`;

export const ImageList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const ImageItem = styled.div`
  position: relative;
  width: 100px;
  height: 100px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  .remove-image {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #ef4444;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
      background: #dc2626;
    }
  }
`;

export const ImageAddSection = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;

  input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    font-size: 0.9rem;
    background: var(--bg-primary, white);
    color: var(--text-primary, #1a1a2e);
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: var(--primary, #c9a050);
    }

    &.error {
      border-color: #ef4444;
    }
  }
`;

export const AddImageBtn = styled.button`
  padding: 0.75rem 1.25rem;
  background: var(--primary, #c9a050);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: var(--primary-dark, #b8923f);
  }
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color, #e5e7eb);
`;

export const CancelBtn = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--bg-secondary, #f9fafb);
  color: var(--text-secondary, #6b7280);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-tertiary, #f3f4f6);
  }
`;

export const SubmitBtn = styled.button`
  padding: 0.75rem 2rem;
  background: var(--primary, #c9a050);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: var(--primary-dark, #b8923f);
    transform: translateY(-1px);
  }
`;

export const DeleteModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const DeleteModal = styled.div`
  background: var(--bg-primary, white);
  padding: 2rem;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;

  h3 {
    color: var(--text-primary, #1a1a2e);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-secondary, #6b7280);
    margin-bottom: 0.5rem;

    &.warning {
      color: #ef4444;
      font-size: 0.9rem;
    }
  }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const DeleteBtn = styled.button`
  padding: 0.75rem 1.5rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
  }
`;
