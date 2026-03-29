import styled from 'styled-components';

export const StyledJobApplicants = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

export const StyledJobTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;

  [data-theme='dark'] & {
    color: #f7fafc;
  }
`;

export const StyledFilters = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const StyledFilterButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: 2px solid #e41e3f;
  background: white;
  color: #e41e3f;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;

  &.active {
    background: #e41e3f;
    color: white;
  }

  &:hover {
    background: #e41e3f;
    color: white;
  }

  [data-theme='dark'] & {
    background: #2d3748;
    border-color: #e41e3f;
    color: #e41e3f;

    &.active {
      background: #e41e3f;
      color: white;
    }

    &:hover {
      background: #e41e3f;
      color: white;
    }
  }
`;

export const StyledApplicationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

export const StyledApplicationCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  [data-theme='dark'] & {
    background: #2d3748;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
`;

export const StyledApplicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;

  [data-theme='dark'] & {
    border-bottom-color: #4a5568;
  }

  h3 {
    margin: 0;
    color: #333;

    [data-theme='dark'] & {
      color: #e2e8f0;
    }
  }
`;

export const StyledStatusBadge = styled.span<{ $backgroundColor?: string }>`
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
  background-color: ${props => props.$backgroundColor || '#FFA500'};
`;

export const StyledApplicationDetails = styled.div`
  margin-bottom: 1rem;

  p {
    margin: 0.5rem 0;
    color: #666;
    font-size: 0.95rem;

    [data-theme='dark'] & {
      color: #cbd5e0;
    }
  }

  strong {
    color: #333;

    [data-theme='dark'] & {
      color: #e2e8f0;
    }
  }
`;

export const StyledApplicationActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;

  button,
  a {
    flex: 1;
    padding: 0.6rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 600;
  }

  button {
    background: #2196f3;
    color: white;
    transition: all 0.2s ease;

    &:hover {
      background: #0d47a1;
    }
  }
`;

export const StyledDownloadResume = styled.a`
  background: #4caf50;
  color: white;
  display: inline-block;
  padding: 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #388e3c;
  }
`;

export const StyledQuickActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;

  button {
    flex: 1;
    padding: 0.6rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: white;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }
`;

export const StyledReviewBtn = styled.button`
  background: #2196f3 !important;

  &:hover {
    background: #0d47a1 !important;
  }
`;

export const StyledAcceptBtn = styled.button`
  background: #4caf50 !important;

  &:hover {
    background: #388e3c !important;
  }
`;

export const StyledRejectBtn = styled.button`
  background: #f44336 !important;

  &:hover {
    background: #c62828 !important;
  }
`;

export const StyledDetailModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-overlay, 600);

  [data-theme='dark'] & {
    background: rgba(0, 0, 0, 0.7);
  }
`;

export const StyledDetailModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

  [data-theme='dark'] & {
    background: #2d3748;
  }

  h3 {
    color: #333;

    [data-theme='dark'] & {
      color: #e2e8f0;
    }
  }

  p {
    color: #666;

    [data-theme='dark'] & {
      color: #cbd5e0;
    }
  }
`;

/* ── Loading / Error / Empty States ─────────────────────── */

export const StyledLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: #666;

  [data-theme='dark'] & {
    color: #a0aec0;
  }
`;

export const StyledSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #e41e3f;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  [data-theme='dark'] & {
    border-color: #4a5568;
    border-top-color: #e41e3f;
  }
`;

export const StyledErrorBanner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  background: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 8px;
  color: #c53030;
  text-align: center;

  [data-theme='dark'] & {
    background: rgba(245, 101, 101, 0.1);
    border-color: #c53030;
    color: #fc8181;
  }

  button {
    padding: 0.5rem 1.5rem;
    background: #e41e3f;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.2s;

    &:hover {
      background: #c5162f;
    }
  }
`;

export const StyledEmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 0.5rem;
  color: #a0aec0;
  text-align: center;

  span {
    font-size: 3rem;
  }

  p {
    margin: 0;
    font-size: 1rem;
  }

  [data-theme='dark'] & {
    color: #718096;
  }
`;
