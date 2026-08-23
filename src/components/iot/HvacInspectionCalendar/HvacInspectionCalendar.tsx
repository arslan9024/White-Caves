/**
 * HvacInspectionCalendar — Wave 52 GOAL-063
 * Commercial & residential HVAC and elevator servicing inspection schedule calendar
 * White Caves Real Estate LLC — Asset Management & IoT Facilities Suite
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

const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ScheduleCard = styled.div<{ $overdue?: boolean }>`
  padding: 14px;
  border-radius: 10px;
  background: ${p => p.$overdue ? 'rgba(239, 68, 68, 0.1)' : 'rgba(15, 23, 42, 0.7)'};
  border: 1px solid ${p => p.$overdue ? '#EF4444' : 'rgba(100, 116, 139, 0.2)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const STitle = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: #FFF;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SMeta = styled.div`
  font-size: 0.7rem;
  color: #94A3B8;
`;

const StatusPill = styled.span<{ $status: 'scheduled' | 'overdue' | 'completed' }>`
  font-size: 0.68rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 4px;
  background: ${p => p.$status === 'completed' ? 'rgba(16,185,129,0.2)' : p.$status === 'overdue' ? 'rgba(239,68,68,0.2)' : 'rgba(56,189,248,0.2)'};
  color: ${p => p.$status === 'completed' ? '#10B981' : p.$status === 'overdue' ? '#EF4444' : '#38BDF8'};
`;

export const HvacInspectionCalendar: FC = () => {
  const [schedules, setSchedules] = useState([
    { id: '1', asset: 'Central Chiller Plant A & B', property: 'White Caves Tower, Business Bay', date: '2026-08-18', vendor: 'Johnson Controls UAE', status: 'scheduled' as const, overdue: false },
    { id: '2', asset: 'High-Speed Passenger Elevators (Lifts 1-4)', property: 'Marina Heights Penthouse Block', date: '2026-08-12', vendor: 'Otis Elevator Company Dubai', status: 'overdue' as const, overdue: true },
    { id: '3', asset: 'Fire Alarm & Smoke Extraction System', property: 'Palm Jumeirah Villa Cluster', date: '2026-08-25', vendor: 'NAFFCO Civil Defense Certified', status: 'scheduled' as const, overdue: false },
    { id: '4', asset: 'Fresh Air Handling Units (FAHU)', property: 'Downtown Commercial Hub', date: '2026-08-05', vendor: 'Carrier Middle East', status: 'completed' as const, overdue: false },
  ]);

  const markComplete = (id: string) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, status: 'completed' as const, overdue: false } : s));
  };

  return (
    <Wrap data-testid="hvac-inspection-calendar">
      <Head>
        <Title>❄️ HVAC, Chiller & Elevator Statutory Servicing Schedule</Title>
        <Tag>FACILITIES COMPLIANCE</Tag>
      </Head>
      <Body>
        <div style={{ fontSize: '0.72rem', color: 'var(--color-94a3b8, #94A3B8)' }}>
          Statutory quarterly inspection tracker for HVAC systems, elevators, and life-safety plant certified under Dubai Civil Defense & Municipality guidelines.
        </div>

        <ScheduleList>
          {schedules.map(item => (
            <ScheduleCard key={item.id} $overdue={item.overdue}>
              <SInfo>
                <STitle>
                  <span>{item.asset}</span>
                  <StatusPill $status={item.status}>
                    {item.status === 'completed' ? '✓ COMPLETED' : item.status === 'overdue' ? '⚠️ OVERDUE (CIVIL DEFENSE SLA)' : '📅 SCHEDULED'}
                  </StatusPill>
                </STitle>
                <SMeta>📍 {item.property} | 📅 Due Date: <strong>{item.date}</strong></SMeta>
                <SMeta style={{ color: 'var(--text-secondary, #CBD5E1)' }}>👷 Certified Contractor: {item.vendor}</SMeta>
              </SInfo>
              <div>
                {item.status !== 'completed' && (
                  <button 
                    onClick={() => markComplete(item.id)}
                    style={{ padding: '6px 12px', background: 'var(--accent-green, #10B981)', color: 'var(--white, #FFF)', border: 'none', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    ✓ Log Service Report
                  </button>
                )}
              </div>
            </ScheduleCard>
          ))}
        </ScheduleList>
      </Body>
    </Wrap>
  );
};

export default HvacInspectionCalendar;
