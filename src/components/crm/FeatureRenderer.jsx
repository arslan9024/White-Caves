import React, { lazy, Suspense, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentAssistant } from '../../store/slices/aiAssistantDashboardSlice';
import { selectActiveFeatureTab } from '../../store/slices/dashboardViewSlice';
import { getFeatureById } from '../../config/assistantFeatures';
import GenericFeatureView from './ui/GenericFeatureView';
import './FeatureRenderer.css';

const ZoeExecutiveCRM = lazy(() => import('./ZoeExecutiveCRM'));
const MaryInventoryCRM = lazy(() => import('./MaryInventoryCRM'));
const ClaraLeadsCRM = lazy(() => import('./ClaraLeadsCRM'));
const LindaWhatsAppCRM = lazy(() => import('./LindaWhatsAppCRM'));
const NinaWhatsAppBotCRM = lazy(() => import('./NinaWhatsAppBotCRM'));
const SophiaSalesCRM = lazy(() => import('./SophiaSalesCRM'));
const NancyHRCRM = lazy(() => import('./NancyHRCRM'));
const DaisyLeasingCRM = lazy(() => import('./DaisyLeasingCRM'));
const TheodoraFinanceCRM = lazy(() => import('./TheodoraFinanceCRM'));
const OliviaMarketingCRM = lazy(() => import('./OliviaMarketingCRM'));
const LailaComplianceCRM = lazy(() => import('./LailaComplianceCRM'));
const AuroraCTODashboard = lazy(() => import('./AuroraCTODashboard'));
const HazelFrontendCRM = lazy(() => import('./HazelFrontendCRM'));
const WillowBackendCRM = lazy(() => import('./WillowBackendCRM'));
const EvangelineLegalCRM = lazy(() => import('./EvangelineLegalCRM'));
const SentinelPropertyCRM = lazy(() => import('./SentinelPropertyCRM'));
const HunterProspectingCRM = lazy(() => import('./HunterProspectingCRM'));
const HenryAuditCRM = lazy(() => import('./HenryAuditCRM'));
const CipherMarketCRM = lazy(() => import('./CipherMarketCRM'));
const AtlasProjectsCRM = lazy(() => import('./AtlasProjectsCRM'));
const VestaHandoverCRM = lazy(() => import('./VestaHandoverCRM'));
const JunoCommunity = lazy(() => import('./JunoCommunity'));
const KairosLuxuryCRM = lazy(() => import('./KairosLuxuryCRM'));
const MavenInvestmentCRM = lazy(() => import('./MavenInvestmentCRM'));

const ASSISTANT_CRM_MAP = {
  zoe: ZoeExecutiveCRM,
  mary: MaryInventoryCRM,
  clara: ClaraLeadsCRM,
  linda: LindaWhatsAppCRM,
  nina: NinaWhatsAppBotCRM,
  sophia: SophiaSalesCRM,
  nancy: NancyHRCRM,
  daisy: DaisyLeasingCRM,
  theodora: TheodoraFinanceCRM,
  olivia: OliviaMarketingCRM,
  laila: LailaComplianceCRM,
  aurora: AuroraCTODashboard,
  hazel: HazelFrontendCRM,
  willow: WillowBackendCRM,
  evangeline: EvangelineLegalCRM,
  sentinel: SentinelPropertyCRM,
  hunter: HunterProspectingCRM,
  henry: HenryAuditCRM,
  cipher: CipherMarketCRM,
  atlas: AtlasProjectsCRM,
  vesta: VestaHandoverCRM,
  juno: JunoCommunity,
  kairos: KairosLuxuryCRM,
  maven: MavenInvestmentCRM
};

const LoadingFallback = () => (
  <div className="feature-loading">
    <div className="loading-spinner" />
    <span>Loading feature...</span>
  </div>
);

const FeatureRenderer = ({ assistantId: propAssistantId, featureId: propFeatureId }) => {
  const currentAssistant = useSelector(selectCurrentAssistant);
  const activeFeatureTab = useSelector(selectActiveFeatureTab);
  
  const assistantId = propAssistantId || currentAssistant?.id;
  const featureId = propFeatureId || activeFeatureTab || 'dashboard';
  
  const feature = useMemo(() => {
    if (!assistantId) return null;
    return getFeatureById(assistantId, featureId);
  }, [assistantId, featureId]);

  const content = useMemo(() => {
    if (!assistantId) {
      return (
        <div className="no-selection">
          <div className="no-selection-content">
            <h2>Select an AI Assistant</h2>
            <p>Choose an assistant from the sidebar to view their features and data.</p>
          </div>
        </div>
      );
    }

    const CRMComponent = ASSISTANT_CRM_MAP[assistantId];
    
    if (CRMComponent) {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <CRMComponent activeFeature={featureId} />
        </Suspense>
      );
    }

    return (
      <GenericFeatureView
        assistant={currentAssistant}
        feature={feature || { id: featureId, label: featureId }}
        color={currentAssistant?.colorScheme || '#0EA5E9'}
      />
    );
  }, [assistantId, featureId, currentAssistant, feature]);

  return (
    <div className="feature-renderer" data-assistant={assistantId} data-feature={featureId}>
      {content}
    </div>
  );
};

export default FeatureRenderer;
