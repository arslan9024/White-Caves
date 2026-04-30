import React from 'react';
import { RentalInquiry, LEASING_STAGE_LABELS, LeasingStage } from '../data/leasing';

interface PipelineTabProps {
  inquiries: RentalInquiry[];
}

const STAGE_COLORS: Record<number, { bg: string; border: string; badge: string; text: string }> = {
  1:  { bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.25)',  badge: '#3B82F6', text: '#60A5FA' },
  2:  { bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.25)',  badge: '#3B82F6', text: '#60A5FA' },
  3:  { bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.25)',  badge: '#3B82F6', text: '#60A5FA' },
  4:  { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)',  badge: '#F59E0B', text: '#FCD34D' },
  5:  { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)',  badge: '#F59E0B', text: '#FCD34D' },
  6:  { bg: 'rgba(20,184,166,0.08)',  border: 'rgba(20,184,166,0.25)',  badge: '#14B8A6', text: '#5EEAD4' },
  7:  { bg: 'rgba(20,184,166,0.08)',  border: 'rgba(20,184,166,0.25)',  badge: '#14B8A6', text: '#5EEAD4' },
  8:  { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)',  badge: '#10B981', text: '#34D399' },
  9:  { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)',  badge: '#10B981', text: '#34D399' },
  10: { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)',  badge: '#10B981', text: '#34D399' },
};

const SOURCE_EMOJIS: Record<string, string> = {
  'Property Finder': '🔍',
  'Agent Referral': '🤝',
  'Dubizzle': '📋',
  'WhatsApp Inquiry': '💬',
  'Website': '🌐',
};

const PipelineTab: React.FC<PipelineTabProps> = ({ inquiries }) => {
  const byStage: Record<number, RentalInquiry[]> = {};
  for (let s = 1; s <= 10; s++) byStage[s] = [];
  inquiries.forEach(inq => {
    if (byStage[inq.leasingStage]) {
      byStage[inq.leasingStage].push(inq);
    }
  });

  const totalPipelineValue = inquiries.reduce((sum, inq) => {
    const match = inq.budget.match(/[\d,]+/);
    if (!match) return sum;
    return sum + parseInt(match[0].replace(/,/g, ''), 10);
  }, 0);

  const getStageValue = (stageInquiries: RentalInquiry[]) =>
    stageInquiries.reduce((sum, inq) => {
      const match = inq.budget.match(/[\d,]+/);
      if (!match) return sum;
      return sum + parseInt(match[0].replace(/,/g, ''), 10);
    }, 0);

  return (
    <div className="pipeline-view">
      <div className="view-header" style={{ marginBottom: '20px' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Leasing Pipeline</h3>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {inquiries.length} prospects · AED {(totalPipelineValue / 1000).toFixed(0)}K+ total pipeline value
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px', alignItems: 'flex-start' }}>
        {(Object.keys(byStage) as unknown as number[]).map(stage => {
          const stageNum = Number(stage);
          const col = STAGE_COLORS[stageNum];
          const label = LEASING_STAGE_LABELS[stageNum as LeasingStage];
          const cards = byStage[stageNum];
          const stageVal = getStageValue(cards);

          return (
            <div
              key={stageNum}
              style={{
                minWidth: '200px',
                maxWidth: '220px',
                background: col.bg,
                border: `1px solid ${col.border}`,
                borderRadius: '12px',
                padding: '14px',
                flexShrink: 0,
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: col.badge, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 700,
                  }}>
                    {stageNum}
                  </span>
                  <span style={{ fontSize: '11px', color: col.text, fontWeight: 600 }}>
                    {cards.length} {cards.length === 1 ? 'lead' : 'leads'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
                  {label}
                </div>
                {stageVal > 0 && (
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    AED {stageVal.toLocaleString()}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cards.map(inq => (
                  <div key={inq.id} style={{
                    background: 'var(--rgba-white-05)',
                    border: '1px solid var(--rgba-white-10)',
                    borderRadius: '8px',
                    padding: '10px',
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                      {inq.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      <div>🏠 {inq.property}</div>
                      <div>💰 AED {inq.budget}</div>
                      <div>
                        {SOURCE_EMOJIS[inq.source] ?? '📌'} {inq.source}
                      </div>
                      <div style={{ marginTop: '4px', color: col.text, fontSize: '10px' }}>
                        📅 {inq.moveInDate}
                      </div>
                    </div>
                  </div>
                ))}
                {cards.length === 0 && (
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textAlign: 'center', padding: '12px 0', opacity: 0.5 }}>
                    Empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineTab;
