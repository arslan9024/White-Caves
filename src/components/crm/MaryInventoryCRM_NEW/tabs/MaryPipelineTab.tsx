import React from 'react';
import { InventoryDashboard } from '../../../../components/features/InventoryDashboard/InventoryDashboard';

/**
 * MaryPipelineTab
 *
 * Renders the intelligent inventory pipeline:
 * - 5-stage lifecycle (Draft → Verified → Under Offer → Leased/Sold → Handed Over)
 * - Document compliance alerts (Title Deed, Landlord Passport, Ejari)
 * - Live stats from /api/properties/inventory-stats
 */
const MaryPipelineTab: React.FC = () => {
  return <InventoryDashboard />;
};

MaryPipelineTab.displayName = 'MaryPipelineTab';

export default MaryPipelineTab;
