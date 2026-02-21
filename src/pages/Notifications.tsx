import { useState } from "react";
import { AdminLayout } from "../components/layout/AdminLayout";
import { Card } from "../components/ui/Card";
import {
    Bell,
    CheckCircle,
    AlertCircle,
    Info,
    Clock,
    ArrowRight,
    Loader2,
    Inbox,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    useGetNotificationsQuery,
    useMarkAllAsReadMutation,
    useMarkAsReadMutation,
} from "../redux/features/notification";
import { formatDistanceToNow } from "date-fns";

export function Notifications() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    const { data: notificationsResponse, isLoading } = useGetNotificationsQuery({
        page,
        limit: 20,
    });

    const [markAsRead] = useMarkAsReadMutation();
    const [markAllAsRead] = useMarkAllAsReadMutation();

    const notifications = notificationsResponse?.data?.notifications || [];
    const pagination = notificationsResponse?.data?.pagination;

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id).unwrap();
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead(undefined).unwrap();
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const getIcon = (title: string) => {
        const t = title?.toLowerCase() || "";
        if (t.includes("order"))
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        if (t.includes("alert") || t.includes("warning"))
            return <AlertCircle className="h-5 w-5 text-orange-500" />;
        return <Info className="h-5 w-5 text-blue-500" />;
    };

    const getBgColor = (title: string) => {
        const t = title?.toLowerCase() || "";
        if (t.includes("order")) return "bg-green-50";
        if (t.includes("alert") || t.includes("warning")) return "bg-orange-50";
        return "bg-blue-50";
    };

    const displayedNotifications =
        filter === "all"
            ? notifications
            : notifications.filter((n: any) => !n.isRead);

    const handleNotificationClick = async (notif: any) => {
        if (!notif.isRead) {
            handleMarkAsRead(notif._id);
        }

        const title = notif.title?.toLowerCase() || "";
        const message = notif.message?.toLowerCase() || "";

        // Navigate based on notification content/type
        if (notif.orderId) {
            navigate(`/orders`);
        } else if (notif.userId?._id) {
            const role = notif.userId.role?.toLowerCase();
            if (role === "customer") {
                navigate(`/users/customer/${notif.userId._id}`);
            } else if (role === "provider" || role === "restaurant") {
                navigate(`/restaurant/${notif.userId._id}`);
            }
        } else if (title.includes("restaurant") || message.includes("restaurant")) {
            // Check if there's any other ID indicator
            if (notif.restaurantId) navigate(`/restaurant/${notif.restaurantId}`);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-[#E4983A]" />
                    <p className="text-gray-500 font-medium animate-pulse">
                        Fetching your notifications...
                    </p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6 ">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-4">
                            <div className="p-3 bg-orange-100 rounded-2xl">
                                <Bell className="h-8 w-8 text-[#E4983A]" />
                            </div>
                            Notifications
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">
                            Stay updated with platform activities and alerts
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={handleMarkAllRead}
                            className="text-sm font-bold text-[#E4983A] hover:text-[#E85A2D] transition-all bg-orange-50 hover:bg-orange-100 px-6 py-3 rounded-2xl shadow-sm border border-orange-100/50"
                        >
                            Mark all as read
                        </button>
                        <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit shadow-inner">
                            <button
                                onClick={() => {
                                    setFilter("all");
                                    setPage(1);
                                }}
                                className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${filter === "all" ? "bg-white text-[#E4983A] shadow-md" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => {
                                    setFilter("unread");
                                    setPage(1);
                                }}
                                className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${filter === "unread" ? "bg-white text-[#E4983A] shadow-md" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Unread
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    {displayedNotifications.map((notif: any) => (
                        <Card
                            key={notif._id}
                            noPadding
                            className={`group transition-all duration-500 hover:shadow-2xl border-l-[2px] cursor-pointer overflow-hidden ${notif.isRead ? "border-transparent bg-gray-50/50 opacity-80 hover:opacity-50" : " bg-white ring-1 ring-orange-100/50"}`}
                            onClick={() => handleNotificationClick(notif)}
                        >
                            <div className="p-3 flex items-start gap-6">
                                <div
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 duration-500 ${getBgColor(notif.title)}`}
                                >
                                    {getIcon(notif.title)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <h3
                                            className={`text-[18px] font-semibold tracking-tight ${notif.isRead ? "text-gray-600" : "text-gray-900"}`}
                                        >
                                            {notif.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 group-hover:text-[#E4983A] transition-colors">
                                            <Clock className="h-4 w-4" />
                                            {formatDistanceToNow(new Date(notif.createdAt), {
                                                addSuffix: true,
                                            })}
                                        </div>
                                    </div>
                                    <p
                                        className={`leading-relaxed font-semibold transition-colors duration-500 ${notif.isRead ? "text-gray-500" : "text-gray-700"}`}
                                    >
                                        {notif.message}
                                    </p>

                                    {(notif.orderId || notif.userId?._id) && (
                                        <div className="mt-4 text-sm font-black text-[#E4983A] flex items-center gap-2 group/btn">
                                            {notif.orderId
                                                ? "View Order Details"
                                                : "View Profile Details"}
                                            <div className="p-1 bg-orange-50 rounded-lg group-hover:bg-[#e09e4c] group-hover:text-white transition-colors">
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {!notif.isRead && (
                                    <div
                                        className="w-4 h-4 rounded-full bg-[#E4983A] mt-2 shadow-lg shadow-orange-200 ring-4 ring-orange-50 animate-pulse shrink-0"
                                        title="Unread"
                                    ></div>
                                )}
                            </div>
                        </Card>
                    ))}

                    {displayedNotifications.length === 0 && (
                        <Card className="flex flex-col items-center justify-center py-24 text-center border-none shadow-xl">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Inbox className="h-12 w-12 text-gray-200" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">
                                Perfectly caught up!
                            </h2>
                            <p className="text-gray-500 font-medium max-w-xs">
                                You have no {filter === "unread" ? "unread" : ""} notifications
                                at the moment.
                            </p>
                        </Card>
                    )}
                </div>

                {pagination && pagination.pages > 1 && (
                    <div className="flex justify-center gap-3 pt-8 pb-12">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-6 py-3 rounded-2xl bg-white border-2 border-gray-100 text-sm font-black text-gray-600 disabled:opacity-50 hover:border-[#E4983A] hover:text-[#E4983A] transition-all shadow-sm"
                        >
                            Previous
                        </button>
                        {[...Array(pagination.pages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`w-12 h-12 rounded-2xl text-sm font-black transition-all shadow-sm ${page === i + 1 ? "bg-[#E4983A] text-white border-2 border-[#E4983A]" : "bg-white border-2 border-gray-100 text-gray-600 hover:border-[#E4983A] hover:text-[#E4983A]"}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={page === pagination.pages}
                            onClick={() => setPage(page + 1)}
                            className="px-6 py-3 rounded-2xl bg-white border-2 border-gray-100 text-sm font-black text-gray-600 disabled:opacity-50 hover:border-[#E4983A] hover:text-[#E4983A] transition-all shadow-sm"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
