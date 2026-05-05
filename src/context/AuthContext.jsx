import { useMemo } from 'react';

export const useAuth = () => {
  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem('white-caves-user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  return { user };
};

export default useAuth;
