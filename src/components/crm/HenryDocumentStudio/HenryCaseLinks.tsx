import React, { useState } from 'react';
import type { VaultSaveOptions } from '../../../services/henryScanReview';
import HenryCrmLinkSelector from './HenryCrmLinkSelector';

const fields = { lead: 'leadId', property: 'propertyId', tenancy: 'tenancyId', transaction: 'transactionId' } as const;
export default function HenryCaseLinks({ options, onOptions, additionalOnly = false }: {
  options: VaultSaveOptions; onOptions: (value: VaultSaveOptions) => void; additionalOnly?: boolean;
}) {
  const [pending, setPending] = useState<VaultSaveOptions>({});
  const [confirmed, setConfirmed] = useState(false);
  const kinds = additionalOnly ? ['tenancy', 'transaction'] as const : ['lead', 'property', 'tenancy', 'transaction'] as const;
  return <fieldset>
    <legend>Optional dossier links (client = assigned lead)</legend>
    {kinds.map(kind => <HenryCrmLinkSelector key={kind} kind={kind} value={pending[fields[kind]] || ''}
      onChange={id => {
        setPending({ ...pending, [fields[kind]]: id || undefined });
        setConfirmed(false);
        onOptions({ ...options, ...Object.fromEntries(kinds.map(key => [fields[key], undefined])) });
      }} />)}
    <label><input type="checkbox" checked={confirmed && kinds.every(kind => options[fields[kind]] === pending[fields[kind]])} onChange={event => {
      setConfirmed(event.target.checked);
      onOptions({ ...options, ...Object.fromEntries(kinds.map(kind =>
        [fields[kind], event.target.checked ? pending[fields[kind]] : undefined])) });
    }} />Confirm selected dossier links; the server checks every entity</label>
  </fieldset>;
}
