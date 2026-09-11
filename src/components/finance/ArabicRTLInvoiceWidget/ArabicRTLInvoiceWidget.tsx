import React from 'react';
import { WidgetContainer, InvoiceBox, InvoiceTable, TotalRow } from './ArabicRTLInvoiceWidget.style';
import { useArabicRTLInvoiceLogic } from './ArabicRTLInvoiceWidget.logic';
import { FileText } from 'lucide-react';
export const ArabicRTLInvoiceWidget: React.FC = () => {
  const { t, isRtl, subtotal, vat, grandTotal } = useArabicRTLInvoiceLogic();
  return (
    <WidgetContainer $isRtl={isRtl}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h3>{t.title}</h3><p>{t.subtitle}</p></div>
        <FileText size={32} color="var(--color-1e293b, #1E293B)" />
      </div>
      <InvoiceBox>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div><strong>{t.sample_invoice}</strong></div>
          <div>{t.client}</div>
        </div>
        <InvoiceTable>
          <thead><tr><th>Description</th><th>Qty</th><th style={{ textAlign: 'right' }}>Amount (AED)</th></tr></thead>
          <tbody>{t.items.map((item: any, i: number) => (<tr key={i}><td>{item.desc}</td><td>{item.qty}</td><td className="amount">AED {(item.qty * item.price).toLocaleString()}</td></tr>))}</tbody>
        </InvoiceTable>
        <div style={{ marginTop: '16px' }}>
          <TotalRow><span>{t.total}</span><span>AED {subtotal.toLocaleString()}</span></TotalRow>
          <TotalRow><span>{t.vat}</span><span>AED {vat.toLocaleString()}</span></TotalRow>
          <TotalRow className="grand"><span>{t.grand_total}</span><span>AED {grandTotal.toLocaleString()}</span></TotalRow>
        </div>
      </InvoiceBox>
    </WidgetContainer>
  );
};
