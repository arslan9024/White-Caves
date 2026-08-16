import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(239,68,68,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(239,68,68,0.05); border-bottom: 1px solid rgba(239,68,68,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;
const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 14px;`;
const Grid2 = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 12px;`;
const Field = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const Label = styled.label`font-size: 0.72rem; color: #94A3B8; font-weight: 600;`;
const Input = styled.input`padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(100,116,139,0.3); background: rgba(15,23,42,0.8); color: #E2E8F0; font-size: 0.82rem; font-weight: 600; width: 100%; box-sizing: border-box; outline: none; &:focus { border-color: #EF4444; }`;

const InvoicePreview = styled.div`
  padding: 20px;
  border-radius: 14px;
  background: rgba(15,23,42,0.9);
  border: 2px solid rgba(239,68,68,0.2);
`;
const InvoiceHeader = styled.div`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;`;
const LogoBlock = styled.div``;
const LogoTitle = styled.div`font-size: 1rem; font-weight: 900; color: #EF4444;`;
const LogoSub = styled.div`font-size: 0.65rem; color: #64748B;`;
const TrnBadge = styled.div`padding: 4px 12px; border-radius: 6px; border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.08); color: #EF4444; font-size: 0.7rem; font-weight: 800;`;
const Divider = styled.div`height: 1px; background: rgba(100,116,139,0.2); margin: 12px 0;`;
const InvoiceLine = styled.div`display: flex; justify-content: space-between; margin-bottom: 6px;`;
const LineLabel = styled.div`font-size: 0.75rem; color: #64748B;`;
const LineValue = styled.div`font-size: 0.75rem; font-weight: 700; color: #CBD5E1;`;
const TotalRow = styled.div`display: flex; justify-content: space-between; padding: 10px; border-radius: 8px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); margin-top: 8px;`;
const TotalLabel = styled.div`font-size: 0.8rem; font-weight: 700; color: #94A3B8;`;
const TotalValue = styled.div`font-size: 0.95rem; font-weight: 900; color: #EF4444;`;

const GenerateBtn = styled.button`width: 100%; padding: 12px; border-radius: 10px; border: none; background: linear-gradient(90deg, #EF4444, #F97316); color: #FFF; font-size: 0.85rem; font-weight: 800; cursor: pointer; transition: all 0.2s ease; &:hover { filter: brightness(1.1); transform: translateY(-1px); }`;

export const VatInvoiceGenerator: FC = () => {
  const [clientName, setClientName] = useState('Mohammed Al Rashid');
  const [serviceDesc, setServiceDesc] = useState('Real Estate Agent Commission — 2%');
  const [amount, setAmount] = useState('44000');
  
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<{
    net: number;
    vatAmount: number;
    grossAmount: number;
    trn: string;
    invoiceNumber: string;
    date: string;
  } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const query = `
        query GenerateVatInvoice($amount: Float!) {
          generateVatInvoice(amount: $amount, isExempt: false) {
            net
            vatAmount
            grossAmount
            trn
            invoiceNumber
            date
          }
        }
      `;
      const { apiClient } = await import('../../../services/apiClient');
      const res = await apiClient.post<{ data?: any }>('/graphql', {
        query,
        variables: { amount: parseFloat(amount) || 0 }
      });
      if (res?.data?.generateVatInvoice) {
        setInvoiceData(res.data.generateVatInvoice);
      }
    } catch (err) {
      console.error('Failed to generate VAT invoice', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper data-testid="vat-invoice-generator">
      <Header>
        <Title>🧾 UAE VAT Invoice Generator</Title>
        <TrnBadge>TRN: {invoiceData ? invoiceData.trn : '100432571200003'}</TrnBadge>
      </Header>
      <Body>
        <Grid2>
          <Field><Label>Client Name</Label><Input value={clientName} onChange={e => setClientName(e.target.value)} /></Field>
          <Field><Label>Net Amount (AED)</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} /></Field>
        </Grid2>
        <Field><Label>Service Description</Label><Input value={serviceDesc} onChange={e => setServiceDesc(e.target.value)} /></Field>
        <GenerateBtn onClick={handleGenerate} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? '⏳ Generating...' : '📄 Generate FTA-Compliant Invoice'}
        </GenerateBtn>

        {invoiceData && (
          <InvoicePreview style={{ opacity: loading ? 0.5 : 1 }}>
            <InvoiceHeader>
              <LogoBlock>
                <LogoTitle>🏛️ WHITE CAVES REAL ESTATE LLC</LogoTitle>
                <LogoSub>License: 801362 | RERA: 12548 | Dubai, UAE</LogoSub>
              </LogoBlock>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.68rem', color: '#64748B' }}>TAX INVOICE</div>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700 }}>{invoiceData.invoiceNumber}</div>
                <div style={{ fontSize: '0.65rem', color: '#475569' }}>{new Date(invoiceData.date).toLocaleDateString('en-AE')}</div>
              </div>
            </InvoiceHeader>
            <Divider />
            <InvoiceLine><LineLabel>Client:</LineLabel><LineValue>{clientName}</LineValue></InvoiceLine>
            <InvoiceLine><LineLabel>Service:</LineLabel><LineValue>{serviceDesc}</LineValue></InvoiceLine>
            <Divider />
            <InvoiceLine><LineLabel>Net Amount:</LineLabel><LineValue>AED {invoiceData.net.toLocaleString()}</LineValue></InvoiceLine>
            <InvoiceLine><LineLabel>VAT (5% FTA):</LineLabel><LineValue style={{ color: '#F59E0B' }}>AED {invoiceData.vatAmount.toLocaleString()}</LineValue></InvoiceLine>
            <TotalRow>
              <TotalLabel>TOTAL DUE (AED)</TotalLabel>
              <TotalValue>AED {invoiceData.grossAmount.toLocaleString()}</TotalValue>
            </TotalRow>
          </InvoicePreview>
        )}
      </Body>
    </Wrapper>
  );
};
export default VatInvoiceGenerator;
