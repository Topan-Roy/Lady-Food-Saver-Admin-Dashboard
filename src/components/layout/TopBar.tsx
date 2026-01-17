import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Input } from '../ui/Input';

export function TopBar() {
  const [unreadCount, setUnreadCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const notifications = [
    { id: 1, type: 'success', title: 'Order Completed', message: 'Order #ORD-1025 has been delivered', time: '5 min ago' },
    { id: 2, type: 'warning', title: 'Low Stock Alert', message: 'Salmon Sushi Roll is running low', time: '1 hour ago' },
    { id: 3, type: 'info', title: 'New Restaurant', message: 'Sunset Cafe joined the platform', time: '3 hours ago' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  return <header className="h-16 bg-white border-b border-gray-100 sticky top-0 z-40 px-8 flex items-center justify-between">
    {/* Search */}
    <div className="w-96">
      <Input
        icon={<Search className="h-4 w-4" />}
        placeholder="Search anything..."
      />
    </div>

    {/* Right Actions */}
    <div className="flex items-center gap-4">
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-full mt-3 w-96 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                {unreadCount > 0 && <span className="bg-[#FF6B35] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-bold text-[#FF6B35] hover:text-[#E85A2D] transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer relative">
                  {unreadCount > 0 && notif.id <= unreadCount && (
                    <div className="absolute right-4 top-4 h-2 w-2 bg-blue-500 rounded-full"></div>
                  )}
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{notif.title}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-gray-50 text-center">
              <button
                onClick={() => {
                  setShowNotifications(false);
                  navigate('/notifications');
                }}
                className="text-sm font-bold text-[#FF6B35] hover:text-[#E85A2D] transition-colors"
              >
                View All Notifications
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/settings')}
        className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
      >
        <Settings className="h-5 w-5" />
      </button>

      <div className="h-8 w-px bg-gray-200 mx-2"></div>

      <div
        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors"
        onClick={() => navigate('/profile')}
      >
        <div className="text-right hidden md:block">
          <p className="text-sm font-semibold text-gray-900">
            Orlando Laurentius
          </p>
          <p className="text-xs text-gray-500">Super Admin</p>
        </div>
        <Avatar fallback="OL" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" className="ring-2 ring-white shadow-sm hover:ring-[#FF6B35]/20 transition-all" />
      </div>
    </div>
  </header>;
}