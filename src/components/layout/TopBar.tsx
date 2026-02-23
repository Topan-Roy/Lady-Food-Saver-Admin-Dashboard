import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, X, CheckCircle, AlertCircle, Info, Store, Users } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Input } from '../ui/Input';
import { useGetProfileQuery } from '../../redux/features/setting';
import { useGetNotificationsQuery, useMarkAllAsReadMutation } from '../../redux/features/notification';
import { formatDistanceToNow } from 'date-fns';
import { Inbox } from 'lucide-react';

export function TopBar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDrop, setShowSearchDrop] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery({});
  const { data: notificationsData } = useGetNotificationsQuery({ limit: 5 });
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications = notificationsData?.data?.notifications || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const admin = profileData?.data;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDrop(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchNavigate = (tab: 'restaurants' | 'customers') => {
    const q = searchQuery.trim();
    setShowSearchDrop(false);
    setSearchQuery('');
    navigate(`/users?tab=${tab}${q ? `&search=${encodeURIComponent(q)}` : ''}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSearchNavigate('restaurants');
    }
    if (e.key === 'Escape') {
      setShowSearchDrop(false);
      setSearchQuery('');
    }
  };

  const getIcon = (title: string) => {
    const t = title?.toLowerCase() || '';
    if (t.includes('order')) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (t.includes('alert') || t.includes('warning')) return <AlertCircle className="h-5 w-5 text-orange-500" />;
    return <Info className="h-5 w-5 text-blue-500" />;
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead({}).unwrap();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  return <header className="h-16 bg-white border-b border-gray-100 sticky top-0 z-40 px-8 flex items-center justify-between">
    {/* Search */}
    <div className="w-96 relative" ref={searchRef}>
      <Input
        icon={<Search className="h-4 w-4" />}
        placeholder="Search restaurants or customers..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setShowSearchDrop(e.target.value.trim().length > 0);
        }}
        onKeyDown={handleSearchKeyDown}
        onFocus={() => searchQuery.trim() && setShowSearchDrop(true)}
      />
      {showSearchDrop && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-100 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 pt-3 pb-1">Search in</p>
          <button
            onClick={() => handleSearchNavigate('restaurants')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors text-left group"
          >
            <div className="p-1.5 bg-orange-100 rounded-lg group-hover:bg-[#E4983A] transition-colors">
              <Store className="h-4 w-4 text-[#E4983A] group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Restaurants</p>
              <p className="text-xs text-gray-400">Search by name or owner</p>
            </div>
          </button>
          <button
            onClick={() => handleSearchNavigate('customers')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors text-left group border-t border-gray-50"
          >
            <div className="p-1.5 bg-orange-100 rounded-lg group-hover:bg-[#E4983A] transition-colors">
              <Users className="h-4 w-4 text-[#E4983A] group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Customers</p>
              <p className="text-xs text-gray-400">Search by name or email</p>
            </div>
          </button>
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-[10px] text-gray-400">Press <kbd className="bg-white border border-gray-200 rounded px-1 py-0.5 text-[10px] font-mono">Enter</kbd> to search restaurants</p>
          </div>
        </div>
      )}
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
                {unreadCount > 0 && <span className="bg-[#E4983A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-bold text-[#E4983A] hover:text-[#E85A2D] transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Inbox className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif: any) => (
                  <div key={notif._id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer relative ${!notif.isRead ? 'bg-orange-50/30' : ''}`}>
                    {!notif.isRead && (
                      <div className="absolute right-4 top-4 h-2 w-2 bg-[#E4983A] rounded-full"></div>
                    )}
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        {getIcon(notif.title)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{notif.title}</p>
                        <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 bg-gray-50 text-center">
              <button
                onClick={() => {
                  setShowNotifications(false);
                  navigate('/notifications');
                }}
                className="text-sm font-bold text-[#E4983A] hover:text-[#E85A2D] transition-colors"
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
        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors group"
        onClick={() => navigate('/profile')}
      >
        {isProfileLoading ? (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="text-right hidden md:block space-y-2">
              <div className="h-3 w-24 bg-gray-100 rounded-full"></div>
              <div className="h-2 w-16 bg-gray-50 rounded-full ml-auto"></div>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-gray-900 group-hover:text-[#E4983A] transition-colors">
                {admin?.name || 'Admin'}
              </p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{admin?.Role || 'Super Admin'}</p>
            </div>
            <Avatar
              fallback={admin?.name?.substring(0, 2).toUpperCase() || 'AD'}
              src={admin?.profilePic || admin?.avatar}
              className="ring-2 ring-white shadow-sm group-hover:ring-[#E4983A]/20 transition-all object-cover"
            />
          </>
        )}
      </div>
    </div>
  </header>;
}

