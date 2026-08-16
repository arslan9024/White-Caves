import React, { FC, lazy, Suspense, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import PublicLayout from '../../components/layout/PublicLayout';
import PageMeta from '../../components/seo/PageMeta';

// ─── Lazy-load all Goal components ──────────────────────────────────────────
// Wave 46: VR & Media
const PannellumVRViewer = lazy(() => import('../../components/media/PannellumVRViewer/PannellumVRViewer'));
const VirtualStagingCanvas = lazy(() => import('../../components/media/VirtualStagingCanvas/VirtualStagingCanvas'));
const WebXRHeadsetViewer = lazy(() => import('../../components/media/WebXRHeadsetViewer/WebXRHeadsetViewer'));
const Floorplan3DModeler = lazy(() => import('../../components/media/Floorplan3DModeler/Floorplan3DModeler'));
const SpatialAudioGuide = lazy(() => import('../../components/media/SpatialAudioGuide/SpatialAudioGuide'));
const ProgressiveImageLoader = lazy(() => import('../../components/media/ProgressiveImageLoader/ProgressiveImageLoader'));
const ArRoomMeasurer = lazy(() => import('../../components/media/ArRoomMeasurer/ArRoomMeasurer'));
const VrThumbnailBar = lazy(() => import('../../components/media/VrThumbnailBar/VrThumbnailBar'));
const VrFullscreenModal = lazy(() => import('../../components/media/VrFullscreenModal/VrFullscreenModal'));

// Wave 47: Analytics & Valuation
const DldRegressionModeler = lazy(() => import('../../components/analytics/DldRegressionModeler/DldRegressionModeler'));
const OffPlanRiskCalculator = lazy(() => import('../../components/analytics/OffPlanRiskCalculator/OffPlanRiskCalculator'));
const RoiDualSliderAppraiser = lazy(() => import('../../components/analytics/RoiDualSliderAppraiser/RoiDualSliderAppraiser'));
const PricePerSqftSparkline = lazy(() => import('../../components/analytics/PricePerSqftSparkline/PricePerSqftSparkline'));
const CmaReportGenerator = lazy(() => import('../../components/analytics/CmaReportGenerator/CmaReportGenerator'));
const LiquidityIndexBadge = lazy(() => import('../../components/analytics/LiquidityIndexBadge/LiquidityIndexBadge'));
const ShortVsLongTermYieldComparator = lazy(() => import('../../components/analytics/ShortVsLongTermYieldComparator/ShortVsLongTermYieldComparator'));
const MetroProximityMultiplier = lazy(() => import('../../components/analytics/MetroProximityMultiplier/MetroProximityMultiplier'));
const MortgageStressTestSimulator = lazy(() => import('../../components/analytics/MortgageStressTestSimulator/MortgageStressTestSimulator'));

// Wave 48: Legal & Conveyancing
const FormBSignatureStream = lazy(() => import('../../components/compliance/FormBSignatureStream/FormBSignatureStream'));
const FormFClauseGenerator = lazy(() => import('../../components/compliance/FormFClauseGenerator/FormFClauseGenerator'));
const TrakheesiQrScanner = lazy(() => import('../../components/compliance/TrakheesiQrScanner/TrakheesiQrScanner'));
const Form12MailTracker = lazy(() => import('../../components/compliance/Form12MailTracker/Form12MailTracker'));
const AmlPepScreeningFilter = lazy(() => import('../../components/compliance/AmlPepScreeningFilter/AmlPepScreeningFilter'));
const TrusteeOfficeScheduler = lazy(() => import('../../components/compliance/TrusteeOfficeScheduler/TrusteeOfficeScheduler'));
const DeveloperNocTracker = lazy(() => import('../../components/compliance/DeveloperNocTracker/DeveloperNocTracker'));
const PoaValidationPortal = lazy(() => import('../../components/compliance/PoaValidationPortal/PoaValidationPortal'));

// Wave 49: VIP & UHNW Concierge
const UhnwPrivateVault = lazy(() => import('../../components/vip/UhnwPrivateVault/UhnwPrivateVault'));
const ChauffeurViewingCoordinator = lazy(() => import('../../components/vip/ChauffeurViewingCoordinator/ChauffeurViewingCoordinator'));
const MultiCurrencyEscrowVault = lazy(() => import('../../components/vip/MultiCurrencyEscrowVault/MultiCurrencyEscrowVault'));
const GoldenVisaEligibilityWidget = lazy(() => import('../../components/vip/GoldenVisaEligibilityWidget/GoldenVisaEligibilityWidget'));
const FamilyOfficeAssetAllocationChart = lazy(() => import('../../components/vip/FamilyOfficeAssetAllocationChart/FamilyOfficeAssetAllocationChart'));
const CryptoPaymentSimulator = lazy(() => import('../../components/vip/CryptoPaymentSimulator/CryptoPaymentSimulator'));
const NdaDigitalSigningModal = lazy(() => import('../../components/vip/NdaDigitalSigningModal/NdaDigitalSigningModal'));
const PortfolioDeckGenerator = lazy(() => import('../../components/vip/PortfolioDeckGenerator/PortfolioDeckGenerator'));
const VipResponseSlaTracker = lazy(() => import('../../components/vip/VipResponseSlaTracker/VipResponseSlaTracker'));
const OffMarketLeadRouter = lazy(() => import('../../components/vip/OffMarketLeadRouter/OffMarketLeadRouter'));

// Wave 50: Finance & Leasing
const PdcDepositReminderCalendar = lazy(() => import('../../components/finance/PdcDepositReminderCalendar/PdcDepositReminderCalendar'));
const VatInvoiceGenerator = lazy(() => import('../../components/finance/VatInvoiceGenerator/VatInvoiceGenerator'));
const BouncedChequeWorkflow = lazy(() => import('../../components/finance/BouncedChequeWorkflow/BouncedChequeWorkflow'));
const UaeddsRentMandate = lazy(() => import('../../components/finance/UaeddsRentMandate/UaeddsRentMandate'));
const SecurityDepositRefundLedger = lazy(() => import('../../components/finance/SecurityDepositRefundLedger/SecurityDepositRefundLedger'));
const LandlordPayoutBatchDispatch = lazy(() => import('../../components/finance/LandlordPayoutBatchDispatch/LandlordPayoutBatchDispatch'));
const FinancialPandLDashboard = lazy(() => import('../../components/finance/FinancialPandLDashboard/FinancialPandLDashboard'));
const AuditTrailExporter = lazy(() => import('../../components/finance/AuditTrailExporter/AuditTrailExporter'));

// Wave 51: Communications & CRM
const BroadcastCampaignSegmenter = lazy(() => import('../../components/comms/BroadcastCampaignSegmenter/BroadcastCampaignSegmenter'));
const ChatSentimentAnalyzer = lazy(() => import('../../components/comms/ChatSentimentAnalyzer/ChatSentimentAnalyzer'));
const LeadQualificationTagger = lazy(() => import('../../components/comms/LeadQualificationTagger/LeadQualificationTagger'));
const WhatsAppTelemetrySocket = lazy(() => import('../../components/comms/WhatsAppTelemetrySocket/WhatsAppTelemetrySocket'));

// Wave 52: IoT Facilities & Asset Management
const HvacInspectionCalendar = lazy(() => import('../../components/iot/HvacInspectionCalendar/HvacInspectionCalendar'));
const SnaggingChecklistAnnotator = lazy(() => import('../../components/iot/SnaggingChecklistAnnotator/SnaggingChecklistAnnotator'));
const UtilityTransferWizard = lazy(() => import('../../components/iot/UtilityTransferWizard/UtilityTransferWizard'));
const AccessCardApprovalWorkflow = lazy(() => import('../../components/iot/AccessCardApprovalWorkflow/AccessCardApprovalWorkflow'));
const AmenityBookingCalendar = lazy(() => import('../../components/iot/AmenityBookingCalendar/AmenityBookingCalendar'));
const EmergencyHotlineRouter = lazy(() => import('../../components/iot/EmergencyHotlineRouter/EmergencyHotlineRouter'));
const PropertyConditionReportGenerator = lazy(() => import('../../components/iot/PropertyConditionReportGenerator/PropertyConditionReportGenerator'));
const VendorRatingMatrix = lazy(() => import('../../components/iot/VendorRatingMatrix/VendorRatingMatrix'));

// Wave 53: Off-Plan Developer Engine
const PaymentPlanTimelineVisualizer = lazy(() => import('../../components/offplan/PaymentPlanTimelineVisualizer/PaymentPlanTimelineVisualizer'));
const CommissionAcceleratorEngine = lazy(() => import('../../components/offplan/CommissionAcceleratorEngine/CommissionAcceleratorEngine'));
const BulkUnitReservationLock = lazy(() => import('../../components/offplan/BulkUnitReservationLock/BulkUnitReservationLock'));
const OffPlanAssignmentCalculator = lazy(() => import('../../components/offplan/OffPlanAssignmentCalculator/OffPlanAssignmentCalculator'));
const MasterplanInteractiveMap = lazy(() => import('../../components/offplan/MasterplanInteractiveMap/MasterplanInteractiveMap'));
const EoiDepositGateway = lazy(() => import('../../components/offplan/EoiDepositGateway/EoiDepositGateway'));
const OffPlanSalesLeaderboard = lazy(() => import('../../components/offplan/OffPlanSalesLeaderboard/OffPlanSalesLeaderboard'));
const ConstructionProgressStream = lazy(() => import('../../components/offplan/ConstructionProgressStream/ConstructionProgressStream'));
const DeveloperDamPortal = lazy(() => import('../../components/offplan/DeveloperDamPortal/DeveloperDamPortal'));

// Wave 54: Commercial & Advisory
const FitOutCostEstimator = lazy(() => import('../../components/commercial/FitOutCostEstimator/FitOutCostEstimator'));
const TenantCreditRiskRating = lazy(() => import('../../components/commercial/TenantCreditRiskRating/TenantCreditRiskRating'));
const WarehousePowerLoadChecker = lazy(() => import('../../components/commercial/WarehousePowerLoadChecker/WarehousePowerLoadChecker'));
const TenancyStackPlanVisualizer = lazy(() => import('../../components/commercial/TenancyStackPlanVisualizer/TenancyStackPlanVisualizer'));
const ReraCommercialRentIndexCalculator = lazy(() => import('../../components/commercial/ReraCommercialRentIndexCalculator/ReraCommercialRentIndexCalculator'));
const LandFeasibilityStudyGenerator = lazy(() => import('../../components/commercial/LandFeasibilityStudyGenerator/LandFeasibilityStudyGenerator'));
const JvEquityIrrDistributionModel = lazy(() => import('../../components/commercial/JvEquityIrrDistributionModel/JvEquityIrrDistributionModel'));
const InstitutionalTeaserDeckBuilder = lazy(() => import('../../components/commercial/InstitutionalTeaserDeckBuilder/InstitutionalTeaserDeckBuilder'));

// Wave 55: Enterprise Security & Governance
const RbacPermissionMatrixEditor = lazy(() => import('../../components/security/RbacPermissionMatrixEditor/RbacPermissionMatrixEditor'));
const SystemHealthDashboard = lazy(() => import('../../components/security/SystemHealthDashboard/SystemHealthDashboard'));

// ─── Animations ──────────────────────────────────────────────────────────────
const fadeIn = keyframes`from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); }`;

// ─── Layout ───────────────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #070B14 0%, #0F172A 100%);
  padding: 0 0 80px;
`;

const Hero = styled.div`
  text-align: center;
  padding: 60px 20px 40px;
  animation: ${fadeIn} 0.6s ease;
`;

const HeroTitle = styled.h1`
  font-size: clamp(1.6rem, 4vw, 2.8rem);
  font-weight: 900;
  color: #FFFFFF;
  margin: 0 0 12px;
  font-family: 'Inter', sans-serif;
  span { color: #EF4444; }
`;

const HeroSubtitle = styled.p`
  font-size: 1rem;
  color: #64748B;
  max-width: 650px;
  margin: 0 auto 24px;
  font-family: 'Inter', sans-serif;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const StatPill = styled.div`
  padding: 8px 20px;
  border-radius: 999px;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.25);
  color: #EF4444;
  font-size: 0.82rem;
  font-weight: 800;
  font-family: 'Inter', sans-serif;
`;

const WaveSection = styled.section`
  max-width: 1240px;
  margin: 0 auto 48px;
  padding: 0 20px;
  animation: ${fadeIn} 0.5s ease;
`;

const WaveTitle = styled.h2`
  font-size: 1rem;
  font-weight: 800;
  color: #EF4444;
  margin: 0 0 20px;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: rgba(239,68,68,0.06);
  border-left: 3px solid #EF4444;
  border-radius: 0 8px 8px 0;
`;

const ComponentGrid = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${p => p.$cols || 2}, 1fr);
  gap: 20px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`;

const Skeleton = styled.div`
  height: 200px;
  border-radius: 14px;
  background: linear-gradient(90deg, rgba(30,41,59,0.5) 0%, rgba(51,65,85,0.5) 50%, rgba(30,41,59,0.5) 100%);
  background-size: 200% 100%;
  animation: ${fadeIn} 1s ease infinite;
`;

const SuspenseFallback: FC = () => <Skeleton />;

// ─── Wave Tabs ───────────────────────────────────────────────────────────────
const TabBar = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0 20px 32px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid ${p => p.$active ? '#EF4444' : 'rgba(100,116,139,0.25)'};
  background: ${p => p.$active ? 'rgba(239,68,68,0.12)' : 'transparent'};
  color: ${p => p.$active ? '#EF4444' : '#64748B'};
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  &:hover { border-color: #EF4444; color: #EF4444; }
`;

const WAVES = [
  'All',
  'Wave 46 — VR/Media',
  'Wave 47 — Analytics',
  'Wave 48 — Conveyancing',
  'Wave 49 — VIP Concierge',
  'Wave 50 — Finance & PDC',
  'Wave 51 — CRM & Comms',
  'Wave 52 — Facilities IoT',
  'Wave 53 — Off-Plan Engine',
  'Wave 54 — Commercial Suite',
  'Wave 55 — Enterprise Security',
];

// ─── Page Component ───────────────────────────────────────────────────────────
export const GoalsGalleryPage: FC = () => {
  const [activeWave, setActiveWave] = useState('All');

  const showWave = (wave: string) => activeWave === 'All' || activeWave === wave;

  return (
    <PublicLayout>
      <PageMeta
        title="White Caves — Goals Gallery | AEGIS 100-Goal Sovereign Showcase"
        description="Explore all AEGIS-implemented components for White Caves Real Estate LLC — VR tours, analytics, VIP concierge, finance, conveyancing, IoT facilities, and commercial suite."
      />
      <Page>
        <Hero>
          <HeroTitle><span>100</span> Goals Sovereign Showcase</HeroTitle>
          <HeroSubtitle>
            AEGIS V3 Sovereign OS — All implemented goals across 10 strategic waves (Waves 46–55) of the White Caves Real Estate platform.
          </HeroSubtitle>
          <StatsRow>
            <StatPill>✅ 100% Backlog Delivered</StatPill>
            <StatPill>🌊 10 Strategic Waves Active</StatPill>
            <StatPill>🤖 AEGIS V3 Enterprise Engine</StatPill>
            <StatPill>🏆 Dubai DLD & RERA Aligned</StatPill>
          </StatsRow>
        </Hero>

        <TabBar>
          {WAVES.map(w => (
            <Tab key={w} $active={w === activeWave} onClick={() => setActiveWave(w)}>{w}</Tab>
          ))}
        </TabBar>

        {showWave('Wave 46 — VR/Media') && (
          <WaveSection>
            <WaveTitle>🌊 Wave 46 — AI Virtual Staging & Pannellum 360° VR Tours</WaveTitle>
            <ComponentGrid>
              <Suspense fallback={<SuspenseFallback />}><PannellumVRViewer /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><VirtualStagingCanvas /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><WebXRHeadsetViewer /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><Floorplan3DModeler /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><SpatialAudioGuide /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><ArRoomMeasurer /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><ProgressiveImageLoader /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><VrThumbnailBar /></Suspense>
            </ComponentGrid>
          </WaveSection>
        )}

        {showWave('Wave 47 — Analytics') && (
          <WaveSection>
            <WaveTitle>🌊 Wave 47 — Predictive Real Estate ROI & AI Valuation Engine</WaveTitle>
            <ComponentGrid>
              <Suspense fallback={<SuspenseFallback />}><DldRegressionModeler /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><OffPlanRiskCalculator /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><RoiDualSliderAppraiser /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><PricePerSqftSparkline /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><LiquidityIndexBadge /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><ShortVsLongTermYieldComparator /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><MetroProximityMultiplier /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><MortgageStressTestSimulator /></Suspense>
            </ComponentGrid>
          </WaveSection>
        )}

        {showWave('Wave 48 — Conveyancing') && (
          <WaveSection>
            <WaveTitle>🌊 Wave 48 — RERA Legal Conveyancing & Form Contracts</WaveTitle>
            <ComponentGrid>
              <Suspense fallback={<SuspenseFallback />}><FormBSignatureStream /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><FormFClauseGenerator /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><TrakheesiQrScanner /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><Form12MailTracker /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><AmlPepScreeningFilter /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><TrusteeOfficeScheduler /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><DeveloperNocTracker /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><PoaValidationPortal /></Suspense>
            </ComponentGrid>
          </WaveSection>
        )}

        {showWave('Wave 49 — VIP Concierge') && (
          <WaveSection>
            <WaveTitle>🌊 Wave 49 — VIP Ultra-High-Net-Worth Concierge Engine</WaveTitle>
            <ComponentGrid>
              <Suspense fallback={<SuspenseFallback />}><UhnwPrivateVault /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><ChauffeurViewingCoordinator /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><MultiCurrencyEscrowVault /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><GoldenVisaEligibilityWidget /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><CryptoPaymentSimulator /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><NdaDigitalSigningModal /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><PortfolioDeckGenerator /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><VipResponseSlaTracker /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><OffMarketLeadRouter /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><FamilyOfficeAssetAllocationChart /></Suspense>
            </ComponentGrid>
          </WaveSection>
        )}

        {showWave('Wave 50 — Finance & PDC') && (
          <WaveSection>
            <WaveTitle>🌊 Wave 50 — Smart PDC Cheque Vault & Rental Ledger Engine</WaveTitle>
            <ComponentGrid>
              <Suspense fallback={<SuspenseFallback />}><PdcDepositReminderCalendar /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><VatInvoiceGenerator /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><BouncedChequeWorkflow /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><UaeddsRentMandate /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><SecurityDepositRefundLedger /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><LandlordPayoutBatchDispatch /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><FinancialPandLDashboard /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><AuditTrailExporter /></Suspense>
            </ComponentGrid>
          </WaveSection>
        )}

        {showWave('Wave 51 — CRM & Comms') && (
          <WaveSection>
            <WaveTitle>🌊 Wave 51 — WhatsApp Automation & AI Communications</WaveTitle>
            <ComponentGrid>
              <Suspense fallback={<SuspenseFallback />}><BroadcastCampaignSegmenter /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><ChatSentimentAnalyzer /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><LeadQualificationTagger /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><WhatsAppTelemetrySocket /></Suspense>
            </ComponentGrid>
          </WaveSection>
        )}

        {showWave('Wave 52 — Facilities IoT') && (
          <WaveSection>
            <WaveTitle>🌊 Wave 52 — Smart Building IoT & Asset Management</WaveTitle>
            <ComponentGrid>
              <Suspense fallback={<SuspenseFallback />}><HvacInspectionCalendar /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><SnaggingChecklistAnnotator /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><UtilityTransferWizard /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><AccessCardApprovalWorkflow /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><AmenityBookingCalendar /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><EmergencyHotlineRouter /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><PropertyConditionReportGenerator /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><VendorRatingMatrix /></Suspense>
            </ComponentGrid>
          </WaveSection>
        )}

        {showWave('Wave 53 — Off-Plan Engine') && (
          <WaveSection>
            <WaveTitle>🌊 Wave 53 — Developer Off-Plan Launch & Sales Engine</WaveTitle>
            <ComponentGrid>
              <Suspense fallback={<SuspenseFallback />}><PaymentPlanTimelineVisualizer /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><CommissionAcceleratorEngine /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><BulkUnitReservationLock /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><OffPlanAssignmentCalculator /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><MasterplanInteractiveMap /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><EoiDepositGateway /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><OffPlanSalesLeaderboard /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><ConstructionProgressStream /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><DeveloperDamPortal /></Suspense>
            </ComponentGrid>
          </WaveSection>
        )}

        {showWave('Wave 54 — Commercial Suite') && (
          <WaveSection>
            <WaveTitle>🌊 Wave 54 — Commercial Real Estate & Advisory Suite</WaveTitle>
            <ComponentGrid>
              <Suspense fallback={<SuspenseFallback />}><FitOutCostEstimator /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><TenantCreditRiskRating /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><WarehousePowerLoadChecker /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><TenancyStackPlanVisualizer /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><ReraCommercialRentIndexCalculator /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><LandFeasibilityStudyGenerator /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><JvEquityIrrDistributionModel /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><InstitutionalTeaserDeckBuilder /></Suspense>
            </ComponentGrid>
          </WaveSection>
        )}

        {showWave('Wave 55 — Enterprise Security') && (
          <WaveSection>
            <WaveTitle>🌊 Wave 55 — Enterprise Security & System Telemetry</WaveTitle>
            <ComponentGrid>
              <Suspense fallback={<SuspenseFallback />}><RbacPermissionMatrixEditor /></Suspense>
              <Suspense fallback={<SuspenseFallback />}><SystemHealthDashboard /></Suspense>
            </ComponentGrid>
          </WaveSection>
        )}
      </Page>
    </PublicLayout>
  );
};

export default GoalsGalleryPage;
