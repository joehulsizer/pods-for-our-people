"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bell,
  X,
  Radio,
  Mic,
  Heart,
  MessageSquare,
  Upload,
  CheckCircle,
  AlertCircle,
  Users,
  Calendar,
  Settings
} from "lucide-react";
import { notificationService, type Notification } from "@/lib/database-service";
import { useAuth } from "@/contexts/AuthContext";

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  unreadCount: number;
  loading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch notifications on component mount and user change
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getUserNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  // Set up real-time subscription for notifications
  useEffect(() => {
    if (!user) return;

    const subscription = notificationService.subscribeToNotifications(
      user.id,
      (newNotification) => {
        setNotifications(prev => [newNotification, ...prev]);

        // Show toast notification for important types
        if (['live_stream', 'new_podcast', 'approval'].includes(newNotification.type)) {
          // You could add a toast notification here
          console.log('New notification received:', newNotification);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const addNotification = async (notification: Omit<Notification, 'id' | 'created_at'>) => {
    if (!user) return;

    try {
      await notificationService.createNotification({
        ...notification,
        user_id: user.id
      });
      // The real-time subscription will add it to the state
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      unreadCount,
      loading
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

interface NotificationBellProps {
  onToggle: () => void;
  isOpen: boolean;
}

export const NotificationBell = ({ onToggle, isOpen }: NotificationBellProps) => {
  const { unreadCount } = useNotifications();

  return (
    <Button variant="ghost" size="sm" onClick={onToggle} className="relative">
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center bg-red-500">
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
};

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const { notifications, markAsRead, markAllAsRead, removeNotification, unreadCount, loading } = useNotifications();

  if (!isOpen) return null;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'live_stream':
        return <Radio className="h-4 w-4 text-red-500" />;
      case 'new_podcast':
        return <Mic className="h-4 w-4 text-primary" />;
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'approval':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'reminder':
        return <Calendar className="h-4 w-4 text-orange-500" />;
      case 'mention':
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diff = now.getTime() - notificationTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getUserAvatar = (metadata: Record<string, unknown>) => {
    if (metadata?.user && typeof metadata.user === 'object' && metadata.user !== null) {
      const user = metadata.user as { full_name?: string };
      if (user.full_name) {
        return user.full_name.split(' ').map((n: string) => n[0]).join('');
      }
    }
    return 'SY';
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <Card
        className="absolute top-16 right-4 w-96 max-h-[600px] shadow-lg border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} new</Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
              <p className="text-sm">We'll notify you when something happens</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {notification.metadata?.user ? (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getUserAvatar(notification.metadata)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          {notification.metadata && (
                            <div className="flex items-center space-x-2 mt-2">
                              {typeof notification.metadata === 'object' && notification.metadata !== null &&
                               'department' in notification.metadata &&
                               typeof (notification.metadata as { department?: string }).department === 'string' && (
                                <Badge variant="outline" className="text-xs">
                                  {(notification.metadata as { department: string }).department}
                                </Badge>
                              )}
                              {typeof notification.metadata === 'object' && notification.metadata !== null &&
                               'podcastTitle' in notification.metadata &&
                               typeof (notification.metadata as { podcastTitle?: string }).podcastTitle === 'string' && (
                                <Badge variant="outline" className="text-xs">
                                  {(notification.metadata as { podcastTitle: string }).podcastTitle}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-2">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimestamp(notification.created_at)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {!notification.read && (
                        <div className="flex items-center space-x-1 mt-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-xs text-primary font-medium">New</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-4 border-t bg-muted/30">
            <Button variant="ghost" size="sm" className="w-full">
              View All Notifications
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

// Live Toast Notifications
interface ToastNotificationProps {
  notification: Notification;
  onClose: () => void;
}

export const ToastNotification = ({ notification, onClose }: ToastNotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const getUserAvatar = (metadata: Record<string, unknown>) => {
    if (metadata?.user && typeof metadata.user === 'object' && metadata.user !== null) {
      const user = metadata.user as { full_name?: string };
      if (user.full_name) {
        return user.full_name.split(' ').map((n: string) => n[0]).join('');
      }
    }
    return 'SY';
  };

  return (
    <Card className={`fixed top-4 right-4 w-80 shadow-lg border-l-4 border-l-primary z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {notification.metadata?.user ? (
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {getUserAvatar(notification.metadata)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                {notification.type === 'live_stream' && <Radio className="h-3 w-3 text-red-500" />}
                {notification.type === 'new_podcast' && <Mic className="h-3 w-3 text-primary" />}
                {notification.type === 'like' && <Heart className="h-3 w-3 text-red-500" />}
                {notification.type === 'comment' && <MessageSquare className="h-3 w-3 text-blue-500" />}
                {notification.type === 'approval' && <CheckCircle className="h-3 w-3 text-green-500" />}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{notification.title}</p>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            {typeof notification.metadata === 'object' && notification.metadata !== null &&
             'department' in notification.metadata &&
             typeof (notification.metadata as { department?: string }).department === 'string' && (
              <Badge variant="outline" className="text-xs mt-1">
                {(notification.metadata as { department: string }).department}
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
