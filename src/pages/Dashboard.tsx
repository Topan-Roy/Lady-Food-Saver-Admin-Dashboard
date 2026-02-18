import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../components/layout/AdminLayout";
import { KPICard } from "../components/dashboard/KPICard";
import { LineChart } from "../components/charts/LineChart";
import { BarChart } from "../components/charts/BarChart";
import { TrendingWidget } from "../components/dashboard/TrendingWidget";
import { TopRestaurants } from "../components/dashboard/TopRestaurants";
import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { CustomerReviews } from "../components/dashboard/CustomerReviews";
import { ShoppingBag, Users, DollarSign } from "lucide-react";
import { Table } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { GlobalFilter, FilterRange } from "../components/ui/GlobalFilter";
import {
  useGetDashboardStatsQuery,
  useGetRevenueStatsQuery,
  useGetOrderStatsQuery,
  useGetRecentOrdersQuery,
} from "../redux/features/dashboardApi";

// Base data for different time periods
const baseKPIData = {
  today: [
    {
      title: "Total Orders",
      value: "152",
      change: "2.1%",
      trend: "up",
      icon: ShoppingBag,
      color: "#E4983A",
    },
    {
      title: "Total Customers",
      value: "48",
      change: "1.2%",
      trend: "up",
      icon: Users,
      color: "orange",
    },
    {
      title: "Total Revenue",
      value: "$8,450",
      change: "3.5%",
      trend: "up",
      icon: DollarSign,
      color: "orange",
    },
  ],
  week: [
    {
      title: "Total Orders",
      value: "1,248",
      change: "1.8%",
      trend: "up",
      icon: ShoppingBag,
      color: "orange",
    },
    {
      title: "Total Customers",
      value: "342",
      change: "0.9%",
      trend: "up",
      icon: Users,
      color: "orange",
    },
    {
      title: "Total Revenue",
      value: "$52,340",
      change: "2.8%",
      trend: "up",
      icon: DollarSign,
      color: "orange",
    },
  ],
  month: [
    {
      title: "Total Orders",
      value: "48,652",
      change: "1.58%",
      trend: "up",
      icon: ShoppingBag,
      color: "orange",
    },
    {
      title: "Total Customers",
      value: "1,248",
      change: "0.42%",
      trend: "down",
      icon: Users,
      color: "orange",
    },
    {
      title: "Total Revenue",
      value: "$215,860",
      change: "2.36%",
      trend: "up",
      icon: DollarSign,
      color: "orange",
    },
  ],
  year: [
    {
      title: "Total Orders",
      value: "584,250",
      change: "12.5%",
      trend: "up",
      icon: ShoppingBag,
      color: "orange",
    },
    {
      title: "Total Customers",
      value: "15,680",
      change: "8.2%",
      trend: "up",
      icon: Users,
      color: "orange",
    },
    {
      title: "Total Revenue",
      value: "$2,590,420",
      change: "15.8%",
      trend: "up",
      icon: DollarSign,
      color: "orange",
    },
  ],
  custom: [
    {
      title: "Total Orders",
      value: "25,340",
      change: "4.2%",
      trend: "up",
      icon: ShoppingBag,
      color: "orange",
    },
    {
      title: "Total Customers",
      value: "680",
      change: "2.1%",
      trend: "up",
      icon: Users,
      color: "orange",
    },
    {
      title: "Total Revenue",
      value: "$125,680",
      change: "5.6%",
      trend: "up",
      icon: DollarSign,
      color: "orange",
    },
  ],
} as const;

const baseRevenueData = {
  today: [
    { name: "6AM", income: 450, expense: 200 },
    { name: "9AM", income: 850, expense: 400 },
    { name: "12PM", income: 1200, expense: 600 },
    { name: "3PM", income: 950, expense: 450 },
    { name: "6PM", income: 1400, expense: 700 },
    { name: "9PM", income: 800, expense: 350 },
  ],
  week: [
    { name: "Mon", income: 6500, expense: 3200 },
    { name: "Tue", income: 7200, expense: 3800 },
    { name: "Wed", income: 8100, expense: 4200 },
    { name: "Thu", income: 7800, expense: 3900 },
    { name: "Fri", income: 9200, expense: 4500 },
    { name: "Sat", income: 10500, expense: 5200 },
    { name: "Sun", income: 8900, expense: 4400 },
  ],
  month: [
    { name: "Week 1", income: 45000, expense: 22000 },
    { name: "Week 2", income: 52000, expense: 26000 },
    { name: "Week 3", income: 48000, expense: 24000 },
    { name: "Week 4", income: 55000, expense: 28000 },
  ],
  year: [
    { name: "Jan", income: 180000, expense: 90000 },
    { name: "Feb", income: 165000, expense: 82000 },
    { name: "Mar", income: 195000, expense: 98000 },
    { name: "Apr", income: 210000, expense: 105000 },
    { name: "May", income: 225000, expense: 112000 },
    { name: "Jun", income: 240000, expense: 120000 },
    { name: "Jul", income: 235000, expense: 118000 },
    { name: "Aug", income: 250000, expense: 125000 },
    { name: "Sep", income: 245000, expense: 122000 },
    { name: "Oct", income: 260000, expense: 130000 },
    { name: "Nov", income: 255000, expense: 128000 },
    { name: "Dec", income: 270000, expense: 135000 },
  ],
  custom: [
    { name: "Period 1", income: 25000, expense: 12000 },
    { name: "Period 2", income: 28000, expense: 14000 },
    { name: "Period 3", income: 32000, expense: 16000 },
    { name: "Period 4", income: 30000, expense: 15000 },
  ],
};

const baseOrderStatusData = {
  today: [
    { name: "6AM", value: 12 },
    { name: "9AM", value: 25 },
    { name: "12PM", value: 45 },
    { name: "3PM", value: 38 },
    { name: "6PM", value: 52 },
    { name: "9PM", value: 30 },
  ],
  week: [
    { name: "Mon", value: 165 },
    { name: "Tue", value: 178 },
    { name: "Wed", value: 195 },
    { name: "Thu", value: 188 },
    { name: "Fri", value: 210 },
    { name: "Sat", value: 235 },
    { name: "Sun", value: 198 },
  ],
  month: [
    { name: "Week 1", value: 1250 },
    { name: "Week 2", value: 1380 },
    { name: "Week 3", value: 1290 },
    { name: "Week 4", value: 1450 },
  ],
  year: [
    { name: "Jan", value: 4200 },
    { name: "Feb", value: 3900 },
    { name: "Mar", value: 4500 },
    { name: "Apr", value: 4800 },
    { name: "May", value: 5100 },
    { name: "Jun", value: 5400 },
    { name: "Jul", value: 5200 },
    { name: "Aug", value: 5600 },
    { name: "Sep", value: 5300 },
    { name: "Oct", value: 5800 },
    { name: "Nov", value: 5500 },
    { name: "Dec", value: 6000 },
  ],
  custom: [
    { name: "Period 1", value: 850 },
    { name: "Period 2", value: 920 },
    { name: "Period 3", value: 1050 },
    { name: "Period 4", value: 980 },
  ],
};

const recentOrders = [
  {
    id: "ORD1025",
    menu: "Salmon Sushi Roll",
    category: "Seafood",
    qty: 1,
    amount: "$5.99",
    customer: "Dana White",
    status: "On Process",
    img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100",
  },
  {
    id: "ORD1026",
    menu: "Spaghetti Carbonara",
    category: "Pasta",
    qty: 1,
    amount: "$5.99",
    customer: "Eve Carter",
    status: "Cancelled",
    img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=100",
  },
  {
    id: "ORD1027",
    menu: "Classic Cheeseburger",
    category: "Burger",
    qty: 1,
    amount: "$5.99",
    customer: "Charlie Brown",
    status: "Completed",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100",
  },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<FilterRange>("month");

  // Dynamically compute data based on selected filter
  const { data: analyticsData, error } = useGetDashboardStatsQuery(timeFilter);

  if (error) console.error("Dashboard Analytics Error:", error);
  console.log("Dashboard Analytics Data:", analyticsData);

  const kpiData = useMemo(() => {
    if (analyticsData?.data) {
      const { totalOrders, totalCustomers, totalRevenue } = analyticsData.data;
      return [
        {
          title: "Total Orders",
          value: totalOrders?.toLocaleString() ?? "0",
          change: "0%",
          trend: "up" as const,
          icon: ShoppingBag,
          color: "orange" as const,
        },
        {
          title: "Total Customers",
          value: totalCustomers?.toLocaleString() ?? "0",
          change: "0%",
          trend: "up" as const,
          icon: Users,
          color: "orange" as const,
        },
        {
          title: "Total Revenue",
          value: `$${totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "0.00"}`,
          change: "0%",
          trend: "up" as const,
          icon: DollarSign,
          color: "orange" as const,
        },
      ];
    }
    return baseKPIData[timeFilter] || baseKPIData.week;
  }, [timeFilter, analyticsData]);

  // Revenue Data
  const { data: revenueStats } = useGetRevenueStatsQuery(timeFilter);

  const revenueData = useMemo(() => {
    if (revenueStats?.data) {
      return revenueStats.data.labels.map((label: string, index: number) => ({
        name: label,
        income: revenueStats.data.values[index],
      }));
    }
    return baseRevenueData[timeFilter] || baseRevenueData.week;
  }, [timeFilter, revenueStats]);

  // Order Data
  const { data: orderStats } = useGetOrderStatsQuery(timeFilter);

  const orderStatusData = useMemo(() => {
    if (orderStats?.data) {
      return orderStats.data.labels.map((label: string, index: number) => ({
        name: label,
        value: orderStats.data.values[index],
      }));
    }
    return baseOrderStatusData[timeFilter] || baseOrderStatusData.week;
  }, [timeFilter, orderStats]);

  // Recent Orders Data
  const { data: recentOrdersData } = useGetRecentOrdersQuery({});

  const formattedRecentOrders = useMemo(() => {
    if (recentOrdersData?.data) {
      return recentOrdersData.data.map((order: any) => ({
        id: order.orderId,
        menu: order.menu?.title || "Unknown Item",
        category: "", // API doesn't provide category yet
        qty: order.quantity,
        amount: `$${order.totalPrice.toFixed(2)}`,
        customer: order.customerName,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1), // Capitalize
        img: order.menu?.image || "https://via.placeholder.com/100", // Fallback image
      }));
    }
    return [];
  }, [recentOrdersData]);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        {/* Main Layout */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1 space-y-8 min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 font-medium">
                  Hello Orlando, welcome back!
                </p>
              </div>
              <GlobalFilter
                onFilterChange={(range: FilterRange, custom) => {
                  console.log("Filter changed:", range, custom);
                  setTimeFilter(range);
                }}
              />
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {kpiData.slice(0, 3).map((kpi, i) => (
                <div key={i} className="h-40">
                  <KPICard {...kpi} />
                </div>
              ))}
            </div>

            {/* Charts Row 1 - Total Revenue Full Width */}
            <div className="h-[400px]">
              <LineChart
                title="Total Revenue"
                data={revenueData}
                height={300}
                lines={[{ key: "income", color: "#E4983A", name: "Revenue" }]}
              />
            </div>

            {/* Charts Row 2 - Orders Overview */}
            <div className="h-[400px]">
              <BarChart
                title="Orders Overview"
                data={orderStatusData}
                height={300}
              />
            </div>

            {/* Recent Orders Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Recent Orders
                </h3>
                <button
                  onClick={() => navigate("/orders")}
                  className="text-sm font-medium text-[#E4983A] hover:text-[#E4983A] transition-colors"
                >
                  See All Orders
                </button>
              </div>
              <Table
                data={
                  formattedRecentOrders.length > 0
                    ? formattedRecentOrders
                    : recentOrders.slice(0, 5)
                }
                onRowClick={(item) => navigate(`/orders/${item.id}`)}
                columns={[
                  {
                    header: "Order ID",
                    accessorKey: "id",
                    cell: (item: any) => (
                      <button
                        onClick={() => navigate(`/orders/${item.id}`)}
                        className="text-[#E4983A] hover:text-[#E4983A] font-medium hover:underline transition-colors"
                      >
                        {item.id}
                      </button>
                    ),
                  },
                  {
                    header: "Menu",
                    cell: (item: any) => (
                      <div className="flex items-center gap-3">
                        <img
                          src={item.img}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.menu}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.category}
                          </p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    header: "Qty",
                    accessorKey: "qty",
                  },
                  {
                    header: "Amount",
                    accessorKey: "amount",
                    cell: (item: any) => (
                      <span className="font-medium text-[#E4983A]">
                        {item.amount}
                      </span>
                    ),
                  },
                  {
                    header: "Customer",
                    accessorKey: "customer",
                  },
                  {
                    header: "Status",
                    cell: (item: any) => (
                      <Badge
                        variant={
                          item.status === "Completed"
                            ? "success"
                            : item.status === "Cancelled"
                              ? "error"
                              : "warning"
                        }
                      >
                        {item.status}
                      </Badge>
                    ),
                  },
                ]}
              />
            </div>

            {/* Customer Reviews moved here */}
            <CustomerReviews />
          </div>

          {/* Right Sidebar (Unified) */}
          <div className="w-full xl:w-80 space-y-8">
            <TrendingWidget />
            <TopRestaurants />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
