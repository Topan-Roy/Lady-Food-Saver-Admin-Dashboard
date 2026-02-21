import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FilterSelect } from '../components/ui/FilterSelect';
import { GlobalFilter, FilterRange } from '../components/ui/GlobalFilter';
import { KPICard } from '../components/dashboard/KPICard';
import { ExportPreviewModal } from '../components/modals/ExportPreviewModal';
import { FileText, DollarSign, CreditCard, TrendingUp, Search, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useGetTransactionOrdersQuery, useGetAllRestaurantsQuery } from '../redux/features/dashboardApi';

interface TransactionItem {
  id: string;
  customer: string;
  restaurant: string;
  status: string;
  amount: number;
}

export function OrdersTransactions() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all_status');
  const [timeFilter, setTimeFilter] = useState<FilterRange>('week');
  const [customDates, setCustomDates] = useState<{ start: Date; end: Date } | undefined>(undefined);
  const [showExportModal, setShowExportModal] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedProviderId, setSelectedProviderId] = useState('');

  // Fetch restaurants to allow selecting which one to view
  const { data: restaurantsData } = useGetAllRestaurantsQuery({ limit: 50 });

  const { data: transactionsData, isLoading } = useGetTransactionOrdersQuery({
    providerId: selectedProviderId,
    status: statusFilter,
    page,
    limit: 20,
    timeFilter,
    startDate: customDates?.start?.toISOString(),
    endDate: customDates?.end?.toISOString(),
  });

  const summary = transactionsData?.summary || {
    grossRevenue: 0,
    platformEarnings: 0,
    netRestaurantEarnings: 0
  };

  const pagination = transactionsData?.pagination || {
    page: 1,
    totalPages: 1
  };

  const transactions: TransactionItem[] = useMemo(() => {
    if (!transactionsData?.transactions) return [];
    return transactionsData.transactions.map((t: any) => ({
      id: t.orderId,
      customer: t.customer || 'N/A',
      restaurant: t.restaurant || 'N/A',
      status: t.status,
      amount: t.amount || 0,
    }));
  }, [transactionsData]);

  const filteredOrders = useMemo(() => {
    return transactions.filter((order: TransactionItem) => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.restaurant.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [transactions, searchTerm]);

  const restaurantOptions = useMemo(() => {
    if (!restaurantsData?.restaurants) return [];
    return (restaurantsData.restaurants as any[]).map((r: any) => ({
      label: r.restaurantName,
      value: r.restaurantId
    }));
  }, [restaurantsData]);

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
        <div className="flex gap-3">
          {/* <div className="w-64">
            <FilterSelect
              label="Restaurant"
              value={selectedProviderId}
              onChange={setSelectedProviderId}
              options={restaurantOptions}
            />
          </div> */}
          <Button variant="secondary" leftIcon={<FileText className="h-4 w-4" />} onClick={() => setShowExportModal(true)}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Gross Revenue" value={`$${summary.grossRevenue.toLocaleString()}`} icon={DollarSign} color="green" change="+0%" trend="up" />
        <KPICard title="Net Restaurant Earnings" value={`$${summary.netRestaurantEarnings.toLocaleString()}`} icon={CreditCard} color="blue" change="+0%" trend="up" />
        <KPICard title="Platform Earnings" value={`$${summary.platformEarnings.toLocaleString()}`} icon={TrendingUp} color="orange" change="+0%" trend="up" />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <h3 className="font-bold text-gray-900 whitespace-nowrap">Transactions</h3>
            <div className="relative flex-1 max-w-md group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 rounded-lg group-focus-within:bg-[#E4983A] transition-colors">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-white transition-colors" />
              </div>
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!pl-16 bg-gray-50 border-transparent rounded-2xl px-4 py-3 font-medium focus:bg-white focus:ring-4 focus:ring-[#E4983A]/10 focus:border-[#E4983A] outline-none transition-all hover:bg-white hover:border-gray-200 shadow-none h-auto text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <FilterSelect
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: 'All Status', value: 'all_status' },
                { label: 'Completed', value: 'completed' },
                { label: 'Pending', value: 'pending' },
                { label: 'Preparing', value: 'preparing' },
                { label: 'Ready for Pickup', value: 'ready_for_pickup' },
                { label: 'Cancelled', value: 'cancelled' },
              ]}
            />
            <GlobalFilter
              label="Time Range"
              onFilterChange={(range, custom) => {
                setTimeFilter(range);
                if (custom) setCustomDates(custom);
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-500 animate-pulse">
            Loading transactions...
          </div>
        ) : (
          <>
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
              header: 'Status',
              cell: (item: TransactionItem) => {
                const status = (item.status || '').toLowerCase();
                return <Badge variant={status === 'completed' ? 'success' : status === 'pending' || status === 'preparing' ? 'warning' : status === 'cancelled' ? 'error' : 'info'}>
                  {item.status}
                </Badge>
              }
            }, {
              header: 'Amount',
              cell: (item: TransactionItem) => <span className="font-medium">${(item.amount || 0).toLocaleString()}</span>
            }, {
              header: 'Actions',
              cell: (item: TransactionItem) => <Button size="sm" variant="ghost" onClick={() => navigate(`/orders/${item.id}`)}>
                View
              </Button>
            }]} />

            {/* Pagination Controls */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  leftIcon={<ChevronLeft className="h-4 w-4" />}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
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
