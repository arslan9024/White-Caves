import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthModal from '../../components/auth/AuthModal';

/** Route adapter over the shared authentication flow used by modal entrypoints. */
const SignInPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AuthModal
      mode={location.pathname === '/signup' ? 'signup' : 'signin'}
      presentation="page"
      onClose={() => navigate('/', { replace: true })}
    />
  );
};

export default SignInPage;
