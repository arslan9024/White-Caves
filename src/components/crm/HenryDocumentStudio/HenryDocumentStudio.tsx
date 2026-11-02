/**
 * HenryDocumentStudio.tsx — View Layer (4-Way Component Architecture)
 * Sits at folder root: Pure presentation coordinator shell consuming sub-components, logic, and styles.
 * AEGIS V4.1 Single Purpose File Law: Modularized under 350 lines.
 */

import React, { FC } from 'react';
import { useHenryDocumentStudioLogic } from './logic/HenryDocumentStudio.logic';
import { HenryTenancyContractModal } from './HenryTenancyContractModal';
import { StudioContainer, WorkspaceSplit } from './styles/HenryDocumentStudio.style';
import { HenryDocumentStudioHeader } from './components/HenryDocumentStudioHeader';
import { HenryDocumentStudioSidebar } from './components/HenryDocumentStudioSidebar';
import { HenryTenancyContractPreview } from './components/HenryTenancyContractPreview';
import { HenryPassportPreview } from './components/HenryPassportPreview';
import { HenryTitleDeedPreview } from './components/HenryTitleDeedPreview';
import { HenryEmiratesIdPreview } from './components/HenryEmiratesIdPreview';
import { HenryCanvasPreview } from './components/HenryCanvasPreview';

export const HenryDocumentStudio: FC = () => {
  const {
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    compiledHtml,
    zoomLevel,
    eidData,
    titleDeedData,
    passportData,
    isScanning,
    actionSuccessMessage,
    handlePrint,
    handleZoomIn,
    handleZoomOut,
    handleCopyEsignLink,
    handleTriggerAiAutoFill,
    handleScanEmiratesId,
    handleScanTitleDeed,
    handleScanPassport,
    handleAutoFillAsTenant,
    handleAutoFillAsLandlord,
    handleAutoFillTenancyFromTitleDeed,
    handleAutoFillTenancyAsPassportTenant,
    handleAutoFillTenancyAsPassportLandlord,
    handleAutoFillViewingFromPassport,
    handleAutoFillViewingForm,
    handleCopyJsonVariables,
    handleCopyTitleDeedJsonVariables,
    handleCopyPassportJsonVariables,
    handleCreateCrmListing,
    handleAutoFillFormA,
    handleCreateAmlKycRecord,
    scannedContractData,
    handleScanTenancyContract,
    handleLoadContractIntoPreparationStudio,
    handleCreateCrmLandlordFromContract,
    handleCreateCrmTenantFromContract,
    handleCopyContractJsonVariables,
    isTenancyModalOpen,
    handleOpenTenancyModal,
    handleCloseTenancyModal,
  } = useHenryDocumentStudioLogic();

  return (
    <StudioContainer data-testid="henry-document-studio">
      <HenryDocumentStudioHeader
        handleOpenTenancyModal={handleOpenTenancyModal}
        actionSuccessMessage={actionSuccessMessage}
      />

      <WorkspaceSplit>
        <HenryDocumentStudioSidebar
          templates={templates}
          selectedTemplateId={selectedTemplateId}
          setSelectedTemplateId={setSelectedTemplateId}
        />

        {selectedTemplateId === 'tenancy_contract_scanner' ? (
          <HenryTenancyContractPreview
            scannedContractData={scannedContractData}
            isScanning={isScanning}
            handleScanTenancyContract={handleScanTenancyContract}
            handleLoadContractIntoPreparationStudio={handleLoadContractIntoPreparationStudio}
            handleCreateCrmLandlordFromContract={handleCreateCrmLandlordFromContract}
            handleCreateCrmTenantFromContract={handleCreateCrmTenantFromContract}
            handleCopyContractJsonVariables={handleCopyContractJsonVariables}
          />
        ) : selectedTemplateId === 'passport_scanner' ? (
          <HenryPassportPreview
            passportData={passportData}
            isScanning={isScanning}
            handleScanPassport={handleScanPassport}
            handleAutoFillTenancyAsPassportTenant={handleAutoFillTenancyAsPassportTenant}
            handleAutoFillTenancyAsPassportLandlord={handleAutoFillTenancyAsPassportLandlord}
            handleAutoFillViewingFromPassport={handleAutoFillViewingFromPassport}
            handleCreateAmlKycRecord={handleCreateAmlKycRecord}
            handleCopyPassportJsonVariables={handleCopyPassportJsonVariables}
          />
        ) : selectedTemplateId === 'title_deed_scanner' ? (
          <HenryTitleDeedPreview
            titleDeedData={titleDeedData}
            isScanning={isScanning}
            handleScanTitleDeed={handleScanTitleDeed}
            handleCreateCrmListing={handleCreateCrmListing}
            handleAutoFillTenancyFromTitleDeed={handleAutoFillTenancyFromTitleDeed}
            handleAutoFillFormA={handleAutoFillFormA}
            handleCopyTitleDeedJsonVariables={handleCopyTitleDeedJsonVariables}
          />
        ) : selectedTemplateId === 'emirates_id_scanner' ? (
          <HenryEmiratesIdPreview
            eidData={eidData}
            isScanning={isScanning}
            handleScanEmiratesId={handleScanEmiratesId}
            handleAutoFillAsTenant={handleAutoFillAsTenant}
            handleAutoFillAsLandlord={handleAutoFillAsLandlord}
            handleAutoFillViewingForm={handleAutoFillViewingForm}
            handleCopyJsonVariables={handleCopyJsonVariables}
          />
        ) : (
          <HenryCanvasPreview
            selectedTemplateId={selectedTemplateId}
            compiledHtml={compiledHtml}
            zoomLevel={zoomLevel}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handlePrint={handlePrint}
            handleCopyEsignLink={handleCopyEsignLink}
            handleTriggerAiAutoFill={handleTriggerAiAutoFill}
          />
        )}
      </WorkspaceSplit>

      <HenryTenancyContractModal isOpen={isTenancyModalOpen} onClose={handleCloseTenancyModal} />
    </StudioContainer>
  );
};

export default HenryDocumentStudio;
