/**
 * Toast Notification System
 * 
 * Features:
 * - Toast notifications with auto-dismiss
 * - Multiple notification types (success, error, warning, info)
 * - Stack management (max 5 notifications)
 * - Smooth animations
 * - Click to dismiss
 * - Auto-dismiss timer
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Check, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { removeNotification } from '../../store/slices/notificationSlice';
import './Toast.css';

const Toast = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications?.notifications || []);

  useEffect(() => {
    // Set auto-dismiss timers for each notification
    const timers = notifications.map(notif => {
      return setTimeout(() => {
        dispatch(removeNotification(notif.id));
      }, notif.duration || 3000);
    });

    return () => {
      // Clear all timers on cleanup
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications, dispatch]);

  if (notifications.length === 0) {
    return null;
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <Check size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className="toast-container">
      {notifications.map(notif => (
        <div
          key={notif.id}
          className={`toast toast-${notif.type}`}
          role="alert"
          aria-live="polite"
        >
          <div className="toast-icon">
            {getIcon(notif.type)}
          </div>
          <div className="toast-content">
            {notif.title && <div className="toast-title">{notif.title}</div>}
            {notif.message && <div className="toast-message">{notif.message}</div>}
          </div>
          <button
            className="toast-close"
            onClick={() => dispatch(removeNotification(notif.id))}
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
