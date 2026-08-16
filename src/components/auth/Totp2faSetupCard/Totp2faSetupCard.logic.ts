import { useState, useCallback } from 'react';

export const DUMMY_SECRET = 'JBSWY3DPEHPK3PXP';
export const BACKUP_CODES = ['8921-4019', '3109-8471', '5029-1928', '7491-0284'];

export function useTotp2faSetupLogic() {
  const [token, setToken] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const verifyToken = useCallback(() => {
    if (token.length === 6) {
      setIsVerified(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Please enter a valid 6-digit TOTP security code.');
    }
  }, [token]);

  return {
    token,
    setToken,
    isVerified,
    errorMessage,
    verifyToken,
    secretKey: DUMMY_SECRET,
    backupCodes: BACKUP_CODES,
  };
}
