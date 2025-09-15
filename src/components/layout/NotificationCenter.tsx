import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, BellOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  content: string;
  link_to_context?: string;
  timestamp: string;
  is_read: boolean;
  is_seen: boolean;
}

interface NotificationResponse {
  notifications: Notification[];
  unread_count: number;
}

// Mock API functions
const mockNotifications: Notification[] = [
  // Empty array - no notifications on first visit
];

const fetchNotifications = async (): Promise<NotificationResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const unread_count = mockNotifications.filter(n => !n.is_seen).length;
  
  return {
    notifications: mockNotifications.slice(0, 10),
    unread_count
  };
};

const markNotificationsAsSeen = async (): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Mark all notifications as seen
  mockNotifications.forEach(notification => {
    notification.is_seen = true;
  });
};

const markNotificationAsRead = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const notification = mockNotifications.find(n => n.id === id);
  if (notification) {
    notification.is_read = true;
  }
};

const markAllAsRead = async (): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  mockNotifications.forEach(notification => {
    notification.is_read = true;
  });
};

const formatTimestamp = (timestamp: string): string => {
  const now = new Date();
  const notificationTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Vừa xong';
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Hôm qua';
  if (diffInDays < 7) return `${diffInDays} ngày trước`;
  
  return notificationTime.toLocaleDateString('vi-VN');
};

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Load notifications
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetchNotifications();
      setNotifications(response.notifications);
      setUnreadCount(response.unread_count);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle panel open/close
  const togglePanel = async () => {
    if (!isOpen) {
      setIsOpen(true);
      await loadNotifications();
      // Mark as seen when opening panel
      if (unreadCount > 0) {
        await markNotificationsAsSeen();
        setUnreadCount(0);
      }
    } else {
      setIsOpen(false);
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markNotificationAsRead(notification.id);
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      );
    }
    
    // Navigate to context (would use router in real app)
    if (notification.link_to_context) {
      console.log('Navigate to:', notification.link_to_context);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current && 
        buttonRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Load initial data
  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button
        ref={buttonRef}
        onClick={togglePanel}
        className={cn(
          "relative p-2 rounded-lg transition-all duration-300 ease-out",
          "hover:bg-white/15 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30",
          "active:scale-95",
          isOpen && "bg-white/15 scale-105"
        )}
      >
        <Bell className={cn(
          "h-5 w-5 transition-all duration-300",
          unreadCount > 0 ? "text-white animate-bounce" : "text-white/70",
          "hover:text-white"
        )} />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse shadow-lg">
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping" />
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden transform transition-all duration-300 ease-out animate-in slide-in-from-top-2 fade-in-0"
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Thông báo</h3>
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Đánh dấu tất cả là đã đọc
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
                Đang tải...
              </div>
            ) : notifications.length === 0 ? (
              // Empty State
              <div className="p-8 text-center">
                <div className="relative mb-4">
                  <Bell className="h-16 w-16 text-gray-200 mx-auto" />
                  <Check className="h-6 w-6 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm" />
                </div>
                <p className="text-gray-600 font-medium mb-2">Bạn chưa có thông báo nào</p>
                <p className="text-gray-400 text-sm leading-relaxed">Khi có hoạt động mới, chúng sẽ xuất hiện ở đây.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "p-4 border-b border-gray-50 cursor-pointer transition-all duration-200",
                    "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm",
                    "active:scale-[0.98] active:bg-blue-100",
                    !notification.is_read && "bg-blue-50/50 border-l-4 border-l-blue-400"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Unread Indicator */}
                    {!notification.is_read && (
                      <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0 animate-pulse shadow-sm" />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 leading-relaxed">
                        {notification.content.split('"').map((part, index) => {
                          if (index % 2 === 1) {
                            return <span key={index} className="font-semibold">"{part}"</span>;
                          }
                          // Bold names (assuming they're before "đã")
                          return part.split(' đã ').map((namePart, nameIndex) => {
                            if (nameIndex === 0 && part.includes(' đã ')) {
                              return <span key={nameIndex} className="font-semibold">{namePart} đã </span>;
                            }
                            return namePart;
                          });
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Panel Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to full notifications page
                  console.log('Navigate to /notifications');
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 transition-all duration-200 hover:bg-blue-50 py-1 rounded"
              >
                Xem tất cả thông báo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}