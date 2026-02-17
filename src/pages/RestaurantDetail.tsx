import { useState, useEffect } from "react";
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
    "details" | "items" | "orders" | "reviews" | "documents"
  >((searchParams.get("tab") as any) || "details");
  const [itemsViewMode, setItemsViewMode] = useState<"grid" | "list">("grid");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

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
    totalSales: 0,
    totalOrders: 0,
    platformFeePerOrder: 0,
    nextPayout: { amount: 0, scheduledAt: new Date().toISOString() },
  };

  const activitySummary = activityData?.data || {
    listings: 0,
    orders: 0,
    reviews: 0,
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
    name: profile.restaurantName || "Joe's Pizza",
    owner: profile.ownerName || "Joe Smith",
    status: localStatus || profile.status || "Approved",
    rating: profile.rating || 4.8,
    reviews: profile.reviewCount || 124,
    address: profile.address || location.address,
    phone: profile.contact?.phone || profile.phoneNumber || "+1 (212) 555-0199",
    website: profile.contact?.website || "www.joespizza.com",
    image:
      profile.image ||
      profile.logo ||
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
    cuisine:
      profile.cuisine?.length > 0
        ? profile.cuisine.join(" & ")
        : "Italian & American",
    statusText: (localStatus || profile.status || "Approved").toString(),
    joinedDate: profile.createdAt
      ? format(new Date(profile.createdAt), "MMM dd, yyyy")
      : "Mar 15, 2023",
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
      totalSales: `$${(stats.totalSales || 0).toLocaleString()}`,
      totalOrders: stats.totalOrders || 0,
      platformRevenue: `$${((stats.totalOrders || 0) * (stats.platformFeePerOrder || 0)).toFixed(2)}`,
      restaurantEarnings: `$${((stats.totalSales || 0) - (stats.totalOrders || 0) * (stats.platformFeePerOrder || 0)).toLocaleString()}`,
      nextPayoutAmount: `$${(stats.nextPayout?.amount || 0).toFixed(2)}`,
      nextPayoutDate: stats.nextPayout?.scheduledAt
        ? format(new Date(stats.nextPayout.scheduledAt), "MMM dd")
        : "N/A",
    },
  };

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
  const [listings, setListings] = useState([
    {
      id: 1,
      title: "Pepperoni Slice Box",
      description:
        "Two slices of our famous spicy pepperoni pizza with extra cheese.",
      price: "$5.99",
      stock: 5,
      status: "Approved",
      category: "Pizza",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    },
    {
      id: 2,
      title: "Cheese Pizza Whole",
      description: "A full 18-inch NY style cheese pie, baked fresh.",
      price: "$5.99",
      stock: 2,
      status: "Pending",
      category: "Pizza",
      image:
        "https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?w=400",
    },
    {
      id: 3,
      title: "Garlic Knots",
      description: "Order of 6 garlic knots served with tasty marinara sauce.",
      price: "$5.99",
      stock: 10,
      status: "Rejected",
      category: "Sides",
      image:
        "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400",
    },
  ]);

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

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleEditClick = (item: any) => {
    setSelectedItem({ ...item });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    setListings((prev) =>
      prev.map((item) => (item.id === selectedItem.id ? selectedItem : item)),
    );
    setIsEditModalOpen(false);
  };

  const toggleItemStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Approved" ? "Rejected" : "Approved";
    setListings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
  };

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
                  <MapPin className="h-4 w-4 text-[#FF6B35]" />{" "}
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
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === "details" ? "bg-white text-[#FF6B35] shadow-lg shadow-gray-200" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Info className="h-4 w-4" />
            General Info
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === "items" ? "bg-white text-[#FF6B35] shadow-lg shadow-gray-200" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Package className="h-4 w-4" />
            Product Items
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === "orders" ? "bg-white text-[#FF6B35] shadow-lg shadow-gray-200" : "text-gray-500 hover:text-gray-700"}`}
          >
            <History className="h-4 w-4" />
            Order History
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === "reviews" ? "bg-white text-[#FF6B35] shadow-lg shadow-gray-200" : "text-gray-500 hover:text-gray-700"}`}
          >
            <MessageCircle className="h-4 w-4" />
            Reviews
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === "documents" ? "bg-white text-[#FF6B35] shadow-lg shadow-gray-200" : "text-gray-500 hover:text-gray-700"}`}
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
                <Card className="!bg-[#FF6B35] !border-none !shadow-2xl shadow-orange-200 relative overflow-hidden group">
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
                  <p className="text-[10px] text-[#FF6B35] font-black mt-4 flex items-center gap-1 uppercase tracking-tighter">
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
                        <Info className="h-4 w-4 text-[#FF6B35]" /> Platform
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
                              className="font-bold text-[#FF6B35] flex items-center gap-1 hover:underline"
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
                        <Clock className="h-4 w-4 text-[#FF6B35]" /> Pickup
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
                                <History className="h-4 w-4 text-[#FF6B35]" />
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

          {activeTab === "items" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-gray-900">Manage Items</h3>
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">
                    {listings.length} Results
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <FilterSelect
                    label="Category"
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    options={[
                      { label: "All Categories", value: "all" },
                      { label: "Pizza", value: "Pizza" },
                      { label: "Sides", value: "Sides" },
                      { label: "Beverages", value: "Beverages" },
                    ]}
                  />
                  <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
                    <button
                      onClick={() => setItemsViewMode("grid")}
                      className={`p-2 rounded-lg transition-all ${itemsViewMode === "grid" ? "bg-white text-[#FF6B35] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      <LayoutGrid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setItemsViewMode("list")}
                      className={`p-2 rounded-lg transition-all ${itemsViewMode === "list" ? "bg-white text-[#FF6B35] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      <ListIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {itemsViewMode === "grid" ? (
                <div className="space-y-10">
                  {Object.entries(
                    listings
                      .filter(
                        (item) =>
                          categoryFilter === "all" ||
                          item.category === categoryFilter,
                      )
                      .reduce(
                        (acc, item) => {
                          const cat = item.category || "Other";
                          if (!acc[cat]) acc[cat] = [];
                          acc[cat].push(item);
                          return acc;
                        },
                        {} as Record<string, typeof listings>,
                      ),
                  ).map(([category, items]) => (
                    <div key={category} className="space-y-4">
                      <h4 className="text-lg font-black text-gray-900 border-l-4 border-[#FF6B35] pl-3 uppercase tracking-wider">
                        {category}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                          <Card
                            key={item.id}
                            noPadding
                            className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                          >
                            <div className="relative h-56 overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute top-4 right-4">
                                <Badge
                                  variant={
                                    item.status === "Approved"
                                      ? "success"
                                      : item.status === "Pending"
                                        ? "warning"
                                        : "error"
                                  }
                                  className="shadow-lg backdrop-blur-md"
                                >
                                  {item.status}
                                </Badge>
                              </div>
                              <button
                                onClick={() => handleEditClick(item)}
                                className="absolute bottom-4 right-4 p-3 bg-white text-[#FF6B35] rounded-2xl shadow-xl transform translate-y-12 group-hover:translate-y-0 transition-transform duration-500 hover:bg-[#FF6B35] hover:text-white"
                              >
                                <Edit2 className="h-5 w-5" />
                              </button>
                            </div>
                            <div className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="font-black text-gray-900 text-lg">
                                  {item.title}
                                </h4>
                                <span className="font-black text-[#FF6B35] text-xl">
                                  {item.price}
                                </span>
                              </div>
                              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Inventory
                                  </span>
                                  <span className="text-sm font-bold text-gray-700">
                                    {item.stock} in stock
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      toggleItemStatus(item.id, item.status)
                                    }
                                    className={`p-2 rounded-xl border transition-all ${item.status === "Approved" ? "bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white" : "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white"}`}
                                  >
                                    {item.status === "Approved" ? (
                                      <X className="h-4 w-4" />
                                    ) : (
                                      <Check className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Card
                  noPadding
                  className="overflow-hidden border-none shadow-xl shadow-gray-100/50"
                >
                  <Table
                    data={listings.filter(
                      (item) =>
                        categoryFilter === "all" ||
                        item.category === categoryFilter,
                    )}
                    columns={[
                      {
                        header: "Picture",
                        cell: (item) => (
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-50 shadow-sm">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover transform transition-transform hover:scale-110"
                            />
                          </div>
                        ),
                      },
                      {
                        header: "Item Name",
                        accessorKey: "title",
                        className: "font-black text-gray-900 text-base",
                      },
                      {
                        header: "Price",
                        accessorKey: "price",
                        className: "text-[#FF6B35] font-black text-lg",
                      },
                      {
                        header: "Stock",
                        accessorKey: "stock",
                        className: "font-bold text-gray-700",
                      },
                      {
                        header: "Status",
                        cell: (item) => (
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={
                                item.status === "Approved"
                                  ? "success"
                                  : item.status === "Pending"
                                    ? "warning"
                                    : "error"
                              }
                            >
                              {item.status}
                            </Badge>
                            <button
                              onClick={() =>
                                toggleItemStatus(item.id, item.status)
                              }
                              className={`p-2 rounded-xl transition-all ${item.status === "Approved" ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}
                            >
                              {item.status === "Approved" ? (
                                <X className="h-4 w-4" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        ),
                      },
                      {
                        header: "Action",
                        cell: (item) => (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEditClick(item)}
                            className="px-6 rounded-xl font-bold"
                          >
                            Edit Item
                          </Button>
                        ),
                      },
                    ]}
                  />
                </Card>
              )}
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
                          className="font-bold text-[#FF6B35]"
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
                  <div className="p-2 bg-orange-50 text-[#FF6B35] rounded-lg">
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
                              className="text-sm font-bold text-gray-400 hover:text-[#FF6B35] transition-colors"
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

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Quick Item Edit"
      >
        <div className="space-y-6">
          <div className="flex justify-center -mt-2">
            <div className="relative w-40 h-40 rounded-[32px] overflow-hidden border-4 border-gray-50 shadow-2xl group">
              <img
                src={selectedItem?.image}
                alt=""
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full border border-white/30">
                  Replace Hero Image
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Item Name"
              value={selectedItem?.title || ""}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, title: e.target.value })
              }
              className="rounded-2xl border-gray-100 font-bold"
            />

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                value={selectedItem?.description || ""}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    description: e.target.value,
                  })
                }
                className="w-full min-h-[100px] border-2 border-gray-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none transition-all resize-y text-gray-700 font-medium"
                placeholder="Describe your item..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Platform Standard Price
                </label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-gray-400 font-black">
                  <DollarSign className="h-4 w-4" />
                  {selectedItem?.price || "$5.99"}
                </div>
              </div>
              <Input
                label="Stock Level"
                type="number"
                value={selectedItem?.stock || 0}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    stock: parseInt(e.target.value) || 0,
                  })
                }
                className="rounded-2xl border-gray-100 font-bold"
              />
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between gap-4 border-t border-gray-100 mt-6">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="text-gray-400 font-bold hover:text-gray-600 transition-colors text-sm"
            >
              Discard
            </button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 border-gray-200"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveEdit}
                className="px-6 shadow-xl shadow-orange-500/20"
              >
                Update Item
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <SupportChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        ticket={{
          id: "MSG-" + (id || "001"),
          subject: "Direct Message",
          user: restaurant.name,
          type: "Restaurant Partner",
          status: "Active",
        }}
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
                className="flex items-center gap-2 px-6 py-2.5 bg-[#FF6B35] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-100 hover:bg-[#E85A2D] transition-all"
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
                <div className="p-2 bg-orange-50 text-[#FF6B35] rounded-lg">
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
