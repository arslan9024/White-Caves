import React from 'react';
import { WidgetContainer, PolicyTable, StatusBadge } from './InsurancePremiumWidget.style';
import { useInsurancePremiumLogic } from './InsurancePremiumWidget.logic';
import { ShieldCheck } from 'lucide-react';
export const InsurancePremiumWidget: React.FC = () => {
  const { t, isRtl } = useInsurancePremiumLogic();
  return (
    <WidgetContainer $isRtl={isRtl}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h3>{t.title}</h3><p>{t.subtitle}</p></div>
        <ShieldCheck size={32} color="var(--color-3b82f6, #3B82F6)" />
      </div>
      <PolicyTable>
        <thead><tr><th>{t.col_id}</th><th>{t.col_type}</th><th>{t.col_premium}</th><th>{t.col_renewal}</th><th>{t.col_status}</th></tr></thead>
        <tbody>{t.policies.map((p: any) => (<tr key={p.id}><td>{p.id}</td><td>{p.type}</td><td>AED {p.premium.toLocaleString()}</td><td>{p.renewal}</td><td><StatusBadge $status={p.status}>{p.status}</StatusBadge></td></tr>))}</tbody>
      </PolicyTable>
    </WidgetContainer>
  );
};
