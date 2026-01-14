import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import TwoPaneLayout from '../../components/layout/TwoPaneLayout';
import { setUserInfo, setActiveRole } from '../../store/slices/accessControlSlice';
import './CRMWorkspacePage.css';

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const isOwnerAuthorized = (user) => {
  if (!user) return false;
  if (user.email === OWNER_EMAIL) return true;
  const storedRole = localStorage.getItem('userRole');
  if (storedRole) {
    try {
      const roleData = JSON.parse(storedRole);
      return roleData.role === 'owner' || roleData.role === 'md';
    } catch (e) {
      return false;
    }
  }
  return false;
};

export default function CRMWorkspacePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);

  useEffect(() => {
    if (import.meta.env.DEV) {
      dispatch(setUserInfo({
        userId: 'dev-user',
        userName: 'Development User',
        userEmail: 'dev@whitecaves.ae',
        userAvatar: null,
        role: 'owner'
      }));
      dispatch(setActiveRole('owner'));
      return;
    }

    if (!isOwnerAuthorized(user)) {
      navigate('/');
      return;
    }

    dispatch(setUserInfo({
      userId: user?.uid || user?.id || 'owner',
      userName: user?.displayName || 'Company Owner',
      userEmail: user?.email || '',
      userAvatar: user?.photoURL,
      role: 'owner'
    }));
    dispatch(setActiveRole('owner'));
  }, [user, navigate, dispatch]);

  return (
    <div className="crm-workspace-page">
      <TwoPaneLayout />
    </div>
  );
}
