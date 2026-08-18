/** DocumentVersionHistory.logic.ts */
import { useState } from 'react';
export interface DocVersion { id: string; version: string; author: string; timestamp: string; changes: string; isCurrent?: boolean; }
const VERSIONS: DocVersion[] = [
  { id: 'v4', version: 'v4.0', author: 'Arsalan Malik', timestamp: '2026-08-15 14:30', changes: 'Updated commission clause to 2.5%. Added payment plan schedule.', isCurrent: true },
  { id: 'v3', version: 'v3.0', author: 'Sarah Johnson', timestamp: '2026-08-12 10:15', changes: 'Seller name correction. Property address updated with unit number.' },
  { id: 'v2', version: 'v2.0', author: 'Sarah Johnson', timestamp: '2026-08-10 09:00', changes: 'Added exclusivity clause. Corrected listing price from AED 2.2M to AED 2.5M.' },
  { id: 'v1', version: 'v1.0', author: 'System', timestamp: '2026-08-09 16:45', changes: 'Initial Form A generated from template.' },
];
export function useDocumentVersionHistoryLogic() {
  const [selectedVersion, setSelectedVersion] = useState<string>('v4');
  const selected = VERSIONS.find((v) => v.id === selectedVersion) ?? VERSIONS[0];
  return { VERSIONS, selectedVersion, setSelectedVersion, selected };
}
