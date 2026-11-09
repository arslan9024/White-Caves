import React, { memo, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import InternalModuleMount from '../InternalModuleMount';
import LindaExecutiveHeader from './LindaWhatsAppCRM/LindaExecutiveHeader';
import LindaTelemetryGrid from './LindaWhatsAppCRM/LindaTelemetryGrid';
import {
  LindaQuickActionsAndTerminal,
  LindaSessionsPanel,
  LindaConversationsAndPillarsPanel,
} from './LindaWhatsAppCRM/LindaOperationsCenterPanels';
import { LindaCampaignsAndOutreachPanel } from './LindaWhatsAppCRM/LindaCampaignsAndOutreachPanels';
import { LindaViewTab } from './LindaWhatsAppCRM/LindaWhatsAppCRM.types';
import {
  INITIAL_OUTREACH_OWNERS,
  INITIAL_LINDA_CONVERSATIONS,
  LINDA_10_PILLARS,
} from './LindaWhatsAppCRM/LindaWhatsAppCRM.data';
import { useLindaOperationsCenter } from './LindaWhatsAppCRM/useLindaOperationsCenter';

/**
 * LindaWhatsAppCRM — Upgraded Visual Operations Center (v2.0.0-enterprise)
 * Modularized under AEGIS APOCALYPSE-AEG-042 (< 350 lines).
 */
const LindaWhatsAppCRM = memo(() => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeViewTab, setActiveViewTab] = useState<LindaViewTab>('all');

  const {
    isConnected,
    lindaStatus,
    loadingAction,
    controlError,
    soundEnabled,
    setSoundEnabled,
    currentTimeGST,
    heartbeatLatency,
    confirmEmergencyStop,
    setConfirmEmergencyStop,
    qrCodeDataUrl,
    setQrCodeDataUrl,
    isQrLoading,
    toastNotification,
    setToastNotification,
    metrics,
    sessions,
    campaigns,
    features,
    playbooks,
    activeModalOutput,
    setActiveModalOutput,
    terminalLines,
    setTerminalLines,
    liveLogs,
    refreshLindaStatus,
    handleToggleLindaRuntime,
    handleExecuteCommand,
    handlePingSession,
    handlePairDeviceCode,
    handleScanDeviceQr,
    handleToggleCampaignStatus,
    handleQueueOutreachBatch,
    handleSendQuickReply,
  } = useLindaOperationsCenter();

  const fallbackContent = (
    <section
      aria-label="Linda WhatsApp CRM"
      data-testid="linda-operations-center"
      style={{ display: 'grid', gap: 16, paddingBottom: 28 }}
    >
      <LindaExecutiveHeader
        isDark={isDark}
        isConnected={isConnected}
        lindaStatus={lindaStatus}
        loadingAction={loadingAction}
        controlError={controlError}
        activeViewTab={activeViewTab}
        setActiveViewTab={setActiveViewTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        currentTimeGST={currentTimeGST}
        heartbeatLatency={heartbeatLatency}
        confirmEmergencyStop={confirmEmergencyStop}
        setConfirmEmergencyStop={setConfirmEmergencyStop}
        toastNotification={toastNotification}
        setToastNotification={setToastNotification}
        onRefreshStatus={() => void refreshLindaStatus()}
        onToggleRuntime={() => void handleToggleLindaRuntime()}
      />

      <LindaTelemetryGrid isDark={isDark} metrics={metrics} />

      {(activeViewTab === 'all' || activeViewTab === 'terminal') && (
        <LindaQuickActionsAndTerminal
          features={features}
          playbooks={playbooks}
          terminalLines={terminalLines}
          onExecuteCommand={(cmd, label) => void handleExecuteCommand(cmd, label)}
          onClearTerminal={() => setTerminalLines(['$ Terminal cleared. Ready for next command.'])}
          activeModalOutput={activeModalOutput}
          onCloseModal={() => {
            setActiveModalOutput(null);
            setQrCodeDataUrl(null);
          }}
          qrCodeDataUrl={qrCodeDataUrl}
          isQrLoading={isQrLoading}
        />
      )}

      {(activeViewTab === 'all' || activeViewTab === 'sessions') && (
        <LindaSessionsPanel
          sessions={sessions}
          onPingSession={handlePingSession}
          onPairDeviceCode={handlePairDeviceCode}
          onScanDeviceQr={handleScanDeviceQr}
        />
      )}

      {(activeViewTab === 'all' || activeViewTab === 'outreach') && (
        <LindaCampaignsAndOutreachPanel
          campaigns={campaigns}
          onToggleCampaignStatus={handleToggleCampaignStatus}
          outreachOwners={INITIAL_OUTREACH_OWNERS}
          onQueueOutreachBatch={handleQueueOutreachBatch}
        />
      )}

      {(activeViewTab === 'all' || activeViewTab === 'conversations') && (
        <LindaConversationsAndPillarsPanel
          conversations={INITIAL_LINDA_CONVERSATIONS}
          pillars={LINDA_10_PILLARS}
          liveLogs={liveLogs}
          onSendQuickReply={handleSendQuickReply}
        />
      )}
    </section>
  );

  return <InternalModuleMount assistantId="linda" fallback={fallbackContent} />;
});

LindaWhatsAppCRM.displayName = 'LindaWhatsAppCRM';

export default LindaWhatsAppCRM;
