import { useEffect, useRef } from 'react';
import type { DriveImport } from '../../../../services/henryDrive';

/** Deliver an explicitly selected original once; scanner reset/review logic remains authoritative. */
export function useDriveScannerIntake(source: DriveImport | undefined, upload: (file: File) => Promise<void>) {
  const latest = useRef(upload);
  useEffect(() => { latest.current = upload; }, [upload]);
  useEffect(() => {
    if (source) void latest.current(source.file);
  }, [source]);
}
