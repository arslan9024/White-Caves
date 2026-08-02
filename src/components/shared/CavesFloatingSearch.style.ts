import styled, { keyframes } from 'styled-components';

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
`;

export const FloatingPillWrapper = styled.div`
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 2000;
  display: flex;
  align-items: center;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  transform: translate3d(0, 0, 0);
  will-change: transform;
`;

export const FloatingPillButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: #ffffff;
  color: #1e293b;
  border: 1px solid #ef4444;
  border-radius: 9999px;
  box-shadow: 0 8px 30px rgba(239, 68, 68, 0.15), 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 36px rgba(239, 68, 68, 0.25), 0 4px 12px rgba(0, 0, 0, 0.1);
    background: #fff5f5;
  }

  &:focus-visible {
    outline: none;
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3), 0 8px 30px rgba(239, 68, 68, 0.15);
  }

  .pill-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #ef4444;
    color: #ffffff;
    animation: ${pulseGlow} 2.5s infinite;
  }

  .pill-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .pill-title {
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.2;
  }

  .pill-subtitle {
    font-size: 11px;
    color: #64748b;
    line-height: 1.2;
  }
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(8px);
  z-index: 2001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalCard = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 900px;
  max-height: 85vh;
  border-radius: 20px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(239, 68, 68, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideUp {
    from { opacity: 0; transform: scale(0.96) translateY(12px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: #1e293b;
  color: #ffffff;
  border-bottom: 2px solid #ef4444;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.01em;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .badge {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border: 1px solid #ef4444;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 9999px;
  }

  .close-btn {
    background: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    transition: all 0.15s ease;

    &:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

export const SearchBarSection = styled.div`
  padding: 20px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .search-icon {
    position: absolute;
    left: 16px;
    color: #ef4444;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 14px 16px 14px 48px;
    font-size: 15px;
    border-radius: 12px;
    border: 1px solid #cbd5e1;
    background: #ffffff;
    color: #1e293b;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
    }

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

export const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
`;

export const SelectControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    font-size: 11px;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  select {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    background: #ffffff;
    color: #1e293b;
    font-size: 13px;
    outline: none;

    &:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
    }
  }
`;

export const ResultsSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
`;

export const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
`;

export const PropertyCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: #ef4444;
    box-shadow: 0 10px 25px rgba(239, 68, 68, 0.12);
    transform: translateY(-2px);
  }

  .img-container {
    position: relative;
    height: 140px;
    background: #f1f5f9;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .status-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #ffffff;

      &.Available { background: #10b981; }
      &.Leased { background: #3b82f6; }
      &.UnderMaintenance { background: #f59e0b; }
      &.Sold { background: #64748b; }
      &.Pending { background: #8b5cf6; }
    }
  }

  .card-body {
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;

    .price {
      font-size: 16px;
      font-weight: 800;
      color: #ef4444;
    }

    .title {
      font-size: 13px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
      line-height: 1.3;
    }

    .meta {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }

    .community {
      font-size: 11px;
      color: #94a3b8;
      font-weight: 600;
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #64748b;

  .icon {
    font-size: 32px;
    margin-bottom: 8px;
  }

  h4 {
    margin: 0 0 4px 0;
    color: #1e293b;
    font-size: 16px;
  }
`;
