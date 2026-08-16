/**
 * GlobalSearchModal — Wave 61 FE-GOAL-058
 * Global Spotlight Search Modal triggered via Cmd+K / Ctrl+K shortcut or search trigger button
 * White Caves Real Estate LLC — Navigation & Search Suite
 */
import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;}to{opacity:1;}`;
const slideDown = keyframes`from{opacity:0;transform:translate(-50%, -45%)}to{opacity:1;transform:translate(-50%, -50%)}`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(7, 11, 20, 0.85);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease;
`;

const Dialog = styled.div`
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  background: #0F172A;
  border: 2px solid rgba(239, 68, 68, 0.4);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(239, 68, 68, 0.2);
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${slideDown} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`;

const SearchInputRow = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(100, 116, 139, 0.2);
  gap: 12px;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #FFF;
  font-size: 1.05rem;
  font-weight: 600;
  outline: none;
  &::placeholder { color: #64748B; }
`;

const KbdTag = styled.kbd`
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(100, 116, 139, 0.2);
  color: #94A3B8;
  font-size: 0.72rem;
  font-weight: 700;
`;

const ResultList = styled.div`
  max-height: 320px;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ResultItem = styled.div<{ $selected: boolean }>`
  padding: 10px 14px;
  border-radius: 8px;
  background: ${p => p.$selected ? 'rgba(239, 68, 68, 0.15)' : 'transparent'};
  border: 1px solid ${p => p.$selected ? 'rgba(239, 68, 68, 0.35)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover { background: rgba(239, 68, 68, 0.12); }
`;

const ItemTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #FFF;
`;

const ItemSubtitle = styled.div`
  font-size: 0.7rem;
  color: #94A3B8;
`;

const Tag = styled.span`
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(100, 116, 139, 0.2);
  color: #CBD5E1;
`;

export const GlobalSearchModal: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const items = [
    { title: 'Villa 14B Palm Jumeirah', subtitle: '5BR Beachfront Villa · AED 65,000,000', category: 'Listing' },
    { title: 'Dr. Tariq Al Qasimi', subtitle: 'UHNW Cash Buyer (Hot) · Lead #8401', category: 'CRM Lead' },
    { title: 'Form B Brokerage Agreement', subtitle: 'RERA Statutory Contract Generator', category: 'Compliance' },
    { title: 'Downtown Sky Penthouse', subtitle: '4BR Duplex · AED 34,500,000', category: 'Listing' },
    { title: 'EJARI Contract Renewal Vault', subtitle: 'Tenancy Deposit & Cheque Ledger', category: 'Finance' },
  ];

  const filtered = items.filter(i => 
    i.title.toLowerCase().includes(query.toLowerCase()) || 
    i.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '8px',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(100, 116, 139, 0.25)',
          color: '#94A3B8',
          fontSize: '0.78rem',
          cursor: 'pointer',
        }}
        data-testid="global-search-trigger"
      >
        <span>🔍 Search listings, leads & docs...</span>
        <KbdTag>Ctrl+K</KbdTag>
      </button>

      {isOpen && (
        <Backdrop onClick={() => setIsOpen(false)} data-testid="global-search-modal">
          <Dialog onClick={e => e.stopPropagation()}>
            <SearchInputRow>
              <span style={{ fontSize: '1.1rem' }}>🔍</span>
              <Input
                autoFocus
                placeholder="Search across properties, clients, RERA contracts, or tools..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <KbdTag onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }}>ESC</KbdTag>
            </SearchInputRow>

            <ResultList>
              {filtered.map((item, idx) => (
                <ResultItem key={idx} $selected={idx === 0} onClick={() => setIsOpen(false)}>
                  <div>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemSubtitle>{item.subtitle}</ItemSubtitle>
                  </div>
                  <Tag>{item.category}</Tag>
                </ResultItem>
              ))}
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px', color: '#64748B', fontSize: '0.8rem' }}>
                  No matching assets or contacts found.
                </div>
              )}
            </ResultList>
          </Dialog>
        </Backdrop>
      )}
    </>
  );
};

export default GlobalSearchModal;
