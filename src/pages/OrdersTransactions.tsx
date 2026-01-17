import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FilterSelect } from '../components/ui/FilterSelect';
import { KPICard } from '../components/dashboard/KPICard';
import { ExportPreviewModal } from '../components/modals/ExportPreviewModal';
import { FileText, DollarSign, CreditCard, TrendingUp, Search } from 'lucide-react';
import { GlobalFilter, FilterRange } from '../components/ui/GlobalFilter';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState<FilterRange>('month');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showExportModal, setShowExportModal] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.restaurant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    // In a real app, timeFilter would involve date calculations.
    // For now, we'll just have it match 'all' orders or simulate logic.
    return matchesStatus && matchesSearch;
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
        <Button variant="secondary" leftIcon={<FileText className="h-4 w-4" />} onClick={() => setShowExportModal(true)}>
          Export Report
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
        <div className="p-6 border-b border-gray-100 flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <h3 className="font-bold text-gray-900 whitespace-nowrap">Transactions</h3>
            {/* Functional Search */}
            <div className="relative flex-1 max-w-md group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 rounded-lg group-focus-within:bg-[#FF6B35] transition-colors">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-white transition-colors" />
              </div>
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!pl-16 bg-gray-50 border-transparent rounded-2xl px-4 py-3 font-medium focus:bg-white focus:ring-4 focus:ring-[#FF6B35]/10 focus:border-[#FF6B35] outline-none transition-all hover:bg-white hover:border-gray-200 shadow-none h-auto text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <FilterSelect
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Completed', value: 'completed' },
                { label: 'Pending', value: 'pending' },
                { label: 'Cancelled', value: 'cancelled' },
              ]}
            />
            <div className="h-8 w-px bg-gray-200 mx-2" />
            <GlobalFilter
              onFilterChange={(range: FilterRange) => setTimeFilter(range)}
              className="w-auto"
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

      <ExportPreviewModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={filteredOrders}
        title="Orders & Transactions Report"
      />
    </div>
  </AdminLayout>;
}