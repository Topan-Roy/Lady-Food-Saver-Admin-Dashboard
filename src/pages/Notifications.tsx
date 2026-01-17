import { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Bell, CheckCircle, AlertCircle, Info, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Notifications() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'success', title: 'Order Completed', message: 'Order #ORD-1025 has been delivered to customer', time: '5 min ago', read: false },
        { id: 2, type: 'warning', title: 'Low Stock Alert', message: 'Salmon Sushi Roll is running low (Current: 3)', time: '1 hour ago', read: false },
        { id: 3, type: 'info', title: 'New Restaurant', message: 'Sunset Cafe joined the platform', time: '3 hours ago', read: false },
        { id: 4, type: 'success', title: 'Payout Processed', message: 'Weekly payout of $12,450 sent to verified accounts', time: '1 day ago', read: true },
        { id: 5, type: 'info', title: 'System Update', message: 'Platform maintenance scheduled for Sunday 2 AM', time: '2 days ago', read: true },
        { id: 6, type: 'warning', title: 'High Refund Rate', message: 'Pizza Hut #42 showing unusual refund activity', time: '2 days ago', read: true },
    ]);

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'warning': return <AlertCircle className="h-5 w-5 text-orange-500" />;
            case 'info': return <Info className="h-5 w-5 text-blue-500" />;
            default: return <Info className="h-5 w-5 text-gray-500" />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-50';
            case 'warning': return 'bg-orange-50';
            case 'info': return 'bg-blue-50';
            default: return 'bg-gray-50';
        }
    };

    const displayedNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => !n.read);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <Bell className="h-8 w-8 text-[#FF6B35]" />
                            Notifications
                        </h1>
                        <p className="text-gray-500">Stay updated with platform activities and alerts</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={markAllAsRead}
                            className="text-sm font-bold text-[#FF6B35] hover:text-[#E85A2D] transition-colors bg-orange-50 px-4 py-2 rounded-xl"
                        >
                            Mark all as read
                        </button>
                        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-white text-[#FF6B35] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'unread' ? 'bg-white text-[#FF6B35] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Unread
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {displayedNotifications.map((notif) => (
                        <Card
                            key={notif.id}
                            noPadding
                            className={`group transition-all duration-300 hover:shadow-lg border-l-4 cursor-pointer ${notif.read ? 'border-gray-200 opacity-75 hover:opacity-100' : 'border-[#FF6B35] bg-white'}`}
                            onClick={() => markAsRead(notif.id)}
                        >
                            <div className="p-6 flex items-start gap-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getBgColor(notif.type)}`}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                        <h3 className={`text-lg font-bold ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                            {notif.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                                            <Clock className="h-3.5 w-3.5" />
                                            {notif.time}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed font-medium">
                                        {notif.message}
                                    </p>

                                    {notif.type === 'success' && notif.title.includes('Order') && (
                                        <button
                                            onClick={() => navigate('/orders')}
                                            className="mt-3 text-sm font-bold text-[#FF6B35] flex items-center gap-1 hover:gap-2 transition-all group-hover/btn"
                                        >
                                            View Order Details <ArrowRight className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                {!notif.read && (
                                    <div className="w-3 h-3 rounded-full bg-[#FF6B35] mt-2 ring-4 ring-orange-50" title="Unread"></div>
                                )}
                            </div>
                        </Card>
                    ))}

                    {displayedNotifications.length === 0 && (
                        <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="font-bold">No notifications to display</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
