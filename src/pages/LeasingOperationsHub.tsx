import React, { useState } from 'react';
import styled from 'styled-components';
import LindaWhatsAppCRM from '../components/crm/LindaWhatsAppCRM';
import { HenryTenancyContractModal } from '../components/crm/HenryDocumentStudio/HenryTenancyContractModal';
import henryTenancyContractTemplateService, {
  DldTenancyContractData,
} from '../services/HenryTenancyContractTemplateService';
import { generatePdcSchedule } from '../utils/generatePdcSchedule';

// ── Types ───────────────────────────────────────────────────────────────────
export type LeasingStage =
  | 'LANDLORD_OUTREACH'
  | 'INTAKE_DOCS'
  | 'MARKETING_LISTINGS'
  | 'LEADS_VIEWINGS'
  | 'OFFER_NEGOTIATION'
  | 'CONTRACT_MAKER'
  | 'SIGNATURES'
  | 'CHEQUES_INVOICE'
  | 'EJARI_REGISTRATION'
  | 'KEY_HANDOVER';

export interface SoloLeasingDeal {
  id: string;
  propertyTitle: string;
  unitNumber: string;
  landlordName: string;
  landlordPhone: string;
  tenantName?: string;
  tenantPhone?: string;
  annualRent: number;
  chequeCount: 1 | 2 | 4 | 6 | 12;
  securityDeposit: number;
  stage: LeasingStage;
  signatureStatus: 'PENDING' | 'TENANT_SIGNED' | 'LANDLORD_SIGNED' | 'FULLY_SIGNED';
  uaePassVerified: boolean;
  ejariNumber?: string;
  dewaPremiseNumber?: string;
  commissionAed: number;
  vatAed: number;
  totalInvoiceAed: number;
}

// ── Initial Mock State for Solo-Operator ────────────────────────────────────
const INITIAL_DEALS: SoloLeasingDeal[] = [
  {
    id: 'DEAL-WC-101',
    propertyTitle: 'Damac Hills 2 - Camelia Villa',
    unitNumber: 'V-402',
    landlordName: 'Humaid Al Falasi',
    landlordPhone: '+971501234567',
    tenantName: 'Sophie Bernard',
    tenantPhone: '+971529876543',
    annualRent: 95000,
    chequeCount: 4,
    securityDeposit: 4750,
    stage: 'SIGNATURES',
    signatureStatus: 'TENANT_SIGNED',
    uaePassVerified: true,
    dewaPremiseNumber: '20938472',
    commissionAed: 4750,
    vatAed: 237.5,
    totalInvoiceAed: 4987.5,
  },
  {
    id: 'DEAL-WC-102',
    propertyTitle: 'Business Bay - Executive Heights',
    unitNumber: 'Apt 1408',
    landlordName: 'Tariq Mansoor',
    landlordPhone: '+971556781234',
    annualRent: 75000,
    chequeCount: 2,
    securityDeposit: 3750,
    stage: 'LANDLORD_OUTREACH',
    signatureStatus: 'PENDING',
    uaePassVerified: false,
    commissionAed: 3750,
    vatAed: 187.5,
    totalInvoiceAed: 3937.5,
  },
];

// ── Styles ──────────────────────────────────────────────────────────────────
const HubContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: #0f172a;
  min-height: 100vh;
  color: #f8fafc;
  font-family: inherit;
`;

const TopHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #1e293b;
  margin-bottom: 24px;
`;

const TitleBlock = styled.div`
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
  }
  p {
    font-size: 0.875rem;
    color: #94a3b8;
    margin: 4px 0 0;
  }
`;

const Badge = styled.span<{ $bg?: string }>`
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${({ $bg }) => $bg || '#ef4444'};
  color: #fff;
  font-weight: 600;
`;

const TabNavigation = styled.nav`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #1e293b;
  padding-bottom: 12px;
  overflow-x: auto;
`;

const TabButton = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? '#ef4444' : '#1e293b')};
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ $active }) => ($active ? '#dc2626' : '#334155')};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: #1e293b;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #334155;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DealTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #f1f5f9;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #94a3b8;
`;

const ActionBtn = styled.button<{ $primary?: boolean }>`
  background: ${({ $primary }) => ($primary ? '#ef4444' : '#334155')};
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ $primary }) => ($primary ? '#dc2626' : '#475569')};
  }
`;

const StatusPill = styled.span<{ $status: string }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $status }) =>
    $status === 'FULLY_SIGNED' || $status === 'TENANT_SIGNED' ? '#059669' : '#d97706'};
  color: #fff;
`;

// ── Component ───────────────────────────────────────────────────────────────
export const LeasingOperationsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'pipeline' | 'linda' | 'contract_maker' | 'signature_portal' | 'invoicing'
  >('pipeline');
  const [deals, setDeals] = useState<SoloLeasingDeal[]>(INITIAL_DEALS);
  const [selectedDeal, setSelectedDeal] = useState<SoloLeasingDeal | null>(deals[0]);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Trigger Notification to Zoe and top bar
  const triggerZoeNotification = (title: string, message: string) => {
    setNotificationMsg(`${title}: ${message}`);
    setTimeout(() => setNotificationMsg(null), 5000);
  };

  const handleOpenContractModal = (deal: SoloLeasingDeal) => {
    setSelectedDeal(deal);
    const draft: DldTenancyContractData = {
      ...henryTenancyContractTemplateService.getBlankTemplate(),
      propertyUsage: 'residential',
      propertyType: 'villa',
      location: deal.propertyTitle,
      propertyNo: deal.unitNumber,
      lessorName: deal.landlordName,
      lessorPhone: deal.landlordPhone,
      tenantName: deal.tenantName || '',
      tenantPhone: deal.tenantPhone || '',
      annualRent: deal.annualRent,
      contractPeriodFrom: '2026-12-01',
      contractPeriodTo: '2027-11-30',
      securityDepositAmount: deal.securityDeposit,
      modeOfPayment: `${deal.chequeCount} Cheques`,
    };
    henryTenancyContractTemplateService.saveDraft(draft);
    setIsContractModalOpen(true);
  };

  const handleSignContract = (dealId: string, role: 'TENANT' | 'LANDLORD') => {
    setDeals(prev =>
      prev.map(d => {
        if (d.id !== dealId) return d;
        const nextStatus =
          role === 'TENANT'
            ? d.signatureStatus === 'LANDLORD_SIGNED'
              ? 'FULLY_SIGNED'
              : 'TENANT_SIGNED'
            : d.signatureStatus === 'TENANT_SIGNED'
              ? 'FULLY_SIGNED'
              : 'LANDLORD_SIGNED';
        return { ...d, signatureStatus: nextStatus };
      })
    );
    triggerZoeNotification('Signature Recorded', `${role} signed agreement for ${dealId}.`);
  };

  return (
    <HubContainer data-testid="leasing-operations-hub">
      <TopHeader>
        <TitleBlock>
          <h1>
            Solo-Operator Leasing Command Center
            <Badge>Phase 1 Active</Badge>
          </h1>
          <p>
            White Caves Real Estate • Managing Director & Solo Leasing Agent Operations Desk •
            Orchestrated by Zoe & Nadia
          </p>
        </TitleBlock>
      </TopHeader>

      {notificationMsg && (
        <div
          style={{
            background: '#065f46',
            color: '#a7f3d0',
            padding: '10px 16px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '0.85rem',
            border: '1px solid #059669',
          }}
        >
          🔔 <strong>Zoe Notification:</strong> {notificationMsg}
        </div>
      )}

      <TabNavigation>
        <TabButton $active={activeTab === 'pipeline'} onClick={() => setActiveTab('pipeline')}>
          📋 Active Deals Pipeline ({deals.length})
        </TabButton>
        <TabButton $active={activeTab === 'linda'} onClick={() => setActiveTab('linda')}>
          💬 Linda WhatsApp Landlord Broadcast
        </TabButton>
        <TabButton
          $active={activeTab === 'contract_maker'}
          onClick={() => setActiveTab('contract_maker')}
        >
          📄 DLD Tenancy Contract Maker
        </TabButton>
        <TabButton
          $active={activeTab === 'signature_portal'}
          onClick={() => setActiveTab('signature_portal')}
        >
          ✍️ UAE Pass & E-Signature
        </TabButton>
        <TabButton $active={activeTab === 'invoicing'} onClick={() => setActiveTab('invoicing')}>
          💰 5% VAT Tax Invoices & PDCs
        </TabButton>
      </TabNavigation>

      {/* Tab 1: Pipeline */}
      {activeTab === 'pipeline' && (
        <Grid>
          {deals.map(deal => (
            <Card key={deal.id}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Badge $bg="#334155">{deal.id}</Badge>
                <StatusPill $status={deal.signatureStatus}>{deal.signatureStatus}</StatusPill>
              </div>
              <DealTitle>{deal.propertyTitle}</DealTitle>
              <MetaRow>
                <span>Unit:</span>
                <strong>{deal.unitNumber}</strong>
              </MetaRow>
              <MetaRow>
                <span>Landlord:</span>
                <span>
                  {deal.landlordName} ({deal.landlordPhone})
                </span>
              </MetaRow>
              <MetaRow>
                <span>Tenant:</span>
                <span>{deal.tenantName || 'Pending Booking'}</span>
              </MetaRow>
              <MetaRow>
                <span>Annual Rent:</span>
                <strong>AED {deal.annualRent.toLocaleString()}</strong>
              </MetaRow>
              <MetaRow>
                <span>Cheques:</span>
                <span>{deal.chequeCount} PDCs</span>
              </MetaRow>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <ActionBtn $primary onClick={() => handleOpenContractModal(deal)}>
                  📄 Open Contract
                </ActionBtn>
                <ActionBtn onClick={() => setActiveTab('signature_portal')}>✍️ E-Sign</ActionBtn>
                <ActionBtn onClick={() => setActiveTab('invoicing')}>💰 Invoice</ActionBtn>
              </div>
            </Card>
          ))}
        </Grid>
      )}

      {/* Tab 2: Linda WhatsApp */}
      {activeTab === 'linda' && (
        <div>
          <LindaWhatsAppCRM />
        </div>
      )}

      {/* Tab 3: Contract Maker */}
      {activeTab === 'contract_maker' && (
        <Card>
          <h3>Unified DLD Standard Tenancy Contract Generator</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Powered by Henry Document Studio & RERA Unified Tenancy Template.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {deals.map(deal => (
              <ActionBtn key={deal.id} $primary onClick={() => handleOpenContractModal(deal)}>
                Generate Contract for {deal.unitNumber}
              </ActionBtn>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 4: Signature Portal & UAE Pass */}
      {activeTab === 'signature_portal' && (
        <Card>
          <h3>Digital Signature & UAE Pass Verification Desk</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Verify identity via UAE Pass and capture digital sign on mobile/desktop.
          </p>
          {deals.map(deal => (
            <div
              key={deal.id}
              style={{
                border: '1px solid #334155',
                padding: '16px',
                borderRadius: '6px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
              >
                <strong>
                  {deal.propertyTitle} — {deal.unitNumber}
                </strong>
                <StatusPill $status={deal.signatureStatus}>{deal.signatureStatus}</StatusPill>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                UAE Pass Authentication:{' '}
                {deal.uaePassVerified ? (
                  <span style={{ color: '#10b981' }}>✅ Authenticated</span>
                ) : (
                  <span style={{ color: '#f59e0b' }}>⚠️ Pending Approval</span>
                )}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <ActionBtn $primary onClick={() => handleSignContract(deal.id, 'TENANT')}>
                  ✍️ Tenant Sign
                </ActionBtn>
                <ActionBtn onClick={() => handleSignContract(deal.id, 'LANDLORD')}>
                  ✍️ Landlord Sign
                </ActionBtn>
                <ActionBtn
                  onClick={() =>
                    triggerZoeNotification(
                      'WhatsApp Link Sent',
                      `Signing link dispatched to ${deal.tenantPhone}`
                    )
                  }
                >
                  📱 WhatsApp Link
                </ActionBtn>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Tab 5: Invoicing & Cheques */}
      {activeTab === 'invoicing' && (
        <Card>
          <h3>Commission Tax Invoicing & Post-Dated Cheques (Law 50/2022)</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Automated UAE 5% FTA VAT invoice generation + Post-Dated Cheque schedules.
          </p>
          {deals.map(deal => {
            const pdcSchedule = generatePdcSchedule(
              deal.annualRent,
              deal.chequeCount,
              '2026-12-01',
              deal.landlordName
            );
            return (
              <div
                key={deal.id}
                style={{
                  border: '1px solid #334155',
                  padding: '16px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
                >
                  <strong>
                    {deal.propertyTitle} — Unit {deal.unitNumber}
                  </strong>
                  <Badge $bg="#059669">
                    Total Invoiced: AED {deal.totalInvoiceAed.toLocaleString()}
                  </Badge>
                </div>
                <MetaRow>
                  <span>Commission (5% Base):</span>
                  <span>AED {deal.commissionAed.toLocaleString()}</span>
                </MetaRow>
                <MetaRow>
                  <span>UAE FTA VAT (5% on Commission):</span>
                  <span>AED {deal.vatAed.toFixed(2)}</span>
                </MetaRow>

                <h4 style={{ margin: '12px 0 6px', fontSize: '0.85rem', color: '#f8fafc' }}>
                  PDC Schedule ({deal.chequeCount} Cheques):
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {pdcSchedule.map((cheque, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        background: '#0f172a',
                        padding: '6px 10px',
                        borderRadius: '4px',
                      }}
                    >
                      <span>
                        Cheque #{idx + 1} ({cheque.dueDate})
                      </span>
                      <strong>AED {cheque.amountAED.toLocaleString()}</strong>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {/* Tenancy Contract Modal */}
      <HenryTenancyContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
      />
    </HubContainer>
  );
};

export default LeasingOperationsHub;
