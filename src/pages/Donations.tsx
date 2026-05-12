import { useState, useMemo } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { FilterSelect } from '../components/ui/FilterSelect';
import { Gift, Heart, UserCheck, Loader2 } from 'lucide-react';
import { useGetDonationsQuery } from '../redux/features/dashboardApi';
import { format } from 'date-fns';

export function Donations() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: apiResponse, isLoading } = useGetDonationsQuery({
    status: statusFilter,
    page: currentPage,
    limit: 10,
  });

  const tokens = useMemo(() => {
    if (!apiResponse?.data?.tokens) return [];
    return apiResponse.data.tokens.map((item: any) => ({
      id: item._id,
      tokenId: item.tokenId,
      donorName: item.donorUserId?.fullName || 'Anonymous',
      donorEmail: item.donorUserId?.email || '',
      mealCount: item.mealCount,
      totalPaid: `$${item.totalPaid.toFixed(2)}`,
      status: item.status,
      claimedByName: item.claimedByUserId?.fullName || null,
      createdAt: item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy HH:mm') : 'N/A',
      claimedAt: item.claimedAt ? format(new Date(item.claimedAt), 'MMM dd, yyyy HH:mm') : null,
    }));
  }, [apiResponse]);

  const summary = apiResponse?.data?.summary || { total: 0, available: 0, claimed: 0 };
  const pagination = apiResponse?.data?.pagination;

  if (isLoading && !apiResponse) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-10 w-10 text-[#E4983A] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Donations Management</h1>
            <p className="text-gray-500">Monitor and manage free meal tokens</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Gift className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Tokens</p>
                <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-xl">
                <Heart className="h-6 w-6 text-[#E4983A]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Available</p>
                <p className="text-2xl font-bold text-gray-900">{summary.available}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Claimed</p>
                <p className="text-2xl font-bold text-gray-900">{summary.claimed}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex bg-white p-4 rounded-3xl border border-gray-100 shadow-sm justify-end">
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Available', value: 'available' },
              { label: 'Claimed', value: 'claimed' },
            ]}
          />
        </div>

        {/* Table */}
        <Card>
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Donation Tokens</h3>
          </div>
          
          <Table
            data={tokens}
            isLoading={isLoading}
            currentPage={pagination?.page || currentPage}
            totalPages={pagination?.totalPages || 1}
            totalResults={pagination?.total || tokens.length}
            onPageChange={setCurrentPage}
            columns={[
              {
                header: 'Token ID',
                accessorKey: 'tokenId',
                className: 'font-mono text-xs text-gray-600',
              },
              {
                header: 'Donor',
                cell: (item: any) => (
                  <div>
                    <p className="font-medium text-gray-900">{item.donorName}</p>
                    <p className="text-xs text-gray-500">{item.donorEmail}</p>
                  </div>
                )
              },
              {
                header: 'Meals',
                accessorKey: 'mealCount',
                className: 'font-bold text-center',
              },
              {
                header: 'Total Paid',
                accessorKey: 'totalPaid',
                className: 'font-semibold text-[#E4983A]',
              },
              {
                header: 'Status',
                cell: (item: any) => {
                  const status = item.status.toLowerCase();
                  return (
                    <Badge variant={status === 'available' ? 'success' : 'default'}>
                      {status === 'available' ? 'Available' : 'Claimed'}
                    </Badge>
                  );
                }
              },
              {
                header: 'Claimed By',
                cell: (item: any) => item.claimedByName ? (
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.claimedByName}</p>
                    <p className="text-xs text-gray-500">{item.claimedAt}</p>
                  </div>
                ) : (
                  <span className="text-gray-400 italic">Unclaimed</span>
                )
              },
              {
                header: 'Created At',
                accessorKey: 'createdAt',
                className: 'text-xs text-gray-500',
              }
            ]}
          />
        </Card>
      </div>
    </AdminLayout>
  );
}
