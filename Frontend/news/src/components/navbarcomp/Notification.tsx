import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import jwt from 'jsonwebtoken';
import { apiLinks } from '@/utils/constants';

interface Notification {
    notificationId: string;
    senderId: string;
    recieverId: string;
    message: string;
    isRead: boolean;
    notificationType: string;
    createdAt: Date;
}

interface NotificationProps {
  unreadCount: number;
  setUnreadNotificationCount: React.Dispatch<React.SetStateAction<number>>;
}

const Notification: React.FC<NotificationProps> = ({ unreadCount, setUnreadNotificationCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (session?.accessToken) {
        const decodedToken = jwt.decode(session.accessToken) as { sub: string };
        const userId = decodedToken.sub;
        const response = await fetch(`${apiLinks.notfication.fetch}/${userId}`);

        const data = await response.json();
        
        setNotifications(data);
        setUnreadNotificationCount(data.filter((n : any) => !n.IsRead).length);
      }
    };
    fetchNotifications();
  }, [session?.accessToken]);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`${apiLinks.notfication.fetch}/${notificationId}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error marking notification as read: ${response.status} - ${response.statusText}`);
      }
  
      setNotifications(notifications.filter((n) => n.notificationId !== notificationId));
      setUnreadNotificationCount(notifications.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error('Error marking notification as read:', error);
  
    }
  };

  return (
    <div className="relative">
      <button
        className="text-white p-2"
        onClick={toggleNotifications}
      >
        Notifications
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 text-black bg-white shadow-lg p-4 mt-2 w-64">
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification.notificationId}
                  className={`mb-2 p-2 rounded-md ${!notification.isRead ? 'bg-gray-200' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <p className='text-gray-800'>{notification.message || 'No message'}</p>
                    {!notification.isRead && (
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => markAsRead(notification.notificationId)}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;