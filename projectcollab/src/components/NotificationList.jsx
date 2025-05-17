import React, { useEffect, useState } from 'react';

const NotificationList = ({ userId, token }) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:7000/notifications/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setNotifications(data);
      } else {
        setError(data.error || 'Failed to fetch notifications');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  return (
    <div>
      <h2>Notifications</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {notifications.map((notif) => (
          <li key={notif._id}>{notif.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;