import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AdminLayout } from "../components/layout/AdminLayout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Table } from "../components/ui/Table";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { FilterSelect } from "../components/ui/FilterSelect";
import { SupportChatModal } from "../components/modals/SupportChatModal";
import { CustomerReviews } from "../components/dashboard/CustomerReviews";
import {
  ArrowLeft,
  MapPin,
  Star,
  Check,
  X,
  BarChart3,
  List as ListIcon,
  Info,
  Package,
  History,
  ShoppingBag,
  Edit2,
  MessageCircle,
  Clock,
  ShieldAlert,
  DollarSign,
  ExternalLink,
  AlertTriangle,
  LayoutGrid,
  FileText,
  Printer,
  Download,
  Calendar,
  Trash2,
} from "lucide-react";

import {
  useGetRestaurantStatsQuery,
  useGetRestaurantProfileQuery,
  useGetRestaurantPickupWindowsQuery,
  useGetRestaurantActivitySummaryQuery,
  useGetRestaurantLocationQuery,
  useGetRestaurantComplianceQuery,
  useBlockRestaurantMutation,
  useUnblockRestaurantMutation,
  useGetRestaurantOrdersQuery,
} from "../redux/features/dashboardApi";
import { useGetLegalDocumentsQuery, useDeleteLegalDocumentMutation } from "../redux/features/legal";
import { format } from "date-fns";

export function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    "details" | "orders" | "reviews" | "documents"
  >((searchParams.get("tab") as any) || "details");
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const { data: statsData } = useGetRestaurantStatsQuery(id);
  const { data: profileDataResponse } = useGetRestaurantProfileQuery(id);
  const { data: pickupWindowsData } = useGetRestaurantPickupWindowsQuery(id);
  const { data: activityData } = useGetRestaurantActivitySummaryQuery(id);
  const { data: locationData } = useGetRestaurantLocationQuery(id);
  const { data: complianceData } = useGetRestaurantComplianceQuery(id);
  const { data: ordersData } = useGetRestaurantOrdersQuery(id);

  useEffect(() => {
    if (profileDataResponse?.data?.status) {
      setLocalStatus(profileDataResponse.data.status);
    }
  }, [profileDataResponse]);

  const [blockRestaurant, { isLoading: isBlocking }] =
    useBlockRestaurantMutation();
  const [unblockRestaurant, { isLoading: isUnblocking }] =
    useUnblockRestaurantMutation();
  const [deleteLegalDoc] = useDeleteLegalDocumentMutation();

  const { data: legalDocsResponse, isLoading: isLegalLoading } = useGetLegalDocumentsQuery({
    page: 1,
    limit: 10,
    status: 'Active'
  });

  const profile = profileDataResponse?.data || profileDataResponse || {};
  const stats = statsData?.data || {
    totalSales: profile.revenue || profile.totalSales || 0,
    totalOrders: profile.totalOrders || 0,
    platformFeePerOrder: profile.platformFeePerOrder || 0,
    nextPayout: { amount: 0, scheduledAt: new Date().toISOString() },
  };

  const activitySummary = activityData?.data || {
    listings: profile.totalListings || 0,
    orders: profile.totalOrders || 0,
    reviews: profile.reviewCount || profile.ratings || 0,
  };

  const location = locationData?.data || {
    address: profile.address || "N/A",
    lat: 0,
    lng: 0,
  };

  const compliance = complianceData?.data || {
    alcoholNotice: { enabled: false },
    tax: {},
  };

  const pickupWindows = (pickupWindowsData?.data || []).map((window: any) => ({
    day: window.day,
    hours: `${window.startTime} - ${window.endTime}`,
  }));

  const restaurant = {
    id,
    name: profile.restaurantsName || profile.restaurantName || profile.RestaurantName || profile.name || profile.Name || profile.storeName || profile.restaurant_name || (profileDataResponse ? "Restaurant Name" : "Loading..."),
    owner: profile.owner?.name || profile.ownerName || profile.OwnerName || profile.owner || "Owner Name",
    status: localStatus || profile.status || "Approved",
    rating: profile.ratings || profile.rating || profile.Rating || 0,
    reviews: profile.reviewCount || profile.reviews?.length || profile.ReviewCount || 0,
    address: profile.address || profile.Address || location.address,
    phone: profile.contact?.phone || profile.phoneNumber || profile.phone || "+1 (212) 555-0199",
    website: profile.contact?.website || profile.website || profile.Website || "www.website.com",
    image:
      profile.owner?.restaurantsPick ||
      profile.image ||
      profile.logo ||
      profile.profileImage ||
      profile.ProfilePick ||
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
    cuisine:
      profile.cuisine?.length > 0
        ? Array.isArray(profile.cuisine) ? profile.cuisine.join(" & ") : profile.cuisine
        : "N/A",
    statusText: (localStatus || profile.status || "Approved").toString(),
    joinedDate: profile.createdAt || profile.date
      ? format(new Date(profile.createdAt || profile.date), "MMM dd, yyyy")
      : "N/A",
    taxRule: compliance.tax.rule || "US-NY Standard (8.875%)",
    platformFee: `$${stats.platformFeePerOrder} per transaction`,
    pickupWindows:
      pickupWindows.length > 0
        ? pickupWindows
        : [
          { day: "Mon - Thu", hours: "08:00 PM - 10:00 PM" },
          { day: "Fri - Sun", hours: "09:00 PM - 11:00 PM" },
        ],
    stats: {
      totalSales: `$${Number(stats.totalSales || 0).toLocaleString()}`,
      totalOrders: Number(stats.totalOrders || 0),
      platformRevenue: `$${(Number(stats.totalOrders || 0) * Number(stats.platformFeePerOrder || 0)).toFixed(2)}`,
      restaurantEarnings: `$${(Number(stats.totalSales || 0) - (Number(stats.totalOrders || 0) * Number(stats.platformFeePerOrder || 0))).toLocaleString()}`,
      nextPayoutAmount: `$${Number(stats.nextPayout?.amount || 0).toFixed(2)}`,
      nextPayoutDate: stats.nextPayout?.scheduledAt
        ? format(new Date(stats.nextPayout.scheduledAt), "MMM dd")
        : "N/A",
    },
  };

  useEffect(() => {
    if (restaurant.name && restaurant.name !== "Loading...") {
      document.title = `${restaurant.name} | Admin Dashboard`;
    }
  }, [restaurant.name]);

  const handleBlockToggle = async () => {
    const currentStatus = String(restaurant.status || "").toLowerCase();
    try {
      if (currentStatus === "blocked") {
        await unblockRestaurant(id).unwrap();
        setLocalStatus("Approved");
      } else {
        await blockRestaurant(id).unwrap();
        setLocalStatus("Blocked");
      }
    } catch (error: any) {
      console.error("BLOCK/UNBLOCK OPERATION FAILED:", error);
    }
  };

  const handleDocDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteLegalDoc(id).unwrap();
        alert("Document deleted successfully");
      } catch (error) {
        console.error("Delete Error:", error);
        alert("Failed to delete document");
      }
    }
  };

  const orders: {
    id: string;
    customer: string;
    time: string;
    status: string;
    amount: number;
  }[] = (ordersData?.orders || []).map((order: any) => ({
    id: order.orderId,
    customer: order.customerName,
    time: order.date ? format(new Date(order.date), "MMM dd, hh:mm a") : "N/A",
    status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
    amount: order.amount,
  }));


  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">
              {restaurant.name}
            </h2>
            <Badge
              variant={
                restaurant.status.toString().toLowerCase() === "blocked"
                  ? "error"
                  : "success"
              }
              className={`${restaurant.status.toString().toLowerCase() === "blocked" ? "bg-red-500" : "bg-green-500"} text-white border-none py-0.5`}
            >
              {restaurant.status}
            </Badge>
          </div>
        </div>

        {/* Hero Header */}
        <div className="relative h-48 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
          <img
            src={restaurant.image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
            <div className="text-white">
              <h1 className="text-4xl font-black tracking-tight">
                {restaurant.name}
              </h1>
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full text-sm font-medium border border-white/10">
                  <MapPin className="h-4 w-4 text-[#E4983A]" />{" "}
                  {restaurant.address}
                </span>
                <div className="flex items-center gap-1.5 bg-yellow-400/20 backdrop-blur-xl px-4 py-1.5 rounded-full text-sm font-bold text-yellow-400 border border-yellow-400/20">
                  <Star className="h-4 w-4 fill-yellow-400" />{" "}
                  {restaurant.rating}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsChatModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white"
                size="sm"
              >
                Message Restaurant
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit border border-gray-200 shadow-inner overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === "details" ? "bg-white text-[#E4983A] shadow-lg shadow-gray-200" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Info className="h-4 w-4" />
            General Info
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === "orders" ? "bg-white text-[#E4983A] shadow-lg shadow-gray-200" : "text-gray-500 hover:text-gray-700"}`}
          >
            <History className="h-4 w-4" />
            Order History
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === "reviews" ? "bg-white text-[#E4983A] shadow-lg shadow-gray-200" : "text-gray-500 hover:text-gray-700"}`}
          >
            <MessageCircle className="h-4 w-4" />
            Reviews
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === "documents" ? "bg-white text-[#E4983A] shadow-lg shadow-gray-200" : "text-gray-500 hover:text-gray-700"}`}
          >
            <FileText className="h-4 w-4" />
            Documents
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8 transition-all duration-500">
          {activeTab === "details" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Platform Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="!bg-[#E4983A] !border-none !shadow-2xl shadow-orange-200 relative overflow-hidden group">
                  <BarChart3 className="absolute -right-2 -bottom-2 h-24 w-24 text-white/10 transition-transform group-hover:scale-110" />
                  <p className="text-white text-xs font-black uppercase tracking-widest relative z-10">
                    Total Sales
                  </p>
                  <div className="flex items-baseline gap-2 mt-4 relative z-10">
                    <p className="text-4xl font-black text-white tracking-tighter">
                      {restaurant.stats.totalSales}
                    </p>
                  </div>
                </Card>

                <Card className="border-none shadow-xl shadow-gray-100/50 flex flex-col justify-between relative overflow-hidden group">
                  <ShoppingBag className="absolute -right-4 -bottom-4 h-20 w-20 text-gray-50 transition-transform group-hover:scale-110" />
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                      Total Orders
                    </p>
                    <p className="text-3xl font-black text-gray-900 mt-2">
                      {restaurant.stats.totalOrders}
                    </p>
                  </div>
                  <p className="text-[10px] text-[#E4983A] font-black mt-4 flex items-center gap-1 uppercase tracking-tighter">
                    Platform Fee: {restaurant.platformFee}
                  </p>
                </Card>

                <Card className="border-none shadow-xl shadow-gray-100/50 flex flex-col justify-between relative overflow-hidden group">
                  <Check className="absolute -right-4 -bottom-4 h-20 w-20 text-gray-50 transition-transform group-hover:scale-110" />
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                      Next Payout
                    </p>
                    <p className="text-3xl font-black text-blue-600 mt-2">
                      {restaurant.stats.nextPayoutAmount}
                    </p>
                  </div>
                  <p className="text-[10px] text-blue-400 font-bold mt-4">
                    Scheduled for {restaurant.stats.nextPayoutDate}
                  </p>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Platform Compliance & Profile */}
                <div className="space-y-8">
                  <Card
                    noPadding
                    className="border-none shadow-xl shadow-gray-100/50 overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                      <h3 className="font-black text-gray-900 flex items-center gap-2">
                        <Info className="h-4 w-4 text-[#E4983A]" /> Platform
                        Profile
                      </h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                          Cuisine Specialty
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {restaurant.cuisine}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                          Contact Details
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 font-medium">
                              Primary Phone
                            </span>
                            <span className="font-black text-gray-900">
                              {restaurant.phone}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 font-medium">
                              Official Website
                            </span>
                            <a
                              href="#"
                              className="font-bold text-[#E4983A] flex items-center gap-1 hover:underline"
                            >
                              Visit <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card
                    noPadding
                    className="border-none shadow-xl shadow-gray-100/50 overflow-hidden border-l-4 border-amber-400"
                  >
                    <div className="p-6 border-b border-gray-50 bg-amber-50/30">
                      <h3 className="font-black text-amber-900 flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-amber-600" /> Legal
                        & Compliance
                      </h3>
                    </div>
                    <div className="p-6 space-y-5">
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-2 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Beer & Wine
                          Notice
                        </p>
                        <p className="text-[11px] font-semibold text-amber-700 leading-relaxed">
                          Legal Notice: Ensure that a legal notice is displayed
                          when alcoholic beverages are listed. Verification of
                          age is required at pickup.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                          State Tax Enforcement
                        </p>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-xs font-bold text-gray-500">
                            Tax Rule
                          </span>
                          <code className="text-[11px] font-black text-gray-900">
                            {restaurant.taxRule}
                          </code>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Column 2: Pickup Timing */}
                <div className="space-y-8">
                  <Card
                    noPadding
                    className="border-none shadow-xl shadow-gray-100/50 overflow-hidden h-full"
                  >
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                      <h3 className="font-black text-gray-900 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#E4983A]" /> Pickup
                        Windows
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <p className="text-xs text-gray-500 font-bold mb-4 uppercase tracking-widest">
                        Available Pickup Slots
                      </p>
                      {restaurant.pickupWindows.map(
                        (slot: { day: string; hours: string }, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                                <History className="h-4 w-4 text-[#E4983A]" />
                              </div>
                              <span className="text-xs font-black text-gray-700 uppercase">
                                {slot.day}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-gray-900 bg-white px-3 py-1 rounded-full border border-gray-100">
                              {slot.hours}
                            </span>
                          </div>
                        ),
                      )}
                      <p className="text-[10px] text-gray-400 font-bold mt-8 italic text-center px-4">
                        Restaurants must list surplus food at least 2 hours
                        before the scheduled pickup window.
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Column 3: Platform Management */}
                <div className="space-y-8">
                  <Card
                    noPadding
                    className="border-none shadow-xl shadow-gray-100/50 overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                      <h3 className="font-black text-gray-900 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-purple-500" />{" "}
                        Activity Summary
                      </h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-purple-50 rounded-2xl border border-purple-100 group hover:border-purple-300 transition-colors">
                          <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-purple-600" />
                            <span className="text-xs font-black text-purple-900 uppercase tracking-widest">
                              Listings
                            </span>
                          </div>
                          <span className="text-xl font-black text-purple-900">
                            {activitySummary.listings} Items
                          </span>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 group hover:border-emerald-300 transition-colors">
                          <div className="flex items-center gap-3">
                            <ShoppingBag className="h-5 w-5 text-emerald-600" />
                            <span className="text-xs font-black text-emerald-900 uppercase tracking-widest">
                              Orders
                            </span>
                          </div>
                          <span className="text-xl font-black text-emerald-900">
                            {activitySummary.orders} Total
                          </span>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-amber-50 rounded-2xl border border-amber-100 group hover:border-amber-300 transition-colors">
                          <div className="flex items-center gap-3">
                            <Star className="h-5 w-5 text-amber-600" />
                            <span className="text-xs font-black text-amber-900 uppercase tracking-widest">
                              Reviews
                            </span>
                          </div>
                          <span className="text-xl font-black text-amber-900">
                            {activitySummary.reviews} Feedbacks
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card
                    noPadding
                    className="border-none shadow-xl shadow-gray-100/50 overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                      <h3 className="font-black text-gray-900 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-500" /> Store
                        Location
                      </h3>
                    </div>
                    <div className="p-6 space-y-5">
                      <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                          <MapPin className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-800 leading-snug">
                            {restaurant.address}
                          </p>
                          <button className="text-[10px] font-black text-blue-600 mt-1 uppercase tracking-widest hover:underline">
                            View on Platform Map
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div className="pt-4 space-y-4">
                    <Button
                      variant={
                        (restaurant.status || "").toString().toLowerCase() ===
                          "blocked"
                          ? "secondary"
                          : "danger"
                      }
                      className={`w-full shadow-2xl ${(restaurant.status || "").toString().toLowerCase() === "blocked" ? "shadow-gray-500/20" : "shadow-red-500/20"} py-6 text-sm uppercase tracking-widest font-black rounded-3xl`}
                      onClick={handleBlockToggle}
                      disabled={isBlocking || isUnblocking}
                    >
                      {isBlocking || isUnblocking
                        ? "Processing..."
                        : (restaurant.status || "").toString().toLowerCase() ===
                          "blocked"
                          ? "Unblock Restaurant Account"
                          : "Block Restaurant Account"}
                    </Button>
                    <p className="text-center text-[10px] text-gray-400 font-bold px-4 uppercase leading-relaxed">
                      Admin Control: Blocking this account will suspend all
                      active food listings and prevent further surplus food
                      recovery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card
                noPadding
                className="overflow-hidden border-none shadow-xl shadow-gray-100/50"
              >
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-black text-gray-900">Orders</h3>
                </div>
                <Table
                  data={orders}
                  columns={[
                    {
                      header: "Order ID",
                      accessorKey: "id",
                      className: "font-black text-blue-600",
                    },
                    {
                      header: "Customer",
                      accessorKey: "customer",
                      className: "font-bold",
                    },
                    {
                      header: "Time",
                      accessorKey: "time",
                      className: "text-gray-500",
                    },
                    {
                      header: "Status",
                      cell: (item) => {
                        const status = item.status.toLowerCase();
                        let variant:
                          | "success"
                          | "warning"
                          | "error"
                          | "info"
                          | "default" = "default";
                        if (status === "completed") variant = "success";
                        else if (status === "pending" || status === "preparing")
                          variant = "warning";
                        else if (status === "ready_for_pickup")
                          variant = "info";
                        else if (status === "cancelled") variant = "error";

                        return <Badge variant={variant}>{item.status}</Badge>;
                      },
                    },
                    {
                      header: "Amount",
                      cell: (item) => (
                        <span className="font-black text-gray-900">
                          ${item.amount.toFixed(2)}
                        </span>
                      ),
                    },
                    {
                      header: "Action",
                      cell: (item) => (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/orders/${item.id}`)}
                          className="font-bold text-[#E4983A]"
                        >
                          View Details
                        </Button>
                      ),
                    },
                  ]}
                />
              </Card>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CustomerReviews restaurantId={id} />
            </div>
          )}

          {activeTab === "documents" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <Card noPadding className="overflow-hidden border-none shadow-xl shadow-gray-100/50">
                <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                  <div className="p-2 bg-orange-50 text-[#E4983A] rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="font-black text-gray-900">Compliance Documents</h3>
                </div>
                <div className="overflow-x-auto">
                  <Table
                    isLoading={isLegalLoading}
                    data={(legalDocsResponse?.data?.documents || []).map((doc: any) => ({
                      id: doc.id,
                      name: doc.DocumentName,
                      status: doc.Status === 'Active' ? 'Verified' : 'Pending Review',
                      updated: doc.LastUpdated ? format(new Date(doc.LastUpdated), 'yyyy-MM-dd') : 'N/A',
                      fileUrl: doc.fileUrl,
                      type: doc.Type,
                      size: doc.Size
                    }))}
                    columns={[
                      {
                        header: "Document Name",
                        accessorKey: "name",
                        className: "font-semibold text-gray-700 py-6",
                      },
                      {
                        header: "Status",
                        cell: (item: any) => (
                          <Badge
                            variant={item.status === "Verified" ? "success" : "warning"}
                            className={item.status === "Verified" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}
                          >
                            {item.status}
                          </Badge>
                        ),
                      },
                      {
                        header: "Last Updated",
                        accessorKey: "updated",
                        className: "text-gray-500",
                      },
                      {
                        header: "Action",
                        cell: (item: any) => (
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => {
                                setSelectedDocument(item);
                                setIsDocumentModalOpen(true);
                              }}
                              className="text-sm font-bold text-gray-400 hover:text-[#E4983A] transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDocDelete(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      <SupportChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        ticket={useMemo(() => ({
          id: "MSG-" + (id || "001"),
          subject: "Direct Message",
          userName: restaurant.name,
          userId: id,
          userType: "Restaurant",
          status: "Active",
        }), [id, restaurant.name, isChatModalOpen])}
      />

      <Modal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        title="Document Details"
        size="lg"
      >
        <div className="animate-in fade-in duration-300">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                {selectedDocument?.name}
              </h2>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                  {selectedDocument?.status}
                </span>
                <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Uploaded on {selectedDocument?.updated}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                <Printer className="h-4 w-4" />
                Print
              </button>
              <button
                onClick={() => selectedDocument?.fileUrl && window.open(selectedDocument.fileUrl)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#E4983A] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-100 hover:bg-[#E85A2D] transition-all"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full mb-8" />

          <div className="bg-white rounded-[2rem] border border-gray-100 p-2 shadow-inner mb-8">
            <div className="w-full aspect-[21/9] bg-gray-50/50 rounded-[1.8rem] flex flex-col items-center justify-center border border-gray-50 relative overflow-hidden group">
              <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 relative z-10">
                <div className="p-2 bg-orange-50 text-[#E4983A] rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {selectedDocument?.name}
                </span>
              </div>

              <div className="absolute inset-0 opacity-10 flex items-center justify-center select-none pointer-events-none">
                <img
                  src={selectedDocument?.fileUrl || "https://images.unsplash.com/photo-1621243804936-775306a8f2e3?w=800"}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setIsDocumentModalOpen(false)}
              className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors p-2"
            >
              Close Viewer
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
