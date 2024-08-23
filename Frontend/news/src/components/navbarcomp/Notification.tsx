
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import jwt from 'jsonwebtoken';
import { apiLinks } from '@/utils/constants';
import Modal from '../Modal';

interface Notification {
  notificationId: string;
  senderId: string;
  recieverId: string;
  message: string;
  isRead: boolean;
  notificationType: string;
  createdAt: Date;
}

interface decodedToken {
  sub: string;
  email: string;
}

interface NotificationProps {
  unreadCount: number;
  setUnreadNotificationCount: React.Dispatch<React.SetStateAction<number>>;
}

const Notification: React.FC<NotificationProps> = ({ unreadCount, setUnreadNotificationCount }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const { data: session } = useSession();
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (session?.accessToken) {
        const decodedToken = jwt.decode(session.accessToken) as decodedToken;
        const userId = decodedToken.sub.toString();
        const email = decodedToken.email.toString();
        const response = await fetch(`${apiLinks.notfication.fetch}/${userId}`);

        const data = await response.json();

        setNotifications(data);
        setUnreadNotificationCount(data.filter((n: any) => !n.isRead).length);
      }
    };
    fetchNotifications();
  }, [session?.accessToken]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`${apiLinks.notfication.fetch}/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
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

  const truncateText = (text:string, wordLimit:number) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  const openModal = (notification:Notification) => {
    setSelectedNotification(notification);
  };

  const closeModal = () => {
    setSelectedNotification(null);
  };

  return (
    <div className="relative" ref = {notificationRef}>
      <button
        className="text-white p-2"
        onClick={toggleNotifications}
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="fixed inset-x-0 rounded-md top-16 sm:right-0 sm:left-auto sm:absolute sm:top-full text-black bg-white shadow-lg p-4 mt-2 w-full sm:w-80 md:w-96 max-h-[80vh] overflow-y-auto z-50 scrollbar-hide">
          {notifications.length === 0 ? (
            <p className="text-center">No new notifications</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((notification) => (
                <li
                  key={notification.notificationId}
                  className={`p-3 rounded-md ${!notification.isRead ? 'bg-gray-100' : ''} cursor-pointer hover:bg-gray-50 transition-colors duration-150`}
                  onClick={() => openModal(notification)}
                >
                  <div className="flex justify-between items-center">
                    <p className='text-gray-800 text-sm sm:text-base'>
                      {truncateText(notification.message || 'No message', 8)}
                    </p>
                    {!notification.isRead && (
                      <button
                        className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.notificationId);
                        }}
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
      <Modal
        isOpen={!!selectedNotification}
        onClose={closeModal}
        message={selectedNotification?.message || 'No message'}
      />
    </div>
  );
};

export default Notification;




