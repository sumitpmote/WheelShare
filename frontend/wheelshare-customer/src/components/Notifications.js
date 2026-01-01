import React, { useState, useEffect } from 'react';
import { notificationsAPI } from '../api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll();
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.notificationId === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Info': '📢',
      'Success': '✅',
      'Warning': '⚠️',
      'Error': '❌',
      'Booking': '🎫',
      'Ride': '🚗'
    };
    return icons[type] || '📢';
  };

  const getTypeClass = (type) => {
    const classes = {
      'Info': 'border-info',
      'Success': 'border-success',
      'Warning': 'border-warning',
      'Error': 'border-danger',
      'Booking': 'border-primary',
      'Ride': 'border-secondary'
    };
    return classes[type] || 'border-info';
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Notifications</h2>
        <span className="badge bg-primary">
          {notifications.filter(n => !n.isRead).length} unread
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">No notifications</h4>
          <p className="text-muted">You're all caught up!</p>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8 mx-auto">
            {notifications.map(notification => (
              <div
                key={notification.notificationId}
                className={`card mb-3 ${getTypeClass(notification.type)} ${
                  !notification.isRead ? 'bg-light' : ''
                }`}
                style={{ borderLeftWidth: '4px' }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <span className="me-2" style={{ fontSize: '1.2em' }}>
                          {getTypeIcon(notification.type)}
                        </span>
                        <h6 className="mb-0 fw-bold">
                          {notification.title}
                        </h6>
                        {!notification.isRead && (
                          <span className="badge bg-primary ms-2">New</span>
                        )}
                      </div>
                      <p className="card-text mb-2">
                        {notification.message}
                      </p>
                      <small className="text-muted">
                        {new Date(notification.createdAt).toLocaleString()}
                      </small>
                    </div>
                    {!notification.isRead && (
                      <button
                        className="btn btn-sm btn-outline-primary ms-3"
                        onClick={() => markAsRead(notification.notificationId)}
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;