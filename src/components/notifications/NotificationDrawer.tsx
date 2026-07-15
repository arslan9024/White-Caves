import React, { useState, useEffect } from 'react';
import { X, Check, CheckCheck, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message?: string;
  body?: string;
  type: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

interface NotificationDrawerProps {
  onClose: () => void;
}

export function NotificationDrawer({ onClose }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications?page=${page}&pageSize=20`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        if (page === 1) {
          setNotifications(data.data);
        } else {
          setNotifications(prev => [...prev, ...data.data]);
        }
        setHasMore(data.pagination.page < data.pagination.totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`/api/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center p-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Mark all read
            </button>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && page === 1 ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>You're all caught up!</p>
            </div>
          ) : (
            <>
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${notif.read ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-100'}`}
                  onClick={() => {
                    if (!notif.read) markAsRead(notif.id);
                    if (notif.actionUrl) window.location.href = notif.actionUrl;
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3
                      className={`text-sm font-medium ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}
                    >
                      {notif.title}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{notif.message || notif.body}</p>
                </div>
              ))}

              {hasMore && (
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium text-center"
                >
                  Load More
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
