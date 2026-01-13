import { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { KPICard } from '../components/dashboard/KPICard';
import { LineChart } from '../components/charts/LineChart';
import { DonutChart } from '../components/charts/DonutChart';
import { BarChart } from '../components/charts/BarChart';
import { TrendingWidget } from '../components/dashboard/TrendingWidget';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { CustomerReviews } from '../components/dashboard/CustomerReviews';
import { ShoppingBag, Users, DollarSign, Store, AlertCircle, TrendingUp } from 'lucide-react';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
const kpiData = [{
  title: 'Total Orders',
  value: '48,652',
  change: '1.58%',
  trend: 'up',
  icon: ShoppingBag,
  color: 'orange'
}, {
  title: 'Total Customers',
  value: '1,248',
  change: '0.42%',
  trend: 'down',
  icon: Users,
  color: 'orange'
}, {
  title: 'Total Revenue',
  value: '$215,860',
  change: '2.36%',
  trend: 'up',
  icon: DollarSign,
  color: 'orange'
}, {
  title: 'Active Restaurants',
  value: '156',
  change: '5.2%',
  trend: 'up',
  icon: Store,
  color: 'blue'
}, {
  title: 'Platform Earnings',
  value: '$12,450',
  change: '3.1%',
  trend: 'up',
  icon: TrendingUp,
  color: 'green'
}, {
  title: 'Flagged Listings',
  value: '23',
  change: '12%',
  trend: 'down',
  icon: AlertCircle,
  color: 'purple'
}] as const;
const revenueData = [{
  name: 'Mar',
  income: 4000,
  expense: 2400
}, {
  name: 'Apr',
  income: 3000,
  expense: 1398
}, {
  name: 'May',
  income: 2000,
  expense: 9800
}, {
  name: 'Jun',
  income: 2780,
  expense: 3908
}, {
  name: 'Jul',
  income: 1890,
  expense: 4800
}, {
  name: 'Aug',
  income: 2390,
  expense: 3800
}, {
  name: 'Sep',
  income: 3490,
  expense: 4300
}, {
  name: 'Oct',
  income: 4200,
  expense: 2400
}];
const categoryData = [{
  name: 'Seafood',
  value: 30
}, {
  name: 'Beverages',
  value: 25
}, {
  name: 'Dessert',
  value: 25
}, {
  name: 'Pasta',
  value: 20
}];
const orderStatusData = [{
  name: 'Mon',
  value: 65
}, {
  name: 'Tue',
  value: 59
}, {
  name: 'Wed',
  value: 80
}, {
  name: 'Thu',
  value: 81
}, {
  name: 'Fri',
  value: 56
}, {
  name: 'Sat',
  value: 55
}, {
  name: 'Sun',
  value: 40
}];
const recentOrders = [{
  id: 'ORD1025',
  menu: 'Salmon Sushi Roll',
  category: 'Seafood',
  qty: 1,
  amount: '$5.99',
  customer: 'Dana White',
  status: 'On Process',
  img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100'
}, {
  id: 'ORD1026',
  menu: 'Spaghetti Carbonara',
  category: 'Pasta',
  qty: 1,
  amount: '$5.99',
  customer: 'Eve Carter',
  status: 'Cancelled',
  img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=100'
}, {
  id: 'ORD1027',
  menu: 'Classic Cheeseburger',
  category: 'Burger',
  qty: 1,
  amount: '$5.99',
  customer: 'Charlie Brown',
  status: 'Completed',
  img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100'
}];
export function Dashboard() {
  const [timeFilter, setTimeFilter] = useState('month');
  return <AdminLayout>
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Main Content Area */}
      <div className="flex-1 space-y-8 min-w-0">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Hello Orlando, welcome back!</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpiData.slice(0, 3).map((kpi, i) => <div key={i} className="h-40">
            <KPICard {...kpi} />
          </div>)}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
          <div className="lg:col-span-2 h-full">
            <LineChart title="Total Revenue" data={revenueData} height={300} />
          </div>
          <div className="h-full">
            <DonutChart title="Top Categories" data={categoryData} height={300} />
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="h-[350px]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2 h-full">
              <BarChart title="Orders Overview" data={orderStatusData} height={250} />
            </div>
            <div className="h-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Order Types
                </h3>
                <Select
                  className="w-32"
                  options={[
                    { label: 'This Month', value: 'month' },
                    { label: 'Last Month', value: 'last_month' },
                  ]}
                  value={timeFilter}
                  onChange={setTimeFilter}
                />
              </div>
              <div className="space-y-6">
                {[{
                  label: 'Dine-In',
                  pct: '45%',
                  val: 900,
                  icon: Store
                }, {
                  label: 'Takeaway',
                  pct: '30%',
                  val: 600,
                  icon: ShoppingBag
                }, {
                  label: 'Online',
                  pct: '25%',
                  val: 500,
                  icon: Users
                }].map((item, i) => <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-orange-50 rounded-lg text-[#FF6B35]">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.label}
                      </p>
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1">
                        <div className="h-full bg-[#FF6B35] rounded-full" style={{
                          width: item.pct
                        }}></div>
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    {item.val}
                  </span>
                </div>)}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <button className="text-sm font-medium text-[#FF6B35] hover:text-[#E85A2D]">
              See All Orders
            </button>
          </div>
          <Table data={recentOrders} columns={[{
            header: 'Order ID',
            accessorKey: 'id'
          }, {
            header: 'Menu',
            cell: item => <div className="flex items-center gap-3">
              <img src={item.img} alt="" className="w-10 h-10 rounded-lg object-cover" />
              <div>
                <p className="font-medium text-gray-900">{item.menu}</p>
                <p className="text-xs text-gray-500">{item.category}</p>
              </div>
            </div>
          }, {
            header: 'Qty',
            accessorKey: 'qty'
          }, {
            header: 'Amount',
            accessorKey: 'amount',
            cell: item => <span className="font-medium text-[#FF6B35]">
              {item.amount}
            </span>
          }, {
            header: 'Customer',
            accessorKey: 'customer'
          }, {
            header: 'Status',
            cell: item => <Badge variant={item.status === 'Completed' ? 'success' : item.status === 'Cancelled' ? 'error' : 'warning'}>
              {item.status}
            </Badge>
          }]} />
        </div>

        {/* New Customer Reviews Section */}
        <div>
          <CustomerReviews />
        </div>
      </div>

      {/* Right Sidebar Widgets */}
      <div className="w-full xl:w-80 space-y-8">
        <TrendingWidget />
        <ActivityFeed />
      </div>
    </div>
  </AdminLayout>;
}