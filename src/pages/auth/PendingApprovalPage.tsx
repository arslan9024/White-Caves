import React, { FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import type { RootState } from '../../store/store';
import { setUser } from '../../store/userSlice';
import { auth } from '../../config/firebase';
import { createLogger } from '../../utils/logger';
import { safeStorage } from '../../utils/safeStorage';

const log = createLogger('PendingApproval');
import { signOut } from 'firebase/auth';
import './AuthPages.css';

// Type definitions
interface UserData {
  role: string;
  status: string;
  locked?: boolean;
}

interface PendingApprovalUser {
  id?: string;
  name?: string;
  email?: string;
  photo?: string;
}

interface RoleLabels {
  [key: string]: string;
}

const PendingApprovalPage: FC = () => {
  useDocumentTitle('Pending Approval');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser) as PendingApprovalUser | null;
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect((): void => {
    if (!user) {
      navigate('/signin');
      return;
    }
    
    const stored = safeStorage.getJSON<UserData>('userRole');
    if (stored) {
      if (stored.status !== 'pending') {
        navigate(`/${stored.role}/dashboard`);
        return;
      }
      setUserData(stored);
    }
  }, [user, navigate]);

  const handleLogout = async (): Promise<void> => {
    try {
      if (auth) await signOut(auth);
      safeStorage.remove('userRole');
      dispatch(setUser(null));
      navigate('/');
    } catch (error) {
      log.error('Logout error:', error);
    }
  };

  const getRoleLabel = (role: string): string => {
    const labels: RoleLabels = {
      'leasing-agent': 'Leasing Agent',
      'secondary-sales-agent': 'Sales Agent',
      'team-leader': 'Team Leader'
    };
    return labels[role] || role;
  };

  if (!user || !userData) {
    return null;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-logo">
          <img src="/company-logo.jpg" alt="White Caves" width={60} height={60} loading="lazy" />
          <span>White Caves</span>
        </Link>

        <div className="auth-card pending-card">
          <div className="pending-icon">⏳</div>
          <h1>Pending Approval</h1>
          <p className="auth-subtitle">
            Your staff account is awaiting admin approval
          </p>

          <div className="pending-details">
            <div className="detail-row">
              <span className="detail-label">Name</span>
              <span className="detail-value">{user.name || 'Not provided'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span className="detail-value">{user.email || 'Not provided'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Role Requested</span>
              <span className="detail-value">{getRoleLabel(userData.role)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className="detail-value status-pending">Pending Review</span>
            </div>
          </div>

          <div className="pending-info">
            <p>Our team will review your application and verify your credentials. You'll receive an email notification once your account is approved.</p>
            <p>This typically takes 1-2 business days.</p>
          </div>

          <div className="pending-actions">
            <Link to="/" className="btn btn-secondary">
              Browse Properties
            </Link>
            <button onClick={handleLogout} className="btn btn-link">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingApprovalPage;
