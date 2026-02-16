import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Ban } from 'lucide-react';
import { useGetSingleCustomerQuery, useGetCustomerProfileQuery } from '../redux/features/dashboardApi';
import { format } from 'date-fns';

export function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetching data from both endpoints
  // First get stats/basic info which contains the correct CustomarId for profile fetch
  const { data: statsResponse, isLoading: isStatsLoading } = useGetSingleCustomerQuery(id);
  const statsData = statsResponse || {};

  // Use CustomarId (or CustomerID) from stats to fetch profile
  const profileId = statsData.CustomarId || statsData.CustomerID || id; // Fallback to URL id if API id missing
  const { data: profileResponse, isLoading: isProfileLoading } = useGetCustomerProfileQuery(profileId, {
    skip: !profileId
  });

  const profileData = profileResponse || {};
  // Loading is true if stats are loading, or if we have a profileId and profile is loading
  const isLoading = isStatsLoading || (!!profileId && isProfileLoading);

  // Combine data for UI
  const customer = {
    id: profileData.CustomerID || statsData.CustomarId || id,
    name: profileData.Name || statsData.CustomarName || 'N/A',
    email: profileData.email || 'N/A',
    phone: profileData.phoen || profileData.phone || 'N/A',
    location: profileData.state || 'N/A',
    joinDate: profileData.date ? format(new Date(profileData.date), 'MMM dd, yyyy') : 'N/A',
    status: profileData.isActive === false ? 'Blocked' : 'Active', // Default to Active if undefined or true
    avatar: profileData.profilePick || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    stats: {
      totalOrders: statsData.summary?.totalOrders || 0,
      totalSpent: ` ${statsData.summary?.totalSpent || 0}`,
      avgOrderValue: ` ${statsData.summary?.avgOrderValue || 0}`,
      savedMeals: 0
    }
  };

  console.log('Detail Page Debug:', { urlId: id, statsData, profileData });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-20 h-20 bg-gray-100 rounded-full" />
            <div className="h-4 w-48 bg-gray-100 rounded" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!profileData.CustomerID && !statsData.CustomarId && !isLoading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-gray-500">
          <p className="text-xl font-bold mb-4">Customer Not Found</p>
          <p className="mb-6">We couldn't find the customer details for ID: {id}</p>
          <Button onClick={() => navigate('/users')}>Back to User Management</Button>
        </div>
      </AdminLayout>
    );
  }

  const orderHistory = (statsData.orders || []).map((order: any) => ({
    id: order._id || order.orderId || 'N/A',
    restaurant: order.restaurantName || 'N/A',
    date: order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'N/A',
    amount: order.totalAmount || 'N/A',
    status: order.status || 'Pending'
  }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/users')}>
          Back to Users
        </Button>

        {/* Header Profile Card */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar
              src={customer.avatar}
              alt={customer.name}
              fallback={customer.name.split(' ').map((n: string) => n[0]).join('')}
              size="lg"
              className="w-24 h-24"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {customer.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={customer.status === 'Active' ? 'success' : 'error'}>{customer.status}</Badge>
                    <span className="text-sm text-gray-500">
                      Customer ID: #{customer.id}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="danger" leftIcon={<Ban className="h-4 w-4" />}>
                    Block User
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{customer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{customer.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Joined {customer.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{customer.stats.totalOrders}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{customer.stats.totalSpent}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Avg. Order Value</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{customer.stats.avgOrderValue}</p>
          </Card>
          {/* <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Meals Saved</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{customer.stats.savedMeals}</p>
          </Card> */}
        </div>

        {/* Order History */}
        <Card>
          <Table
            data={orderHistory}
            columns={[
              { header: 'ORDER ID', accessorKey: 'id', className: 'uppercase' },
              { header: 'RESTAURANT', accessorKey: 'restaurant' },
              { header: 'DATE', accessorKey: 'date' },
              { header: 'AMOUNT', accessorKey: 'amount' },
              {
                header: 'STATUS',
                accessorKey: 'status',
                cell: (item: any) => (
                  <Badge
                    variant={
                      item.status === 'Completed'
                        ? 'success'
                        : item.status === 'Cancelled'
                          ? 'error'
                          : 'warning'
                    }
                  >
                    {item.status}
                  </Badge>
                ),
              },
              {
                header: 'ACTION',
                cell: () => (
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </AdminLayout>
  );
}