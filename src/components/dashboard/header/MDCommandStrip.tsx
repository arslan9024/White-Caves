/**
 * MDCommandStrip — Level-5 executive strip shown only for Managing Director.
 */
import React, { FC, memo } from 'react';
import styled from 'styled-components';

export interface MDCommandStripProps {
  mdName?: string;
  mdEmail?: string;
  onOpenModule?: (moduleId: string) => void;
}

const Strip = styled.section`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  padding: 0.65rem 1rem;
  background: linear-gradient(90deg, #0f172a 0%, #1e293b 55%, #0f172a 100%);
  border-bottom: 2px solid #ef4444;
  color: #f8fafc;
`;

const Identity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 12rem;

  strong {
    font-size: 0.9rem;
    font-weight: 800;
    letter-spacing: 0.02em;
  }

  span {
    font-size: 0.72rem;
    color: #94a3b8;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const Chip = styled.button`
  appearance: none;
  border: 1px solid rgba(239, 68, 68, 0.45);
  background: rgba(239, 68, 68, 0.12);
  color: #fff;
  border-radius: 9999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.28);
    border-color: #ef4444;
  }

  &:focus-visible {
    outline: 2px solid #ef4444;
    outline-offset: 2px;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  background: #ef4444;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const MDCommandStrip: FC<MDCommandStripProps> = ({
  mdName = 'Managing Director',
  mdEmail,
  onOpenModule,
}) => {
  const launch = (id: string) => () => onOpenModule?.(id);

  return (
    <Strip data-testid="md-command-strip" aria-label="Managing Director command strip">
      <Identity>
        <strong>
          👑 {mdName} <Badge>L5 MD</Badge>
        </strong>
        <span>{mdEmail || 'Sovereign session'} · Executive Directorate</span>
      </Identity>
      <Actions>
        <Chip type="button" onClick={launch('dept_summary')}>
          Command overview
        </Chip>
        <Chip type="button" onClick={launch('theodora')}>
          Treasury
        </Chip>
        <Chip type="button" onClick={launch('compliance')}>
          Compliance
        </Chip>
        <Chip type="button" onClick={launch('zoe-sovereign-override')}>
          Override desk
        </Chip>
        <Chip type="button" onClick={launch('ai-command')}>
          1–12–108 AI
        </Chip>
      </Actions>
    </Strip>
  );
};

export default memo(MDCommandStrip);
