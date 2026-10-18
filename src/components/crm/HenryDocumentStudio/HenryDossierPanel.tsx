import React, { useState } from 'react';
import styled from 'styled-components';
import { dossierQuestions, type DossierKind, type DossierRow } from '../../../services/henryOperations';
import HenryCrmLinkSelector from './HenryCrmLinkSelector';
import { useHenryDossier } from './logic/useHenryDossier';
import { signatureDocumentTypes } from '../../../../server/shared/henryDocumentRegistry';
import HenryDriveDossier from './HenryDriveDossier';

const Panel = styled.section`
  padding: 1rem; background: #FFFFFF; color: #1E293B; border: 1px solid #1E293B;
  border-radius: 8px; overflow-wrap: anywhere;
  button { background: #EF4444; color: #FFFFFF; border: 0; border-radius: 4px;
    padding: 0.5rem; margin: 0.25rem; cursor: pointer; }
  button:disabled { opacity: 0.55; cursor: default; }
  label { display: block; margin-block: 0.5rem; }
  blockquote { white-space: pre-wrap; }
`;
function DossierContents({ kind, id }: { kind: DossierKind; id: string }) {
  const state = useHenryDossier(kind, id);
  const [question, setQuestion] = useState<string>('missing_documents');
  const [confirmation, setConfirmation] = useState<DossierRow | null>(null);
  const [documentId, setDocumentId] = useState('');
  return <>
    <button type="button" disabled={state.busy} onClick={() => { setConfirmation(null); void state.load(); }}>Load dossier</button>
    {state.busy && <p role="status">Loading dossier operation…</p>}
    {state.error && <p role="alert">{state.error}</p>}
    {!state.data && !state.busy && !state.error && <p>Load the selected authorized dossier to see its checklist.</p>}
    {state.data && <>
      {!state.data.complete && <p role="alert">Partial result: newest 100 active documents only. Missing and latest answers are not conclusive.</p>}
      <h3>Workflow checklist</h3>
      <p>Evidence inventory, not legal compliance or authenticity approval.</p>
      <ul>{state.data.checklist.map(item => <li key={item.requirement}>
        {item.requirement}: {item.status} ({item.acceptedTypes.join(' or ')})
      </li>)}</ul>
      <p>Unsupported requirements — manual handling still required: {state.data.unsupportedRequirements.join(', ')}. Not counted as complete.</p>
      <h3>Active documents</h3>
      {!state.data.active.length && <p>No active documents linked to this dossier.</p>}
      <ul>{state.data.active.map(row => <li key={row.id}>
        {row.docType} · {row.referenceNumber} · {row.lifecycleStatus}
        {row.lifecycleStatus === 'signed' && ' (user-attested, not verified)'}
        {' · Document '}{row.id}
        {signatureDocumentTypes.includes(row.docType) && <button type="button" disabled={state.busy}
          onClick={() => setConfirmation(row)}>Change status for {row.referenceNumber}</button>}
      </li>)}</ul>
      {confirmation && <div role="group" aria-label="Confirm lifecycle change">
        <p>{confirmation.lifecycleStatus === 'signed' ? 'Revert to draft' : 'Attest this agreement is signed'} for {confirmation.referenceNumber}?
          This is your attestation only, not signature verification or approval.</p>
        <button type="button" disabled={state.busy} onClick={() => {
          setConfirmation(null); void state.changeStatus(confirmation);
        }}>Confirm status change</button>
        <button type="button" onClick={() => setConfirmation(null)}>Cancel status change</button>
      </div>}
      <h3>Superseded originals (not checklist evidence)</h3>
      {!state.data.historyComplete && <p>History truncated to newest 100 superseded records.</p>}
      {!state.data.superseded.length && <p>No superseded documents in this result.</p>}
      <ul>{state.data.superseded.map(row => <li key={row.id}>{row.docType} · {row.referenceNumber} · {row.id}</li>)}</ul>
      <label>Read-only assistance question<select value={question} onChange={e => setQuestion(e.target.value)}>
        {Object.entries(dossierQuestions).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </select></label>
      <button type="button" disabled={state.busy} onClick={() => void state.ask(question)}>Ask about this dossier</button>
    </>}
    {state.answer && <section aria-label="Dossier answer">
      <p>{state.answer.message}</p>
      <ul>{state.answer.checklist.map(item => <li key={item.requirement}>{item.requirement}: {item.status}</li>)}</ul>
      {!!state.answer.unsupportedRequirements.length && <p>Not recognized: {state.answer.unsupportedRequirements.join(', ')}</p>}
      {state.answer.citations.map(citation => <article key={`${citation.documentId}-${citation.field}`}>
        <p>Document {citation.documentId} · {citation.field} · reviewer-provided: {citation.value}</p>
        {citation.passages.map((passage, index) => <blockquote key={index}>OCR/native-PDF quote: {passage.text}</blockquote>)}
        <p>{citation.evidenceNote}</p>
        <button type="button" disabled={state.busy} onClick={() => void state.downloadOriginal(citation.documentId)}>
          Download cited original
        </button>
        {state.data?.active.some(row => row.id === citation.documentId && row.docType === 'emirates_id') &&
          <button type="button" disabled={state.busy} onClick={() => void state.downloadOriginal(citation.documentId, 1)}>
            Download cited original back
          </button>}
      </article>)}
    </section>}
    <fieldset disabled={state.busy}>
      <legend>Attach an existing vault record to this dossier</legend>
      <label>Approved vault document ID<input value={documentId} onChange={e => setDocumentId(e.target.value)} /></label>
      <button type="button" disabled={!/^[a-f0-9]{24}$/i.test(documentId)} onClick={() => void state.previewLink(documentId)}>Load document for linking</button>
      {state.candidate && state.candidate.id === documentId && <p>{state.candidate.docType} · {state.candidate.referenceNumber} · {state.candidate.id}
        <button type="button" onClick={() => void state.attach()}>Confirm link to selected dossier</button>
      </p>}
    </fieldset>
    <HenryDriveDossier key={`${kind}:${id}`} kind={kind} id={id} />
  </>;
}
export default function HenryDossierPanel() {
  const [kind, setKind] = useState<DossierKind>('client');
  const [id, setId] = useState('');
  return <Panel aria-label="Henry operations dossiers">
    <h2>Henry operations dossiers</h2>
    <p>Owner-scoped encrypted vault. No company-wide search. Assistance never writes CRM data or shares documents.
      Approvals, external sharing, token links and provider verification are deferred, not available here.</p>
    <label>Dossier type<select value={kind} onChange={e => { setKind(e.target.value as DossierKind); setId(''); }}>
      <option value="client">Client (assigned lead)</option><option value="property">Property</option>
      <option value="tenancy">Tenancy (owned property)</option><option value="transaction">Transaction (assigned agent)</option>
    </select></label>
    <HenryCrmLinkSelector kind={kind === 'client' ? 'lead' : kind} value={id} onChange={setId} />
    {id ? <DossierContents key={`${kind}:${id}`} kind={kind} id={id} /> : <p>Select an authorized record to open its dossier.</p>}
  </Panel>;
}
