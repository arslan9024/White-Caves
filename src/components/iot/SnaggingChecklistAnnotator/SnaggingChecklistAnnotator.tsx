/**
 * SnaggingChecklistAnnotator — Wave 52 GOAL-064
 * Move-in / Move-out handover snagging checklist with digital defect annotation
 * White Caves Real Estate LLC — Asset Management & Handover Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 2px solid rgba(239, 68, 68, 0.25);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(239, 68, 68, 0.05);
  border-bottom: 1px solid rgba(239, 68, 68, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  color: #FFF;
  font-size: 0.92rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Tag = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(239, 68, 68, 0.25);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SnagList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SnagItem = styled.div<{ $fixed: boolean }>`
  padding: 10px 14px;
  border-radius: 8px;
  background: ${p => p.$fixed ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239, 68, 68, 0.08)'};
  border: 1px solid ${p => p.$fixed ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.3)'};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SCheck = styled.input`
  accent-color: #10B981;
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const SText = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: #E2E8F0;
`;

const SLocation = styled.span`
  font-size: 0.68rem;
  color: #94A3B8;
  margin-left: 6px;
`;

const AddRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: 8px;
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.8rem;
  font-weight: 600;
  outline: none;
  &:focus { border-color: #EF4444; }
`;

const AddBtn = styled.button`
  padding: 8px 14px;
  border-radius: 7px;
  border: none;
  background: #EF4444;
  color: #FFF;
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  &:hover { filter: brightness(1.1); }
`;

export const SnaggingChecklistAnnotator: FC = () => {
  const [snags, setSnags] = useState([
    { id: '1', item: 'Master bathroom marble hairline crack', location: 'Master Bath', fixed: false },
    { id: '2', item: 'Balcony sliding door rubber seal misaligned', location: 'Living Room', fixed: true },
    { id: '3', item: 'Kitchen exhaust fan high vibration', location: 'Kitchen', fixed: false },
    { id: '4', item: 'Smart thermostat Wi-Fi pairing drop', location: 'Corridor', fixed: true },
  ]);

  const [newItem, setNewItem] = useState('');
  const [newLoc, setNewLoc] = useState('');

  const toggleFix = (id: string) => {
    setSnags(prev => prev.map(s => s.id === id ? { ...s, fixed: !s.fixed } : s));
  };

  const addSnag = () => {
    if (!newItem) return;
    setSnags(prev => [...prev, { id: String(Date.now()), item: newItem, location: newLoc || 'General', fixed: false }]);
    setNewItem('');
    setNewLoc('');
  };

  const pendingCount = snags.filter(s => !s.fixed).length;

  return (
    <Wrap data-testid="snagging-checklist-annotator">
      <Head>
        <Title>📋 Move-In / Handover Snagging Inspection Annotator</Title>
        <Tag>{pendingCount ? `${pendingCount} DEFECTS OPEN` : '100% SNAG FREE'}</Tag>
      </Head>
      <Body>
        <AddRow>
          <Input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Defect Description (e.g. Paint scratch)" />
          <Input value={newLoc} onChange={e => setNewLoc(e.target.value)} placeholder="Room / Zone" />
          <AddBtn onClick={addSnag}>+ Add Snag</AddBtn>
        </AddRow>

        <SnagList>
          {snags.map(snag => (
            <SnagItem key={snag.id} $fixed={snag.fixed}>
              <SInfo>
                <SCheck type="checkbox" checked={snag.fixed} onChange={() => toggleFix(snag.id)} />
                <SText style={{ textDecoration: snag.fixed ? 'line-through' : 'none' }}>
                  {snag.item}
                  <SLocation>({snag.location})</SLocation>
                </SText>
              </SInfo>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: snag.fixed ? '#10B981' : '#EF4444' }}>
                {snag.fixed ? '✓ REPAIRED' : 'DEFECT PENDING'}
              </span>
            </SnagItem>
          ))}
        </SnagList>
      </Body>
    </Wrap>
  );
};

export default SnaggingChecklistAnnotator;
