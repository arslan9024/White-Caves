import React, { lazy, Suspense, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentAssistant } from '../../store/slices/aiAssistantDashboardSlice';
import { selectActiveFeatureTab } from '../../store/slices/dashboardViewSlice';
import { getFeatureById } from '../../config/assistantFeatures';
import GenericFeatureView from './ui/GenericFeatureView';
import './FeatureRenderer.css';

// Use _NEW TypeScript versions where available for improved type safety
const ZoeExecutiveCRM = lazy(() => import('./ZoeExecutiveCRM_NEW'));
const MaryInventoryCRM = lazy(() => import('./MaryInventoryCRM_NEW'));
const ClaraLeadsCRM = lazy(() => import('./ClaraLeadsCRM_NEW'));
const LindaWhatsAppCRM = lazy(() => import('./LindaWhatsAppCRM')); // no _NEW yet
const NinaWhatsAppBotCRM = lazy(() => import('./NinaWhatsAppBotCRM_NEW'));
const SophiaSalesCRM = lazy(() => import('./SophiaSalesCRM_NEW'));
const NancyHRCRM = lazy(() => import('./NancyHRCRM_NEW'));
const DaisyLeasingCRM = lazy(() => import('./DaisyLeasingCRM_NEW'));
const TheodoraFinanceCRM = lazy(() => import('./TheodoraFinanceCRM_NEW'));
const OliviaMarketingCRM = lazy(() => import('./OliviaMarketingCRM_NEW'));
const LailaComplianceCRM = lazy(() => import('./LailaComplianceCRM_NEW'));
const AuroraCTODashboard = lazy(() => import('./AuroraCTODashboard_NEW'));
const HazelFrontendCRM = lazy(() => import('./HazelFrontendCRM_NEW'));
const WillowBackendCRM = lazy(() => import('./WillowBackendCRM_NEW'));
const EvangelineLegalCRM = lazy(() => import('./EvangelineLegalCRM')); // no _NEW yet
const SentinelPropertyCRM = lazy(() => import('./SentinelPropertyCRM')); // no _NEW yet
const HunterProspectingCRM = lazy(() => import('./HunterProspectingCRM')); // no _NEW yet
const HenryAuditCRM = lazy(() => import('./HenryAuditCRM')); // no _NEW yet
const CipherMarketCRM = lazy(() => import('./CipherMarketCRM')); // no _NEW yet
const AtlasProjectsCRM = lazy(() => import('./AtlasProjectsCRM')); // no _NEW yet
const VestaHandoverCRM = lazy(() => import('./VestaHandoverCRM')); // no _NEW yet
const JunoCommunity = lazy(() => import('./JunoCommunity')); // no _NEW yet
const KairosLuxuryCRM = lazy(() => import('./KairosLuxuryCRM')); // no _NEW yet
const MavenInvestmentCRM = lazy(() => import('./MavenInvestmentCRM')); // no _NEW yet

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
