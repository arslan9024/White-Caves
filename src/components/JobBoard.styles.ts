import styled from 'styled-components';

export const JobBoardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const BoardTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2rem;
  margin: 0 0 2rem 0;

  @media (max-width: 768px) {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
  }
`;

export const JobsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const JobCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

export const JobTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  margin: 0 0 0.75rem 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const JobDescription = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

export const JobDetails = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

export const DetailBadge = styled.span`
  background: #f5f5f5;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
  color: var(--text-primary);
`;

export const SubmitButton = styled.button`
  background: #e41e3f;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: auto;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #c41834;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
  }
`;

export const ApplicationForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
`;

export const FormSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #e41e3f;
    box-shadow: 0 0 0 2px rgba(228, 30, 63, 0.1);
  }

  option {
    color: var(--text-primary);
  }
`;

export const FormInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;
  color: var(--text-primary);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #e41e3f;
    box-shadow: 0 0 0 2px rgba(228, 30, 63, 0.1);
  }

  &[type="file"] {
    border: none;
    padding: 0.5rem 0;
    cursor: pointer;
  }

  &[type="file"]::file-selector-button {
    background: #e41e3f;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;

    &:hover {
      background: #c41834;
    }
  }
`;

export const FormTextarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;
  color: var(--text-primary);
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #e41e3f;
    box-shadow: 0 0 0 2px rgba(228, 30, 63, 0.1);
  }
`;

export const FormSubmitButton = styled.button`
  background: #e41e3f;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: #c41834;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FormLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-primary);
`;

export const ErrorMessage = styled.span`
  color: #e41e3f;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

export const SuccessMessage = styled.div`
  background: #d4f5dd;
  color: #038a3a;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border-left: 4px solid #038a3a;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
`;

export const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
`;

export const EmptyStateDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FilterButton = styled.button<{ $isActive?: boolean }>`
  padding: 0.6rem 1.2rem;
  background: ${props => props.$isActive ? '#e41e3f' : '#f5f5f5'};
  color: ${props => props.$isActive ? 'white' : 'var(--text-primary)'};
  border: ${props => props.$isActive ? 'none' : '1px solid #ddd'};
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    ${props => props.$isActive 
      ? 'background: #c41834;' 
      : 'background: #eee; border-color: #bbb;'
    }
  }

  @media (max-width: 768px) {
    flex: 1;
  }
`;

export const SortDropdown = styled.select`
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: var(--text-primary);
  cursor: pointer;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: #e41e3f;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const JobCount = styled.span`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;
