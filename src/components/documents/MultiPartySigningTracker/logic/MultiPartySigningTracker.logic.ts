/** MultiPartySigningTracker.logic.ts */
import { useState, useCallback } from 'react';

export type SignerRole = 'Buyer' | 'Seller' | 'Agent' | 'Witness' | 'Notary';
export type SignerStatus = 'pending' | 'sent' | 'opened' | 'signed' | 'declined';

export interface Signer { id: string; role: SignerRole; name: string; email: string; status: SignerStatus; signedAt?: string; }

const INITIAL_SIGNERS: Signer[] = [
  { id: 'sg1', role: 'Seller', name: 'Ahmed Al Mansouri', email: 'ahmed@example.com', status: 'signed', signedAt: '2026-08-15 14:22' },
  { id: 'sg2', role: 'Buyer', name: 'Emma Johnson', email: 'emma@example.com', status: 'opened' },
  { id: 'sg3', role: 'Agent', name: 'Sarah Johnson', email: 'sarah@whitecaves.ae', status: 'signed', signedAt: '2026-08-15 09:30' },
  { id: 'sg4', role: 'Witness', name: 'Rajiv Sharma', email: 'rajiv@example.com', status: 'sent' },
  { id: 'sg5', role: 'Notary', name: 'Dubai Trustee Office', email: 'trustee@dld.gov.ae', status: 'pending' },
];

const STATUS_ACTIONS: Partial<Record<SignerStatus, SignerStatus>> = { pending: 'sent', sent: 'opened', opened: 'signed' };

export function useMultiPartySigningTrackerLogic() {
  const [signers, setSigners] = useState<Signer[]>(INITIAL_SIGNERS);

  const advanceStatus = useCallback((id: string) => {
    setSigners((prev) => prev.map((s) => {
      if (s.id !== id) return s;
      const next = STATUS_ACTIONS[s.status];
      if (!next) return s;
      return { ...s, status: next, signedAt: next === 'signed' ? new Date().toLocaleString('en-AE') : s.signedAt };
    }));
  }, []);

  const signedCount = signers.filter((s) => s.status === 'signed').length;
  const allSigned = signedCount === signers.length;

  return { signers, advanceStatus, signedCount, allSigned };
}
