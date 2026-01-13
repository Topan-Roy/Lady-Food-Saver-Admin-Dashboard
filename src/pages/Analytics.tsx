import { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { DonutChart } from '../components/charts/DonutChart';
import { KPICard } from '../components/dashboard/KPICard';
import { Table } from '../components/ui/Table';
import { Select } from '../components/ui/Select';
import { Leaf, DollarSign, Utensils } from 'lucide-react';
const topRestaurants = [{
  rank: 1,
  name: "Joe's Pizza",
  orders: 1250,
  revenue: '$45,200'
}, {
  rank: 2,
  name: 'Sushi World',
  orders: 980,
  revenue: '$38,400'
}, {
  rank: 3,
  name: 'Burger King',
  orders: 850,
  revenue: '$22,100'
}, {
  rank: 4,
  name: 'Taco Bell',
  orders: 720,
  revenue: '$18,500'
}, {
  rank: 5,
  name: 'Sunset Cafe',
  orders: 650,
  revenue: '$15,200'
}];
const salesData = [{
  name: 'Jan',
  income: 4000,
  expense: 2400
}, {
  name: 'Feb',
  income: 3000,
  expense: 1398
}, {
  name: 'Mar',
  income: 2000,
  expense: 9800
}, {
  name: 'Apr',
  income: 2780,
  expense: 3908
}, {
  name: 'May',
  income: 1890,
  expense: 4800
}, {
  name: 'Jun',
  income: 2390,
  expense: 3800
}];
const transactionData = [{
  name: 'Mon',
  value: 120
}, {
  name: 'Tue',
  value: 132
}, {
  name: 'Wed',
  value: 101
}, {
  name: 'Thu',
  value: 134
}, {
  name: 'Fri',
  value: 190
}, {
  name: 'Sat',
  value: 230
}, {
  name: 'Sun',
  value: 210
}];
const feedbackData = [{
  name: '5 Stars',
  value: 45
}, {
  name: '4 Stars',
  value: 30
}, {
  name: '3 Stars',
  value: 15
}, {
  name: '1-2 Stars',
  value: 10
}];
export function Analytics() {
  const [timeFilter, setTimeFilter] = useState('6m');
  return <AdminLayout>
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics & Reports
          </h1>
          <p className="text-gray-500">
            Platform performance and sustainability metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            className="w-40"
            options={[
              { label: 'Last 6 Months', value: '6m' },
              { label: 'Last 12 Months', value: '12m' },
              { label: 'All Time', value: 'all' },
            ]}
            value={timeFilter}
            onChange={setTimeFilter}
          />
        </div>
      </div>

      {/* Impact KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Meals Saved" value="12,450" change="15%" trend="up" icon={Utensils} color="orange" />
        <KPICard title="CO2 Reduced (kg)" value="45,200" change="12%" trend="up" icon={Leaf} color="green" />
        <KPICard title="Platform Profit" value="$24,326" change="8%" trend="up" icon={DollarSign} color="blue" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[400px]">
          <LineChart title="Sales Trends" data={salesData} height={350} />
        </div>
        <div className="h-[400px]">
          <BarChart title="Transaction Volume" data={transactionData} height={350} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[350px]">
        <div className="h-full">
          <DonutChart title="Customer Feedback" data={feedbackData} height={300} />
        </div>
        <div className="lg:col-span-2 h-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Top Performing Restaurants
          </h3>
          <Table data={topRestaurants} columns={[{
            header: 'Rank',
            accessorKey: 'rank',
            className: 'w-16'
          }, {
            header: 'Restaurant Name',
            accessorKey: 'name',
            className: 'font-medium'
          }, {
            header: 'Total Orders',
            accessorKey: 'orders'
          }, {
            header: 'Total Revenue',
            accessorKey: 'revenue',
            className: 'text-[#FF6B35] font-bold'
          }]} />
        </div>
      </div>
    </div>
  </AdminLayout>;
}