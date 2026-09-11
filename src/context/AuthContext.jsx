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

  const logout = () => {
    localStorage.removeItem('white-caves-user');
    window.location.href = '/login';
  };

  return { user, logout };
};

export default useAuth;
