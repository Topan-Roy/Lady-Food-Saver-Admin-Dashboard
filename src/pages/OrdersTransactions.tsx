import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { KPICard } from '../components/dashboard/KPICard';
import { exportToCSV } from '../utils/exportCSV';
import { Download, DollarSign, CreditCard, TrendingUp } from 'lucide-react';
const orders = [{
  id: 'ORD-001',
  customer: 'John Doe',
  restaurant: "Joe's Pizza",
  time: 'Today, 2:30 PM',
  status: 'Completed',
  amount: 5.99,
  fee: 0.50
}, {
  id: 'ORD-002',
  customer: 'Jane Smith',
  restaurant: 'Sushi World',
  time: 'Today, 1:15 PM',
  status: 'Pending',
  amount: 11.98,
  fee: 1.00
}, {
  id: 'ORD-003',
  customer: 'Bob Wilson',
  restaurant: 'Taco Bell',
  time: 'Yesterday, 6:45 PM',
  status: 'Cancelled',
  amount: 5.99,
  fee: 0.50
}, {
  id: 'ORD-004',
  customer: 'Alice Brown',
  restaurant: 'Sunset Cafe',
  time: 'Yesterday, 5:30 PM',
  status: 'Completed',
  amount: 17.97,
  fee: 1.50
}];
export function OrdersTransactions() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('30d');

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    // In a real app, timeFilter would involve date calculations.
    // For now, we'll just have it match 'all' orders or simulate logic.
    return matchesStatus;
  });
  return <AdminLayout>
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Orders & Transactions
          </h1>
          <p className="text-gray-500">
            Monitor platform revenue and order status
          </p>
        </div>
        <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />} onClick={() => exportToCSV(orders, 'orders-export')}>
          Export CSV
        </Button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Gross Revenue" value="$45,231.89" change="12.5%" trend="up" icon={DollarSign} color="green" />
        <KPICard title="Net Restaurant Earnings" value="$38,450.00" change="10.2%" trend="up" icon={CreditCard} color="blue" />
        <KPICard title="Platform Earnings" value="$6,781.89" change="8.4%" trend="up" icon={TrendingUp} color="orange" />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Recent Transactions</h3>
          <div className="flex gap-2">
            <Select
              className="w-32"
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Completed', value: 'completed' },
                { label: 'Pending', value: 'pending' },
                { label: 'Cancelled', value: 'cancelled' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <Select
              className="w-40"
              options={[
                { label: 'Last 30 Days', value: '30d' },
                { label: 'Last 7 Days', value: '7d' },
                { label: 'All Time', value: 'all' },
              ]}
              value={timeFilter}
              onChange={setTimeFilter}
            />
          </div>
        </div>
        <Table data={filteredOrders} columns={[{
          header: 'Order ID',
          accessorKey: 'id',
          className: 'font-medium'
        }, {
          header: 'Customer',
          accessorKey: 'customer'
        }, {
          header: 'Restaurant',
          accessorKey: 'restaurant'
        }, {
          header: 'Pickup Time',
          accessorKey: 'time'
        }, {
          header: 'Status',
          cell: item => <Badge variant={item.status === 'Completed' ? 'success' : item.status === 'Pending' ? 'warning' : 'error'}>
            {item.status}
          </Badge>
        }, {
          header: 'Amount',
          cell: item => <span className="font-medium">${item.amount.toFixed(2)}</span>
        }, {
          header: 'Platform Fee',
          cell: item => <span className="text-gray-500">${item.fee.toFixed(2)}</span>
        }, {
          header: 'Actions',
          cell: item => <Button size="sm" variant="ghost" onClick={() => navigate(`/orders/${item.id}`)}>
            View
          </Button>
        }]} />
      </div>
    </div>
  </AdminLayout>;
}