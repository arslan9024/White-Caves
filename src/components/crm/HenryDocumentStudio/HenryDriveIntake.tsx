import React, { useState } from 'react';
import type { DriveImport } from '../../../services/henryDrive';
import { genericDocumentRegistry, genericDocumentTypes, isGenericDocumentType } from '../../../../server/shared/henryDocumentRegistry';
import HenryGenericDocumentPanel from './HenryGenericDocumentPanel';
import HenryPassportScannerView from './HenryPassportScannerView';
import HenryTitleDeedScannerView from './HenryTitleDeedScannerView';
import HenryEmiratesIdScannerView from './HenryEmiratesIdScannerView';
import HenryTenancyContractScannerView from './HenryTenancyContractScannerView';

export default function HenryDriveIntake({ source }: { source: DriveImport }) {
  const [type, setType] = useState('');
  return <section aria-label="Drive original review destination">
    <h2>Choose the original's review category</h2>
    <p>Authenticated original loaded, not yet OCR-reviewed or saved. No category or ownership is inferred.
      Changing category discards the previous review. An imported vault copy is a historical snapshot.</p>
    <label>Drive original category<select value={type} onChange={event => setType(event.target.value)}>
      <option value="">Choose explicitly</option>
      <option value="emirates_id">Emirates ID</option><option value="passport">Passport</option>
      <option value="title_deed">Title deed</option><option value="tenancy_contract">Tenancy contract</option>
      {genericDocumentTypes.map(value => <option key={value} value={value}>{genericDocumentRegistry[value].label}</option>)}
    </select></label>
    {type === 'passport' && <HenryPassportScannerView key={type} importedSource={source} />}
    {type === 'emirates_id' && <HenryEmiratesIdScannerView key={type} importedSource={source} />}
    {type === 'title_deed' && <HenryTitleDeedScannerView key={type} importedSource={source} />}
    {type === 'tenancy_contract' && <HenryTenancyContractScannerView key={type} importedSource={source} />}
    {isGenericDocumentType(type) && <HenryGenericDocumentPanel key={type} importedSource={source} />}
  </section>;
}
