/** DocumentShareLinkGenerator.logic.ts */
import { useState, useCallback } from 'react';

export type ExpiryOption = '24h' | '7d' | '30d' | 'never';

function generateToken(): string {
  return Array.from({ length: 24 }, () => Math.random().toString(36)[2]).join('');
}

export function useDocumentShareLinkGeneratorLogic() {
  const [expiry, setExpiry] = useState<ExpiryOption>('7d');
  const [requirePin, setRequirePin] = useState(false);
  const [link, setLink] = useState('');
  const [pin, setPin] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    const token = generateToken();
    const generatedPin = requirePin ? Math.floor(1000 + Math.random() * 9000).toString() : '';
    setLink(`https://docs.whitecaves.ae/share/${token}?exp=${expiry}`);
    setPin(generatedPin);
    setCopied(false);
  }, [expiry, requirePin]);

  const handleCopy = useCallback(async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [link]);

  const EXPIRY_LABELS: Record<ExpiryOption, string> = { '24h': '24 Hours', '7d': '7 Days', '30d': '30 Days', never: 'No Expiry' };

  return { expiry, setExpiry, requirePin, setRequirePin, link, pin, copied, handleGenerate, handleCopy, EXPIRY_LABELS };
}
