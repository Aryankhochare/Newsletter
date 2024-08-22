// import React, { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import jwt from 'jsonwebtoken';
// import { apiLinks } from '@/utils/constants';

// interface Notification {
//     notificationId: string;
//     senderId: string;
//     recieverId: string;
//     message: string;
//     isRead: boolean;
//     notificationType: string;
//     createdAt: Date;
// }

// interface NotificationProps {
//   unreadCount: number;
//   setUnreadNotificationCount: React.Dispatch<React.SetStateAction<number>>;
// }

// const Notification: React.FC<NotificationProps> = ({ unreadCount, setUnreadNotificationCount }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const { data: session } = useSession();

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       if (session?.accessToken) {
//         const decodedToken = jwt.decode(session.accessToken) as { sub: string };
//         const userId = decodedToken.sub;
//         const response = await fetch(`${apiLinks.notfication.fetch}/${userId}`);

//         const data = await response.json();
//         console.log(data);
        
//         setNotifications(data);
//         setUnreadNotificationCount(data.filter((n : any) => !n.IsRead).length);
//       }
//     };
//     fetchNotifications();
//   }, [session?.accessToken]);

//   const toggleNotifications = () => {
//     setIsOpen(!isOpen);
//   };

// //   const markAsRead = async (notificationId: string) => {
// //     await fetch(`/api/notifications/${notificationId}/read`, {
// //       method: 'PUT',
// //     });
// //     setNotifications(notifications.map((n) => (n.NotificationId === notificationId ? { ...n, IsRead: true } : n)));
// //     setUnreadNotificationCount(notifications.filter((n) => !n.IsRead).length);
// //   };

//   return (
//     <div className="relative">
//       <button
//         className="text-white p-2"
//         onClick={toggleNotifications}
//       >
//         Notifications
//         {unreadCount > 0 && (
//           <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
//             {unreadCount}
//           </span>
//         )}
//       </button>
//       {isOpen && (
//         <div className="absolute top-full right-0 text-black bg-white shadow-lg p-4 mt-2 w-64">
//           {notifications.length === 0 ? (
//             <p>No new notifications</p>
//           ) : (
//             <ul>
//               {notifications.map((notification) => (
//                 <li
//                   key={notification.notificationId}
//                   className={`mb-2 p-2 rounded-md ${!notification.isRead ? 'bg-gray-200' : ''}`}
//                 >
//                   <div className="flex justify-between items-center">
//                     <p className='text-gray-800'>{notification.message || 'No message'}</p>
//                     {!notification.isRead && (
//                       <button
//                         className="text-gray-500 hover:text-gray-700"
//                         // onClick={() => markAsRead(notification.NotificationId)}
//                       >
//                         Mark as read
//                       </button>
//                     )}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notification;

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import jwt from 'jsonwebtoken';
import { apiLinks } from '@/utils/constants';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

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
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (session?.accessToken) {
        const decodedToken = jwt.decode(session.accessToken) as { sub: string };
        const userId = decodedToken.sub;
        const response = await fetch(`${apiLinks.notfication.fetch}/${userId}`);
        const data = await response.json();
        console.log(data);
        
        setNotifications(data);
        setUnreadNotificationCount(data.filter((n: any) => !n.IsRead).length);
      }
    };
    fetchNotifications();
  }, [session?.accessToken]);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

//   const markAsRead = async (notificationId: string) => {
//     await fetch(`/api/notifications/${notificationId}/read`, {
//       method: 'PUT',
//     });
//     setNotifications(notifications.map((n) => (n.NotificationId === notificationId ? { ...n, IsRead: true } : n)));
//     setUnreadNotificationCount(notifications.filter((n) => !n.IsRead).length);
//   };

  return (
    <div className="relative">
      <button className="text-white p-2" onClick={toggleNotifications}>
        Notifications
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute top-full right-0  text-black bg-white shadow-lg  border-4 border-red-900 rounded-lg p-8 mt-5 w-64">
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification.notificationId}
                  className={`mb-2 p-2 rounded-md ${!notification.isRead ? 'bg-gray-200' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-gray-800">{notification.message || 'No message'}</p>
                    {!notification.isRead && (
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        // onClick={() => markAsRead(notification.NotificationId)}
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
      {selectedNotification && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Notification
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{selectedNotification.message}</p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  );
};

export default Notification;