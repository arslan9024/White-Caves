import React from 'react';
import { WidgetContainer, CryptoTable, CoinBadge } from './CryptoPaymentWidget.style';
import { useCryptoPaymentLogic } from './CryptoPaymentWidget.logic';
import { Bitcoin } from 'lucide-react';
export const CryptoPaymentWidget: React.FC = () => {
  const { t, isRtl } = useCryptoPaymentLogic();
  return (
    <WidgetContainer $isRtl={isRtl}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h3>{t.title}</h3><p>{t.subtitle}</p></div>
        <Bitcoin size={32} color="var(--accent-gold, #D4AF37)" />
      </div>
      <CryptoTable>
        <thead><tr><th>{t.col_id}</th><th>{t.col_coin}</th><th>{t.col_amount}</th><th>{t.col_aed}</th><th>{t.col_date}</th><th>{t.col_status}</th></tr></thead>
        <tbody>{t.receipts.map((r: any) => (<tr key={r.id}><td>{r.id}</td><td><CoinBadge $coin={r.coin}>{r.coin}</CoinBadge></td><td>{r.amount}</td><td>AED {r.aed.toLocaleString()}</td><td>{r.date}</td><td>{r.status}</td></tr>))}</tbody>
      </CryptoTable>
    </WidgetContainer>
  );
};
