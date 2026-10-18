import { useEffect, useRef, useState } from 'react';
import { askDossier, attachDossierDocument, changeDocumentStatus, downloadHenryOriginal, readDossier, readDossierDocument,
  type Dossier, type DossierAnswer, type DossierKind, type DossierRow } from '../../../../services/henryOperations';

export function useHenryDossier(kind: DossierKind, id: string) {
  const [data, setData] = useState<Dossier | null>(null);
  const [answer, setAnswer] = useState<DossierAnswer | null>(null);
  const [candidate, setCandidate] = useState<DossierRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const revision = useRef(0);
  useEffect(() => {
    revision.current++;
    setData(null); setAnswer(null); setCandidate(null); setBusy(false); setError('');
    return () => { revision.current++; };
  }, [kind, id]);
  const run = async (work: (current: () => boolean) => Promise<void>) => {
    const version = ++revision.current;
    const current = () => version === revision.current;
    setBusy(true); setError('');
    try { await work(current); }
    catch (cause) {
      if (current()) { setData(null); setAnswer(null); setCandidate(null);
        setError(cause instanceof Error ? cause.message : 'Dossier unavailable. Retry.'); }
    } finally { if (current()) setBusy(false); }
  };
  const load = () => run(async current => {
    setData(null); setAnswer(null); setCandidate(null);
    const result = await readDossier(kind, id);
    if (current()) setData(result);
  });
  const ask = (question: string) => run(async current => {
    setAnswer(null);
    const result = await askDossier(kind, id, question);
    if (current()) setAnswer(result);
  });
  const changeStatus = (row: DossierRow) => run(async current => {
    setAnswer(null);
    await changeDocumentStatus(row);
    if (!current()) return;
    const result = await readDossier(kind, id);
    if (current()) setData(result);
  });
  const previewLink = (documentId: string) => run(async current => {
    setCandidate(null);
    const result = await readDossierDocument(documentId);
    if (current()) setCandidate({ ...result, referenceNumber: `••••${result.referenceNumber.slice(-4)}` });
  });
  const attach = () => run(async current => {
    if (!candidate) throw new Error('Load an authorized document first.');
    await attachDossierDocument(candidate, kind, id);
    if (!current()) return;
    setCandidate(null); setAnswer(null);
    const result = await readDossier(kind, id);
    if (current()) setData(result);
  });
  const downloadOriginal = (documentId: string, side = 0) =>
    run(current => downloadHenryOriginal(documentId, side, current));
  return { data, answer, candidate, busy, error, load, ask, changeStatus, previewLink, attach, downloadOriginal };
}
