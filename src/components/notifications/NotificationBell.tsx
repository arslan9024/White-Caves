import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    // In a real app we would subscribe to Socket.io here:
    // socket.on('notification', () => fetchUnreadCount());
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/notifications/unread-count', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch unread notifications count:', err);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    fetchUnreadCount();
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors"
        aria-label="Open notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && <NotificationDrawer onClose={handleClose} />}
    </>
  );
}
