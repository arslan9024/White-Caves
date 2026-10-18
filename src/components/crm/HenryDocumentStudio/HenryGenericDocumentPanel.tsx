import React from 'react';
import styled from 'styled-components';
import { genericDocumentRegistry, genericDocumentTypes, isGenericDocumentType } from '../../../../server/shared/henryDocumentRegistry';
import { genericReady } from '../../../services/henryGenericDocuments';
import { HenrySharedDocumentUploader } from './HenrySharedDocumentUploader';
import { HenryExtractionEvidence } from './HenryExtractionEvidence';
import HenryCaseLinks from './HenryCaseLinks';
import { useHenryGenericDocument } from './logic/useHenryGenericDocument';
import type { DriveImport } from '../../../services/henryDrive';

const Panel = styled.section`
  background: #FFFFFF; color: #1E293B; padding: 1rem; border: 1px solid #CBD5E1;
  border-radius: 8px; margin-block: 1rem;
  label { display: block; margin-block: 0.75rem; }
  input, select { max-width: 100%; padding: 0.4rem; }
  button { cursor: pointer; }
  button:disabled { cursor: default; }
`;
export default function HenryGenericDocumentPanel({ importedSource }: { importedSource?: DriveImport | null }) {
  const state = useHenryGenericDocument(importedSource);
  const scan = state.scan;
  return <Panel aria-label="Reviewed document intake">
    <h2>Reviewed document intake</h2>
    <p>Ejari, trade licences, company documents, NOCs, agency forms, sale agreements, invoices, receipts and cheques.
      Local OCR/native PDF text only. Labelled fields only; unmatched layouts require manual entry from the original.
      No government, signature, payment, bank clearance, VAT or legal verification is performed.</p>
    <HenrySharedDocumentUploader title="Upload another document type" subtitle="PDF, PNG or JPEG; original at most 4 MB."
      isProcessing={state.busy} onFileUpload={state.upload} onDiscard={state.reset}
      onFileSelected={state.invalidate} maxFileSizeMb={4} resetSignal={state.resetSignal} />
    {state.busy && <p role="status">Processing current document…</p>}
    {state.error && <p role="alert">{state.error}</p>}
    {state.message && <p role="status">{state.message}</p>}
    {state.text === null && !state.busy && <p>No source loaded. Upload an original to choose a type and review its exact fields.</p>}
    {state.text !== null && <>
      {state.sourceUrl && <p><a href={state.sourceUrl} target="_blank" rel="noopener noreferrer">
        Open immutable original for comparison
      </a></p>}
      {state.sourceUrl && state.source?.type.startsWith('image/') &&
        <img src={state.sourceUrl} alt="Current original document for review" style={{ maxWidth: '100%', maxHeight: 400 }} />}
      <p>{state.candidates.length ? `Text-marker candidates: ${state.candidates.map(candidate =>
        `${genericDocumentRegistry[candidate.type].label} (${candidate.score})`).join(', ')}.`
        : 'No strong type marker found.'} Always choose the category explicitly; candidates are not verification.</p>
      {!state.text.trim() && <p role="alert">No readable extraction text. Enter only fields you can read on the original, or rescan.</p>}
      <label>Document category<select aria-label="Document category" value={scan?.documentType || ''} disabled={state.busy}
        onChange={event => state.chooseType(isGenericDocumentType(event.target.value) ? event.target.value : '')}>
        <option value="">Choose document type</option>
        {genericDocumentTypes.map(type => <option key={type} value={type}>{genericDocumentRegistry[type].label}</option>)}
      </select></label>
    </>}
    {scan && <>
      <p>Supported fields below are the complete scope for this category. Required fields marked *.
        Dates: DD/MM/YYYY; financial total: AED, zero permitted. References must be transcribed exactly, never invented.
        A cheque number is never evidence of payment.</p>
      <fieldset disabled={state.busy}><legend>{genericDocumentRegistry[scan.documentType].label} review</legend>
        {genericDocumentRegistry[scan.documentType].fields.map(spec => <label key={spec.key}>
          {spec.label}{spec.required && ' *'}
          <input aria-label={spec.label} value={scan.values[spec.key] ?? ''} maxLength={500}
            aria-invalid={scan.missingFields.includes(spec.key)}
            onChange={event => state.edit(spec.key, event.target.value)} />
          {scan.missingFields.includes(spec.key) && <span> Missing or invalid; compare original.</span>}
          {scan.diagnostics.fields[spec.key].state === 'conflict' && <span role="alert">
            Conflicting source values: {scan.diagnostics.fields[spec.key].values.join(' | ')}. Edit to resolve from original.</span>}
        </label>)}
        <HenryCaseLinks key={`${state.resetSignal}-${scan.documentType}`} options={state.options} onOptions={state.setOptions} />
        <label><input type="checkbox" checked={scan.reviewConfirmed} onChange={event => state.confirm(event.target.checked)} />
          I compared every field and category with this original; this confirms transcription only, not authenticity or signature.</label>
        <button type="button" disabled={!genericReady(scan)} onClick={() => void state.save()}>
          Save reviewed original to encrypted vault
        </button>
      </fieldset>
      <HenryExtractionEvidence diagnostics={scan.diagnostics} />
    </>}
  </Panel>;
}
