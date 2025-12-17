import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import './AuthPages.css';

export default function PendingApprovalPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    
    const stored = localStorage.getItem('userRole');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.status !== 'pending') {
        navigate(`/${parsed.role}/dashboard`);
        return;
      }
      setUserData(parsed);
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userRole');
      dispatch(setUser(null));
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoleLabel = (role) => {
    const labels = {
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
          <img src="/company-logo.jpg" alt="White Caves" />
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
