import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Ban } from 'lucide-react';
import { useGetCustomersQuery, useGetCustomerDashboardQuery } from '../redux/features/dashboardApi';
import { format } from 'date-fns';
import { useMemo } from 'react';

export function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetching general customer list to find the profile
  const { data: customersResponse, isLoading: isCustomersLoading } = useGetCustomersQuery({ limit: 100 });

  // New: Fetch detailed dashboard data (stats and orders)
  const { data: dashboardResponse, isLoading: isDashboardLoading } = useGetCustomerDashboardQuery({ providerId: id });

  // Aggressively find the specific customer in the API list
  const customerData = useMemo(() => {
    const list = customersResponse?.data;
    if (!list || !Array.isArray(list)) return null;

    const searchId = String(id).toLowerCase();

    return list.find((c: any) =>
      String(c._id).toLowerCase() === searchId ||
      String(c.userId).toLowerCase() === searchId ||
      String(c.id).toLowerCase() === searchId ||
      String(c.fullName).toLowerCase().replace(/\s/g, '-') === searchId
    );
  }, [customersResponse, id]);

  // Transform API data to fit existing UI structure
  const customer = {
    id: customerData?._id || customerData?.userId || id,
    name: customerData?.fullName || 'N/A',
    email: customerData?.email || 'N/A',
    phone: customerData?.phoneNumber || 'N/A',
    location: (() => {
      const addr = customerData?.address;
      if (typeof addr === 'string') return addr || 'N/A';
      if (typeof addr === 'object' && addr !== null) {
        return addr.label || addr.address || 'N/A';
      }
      return 'N/A';
    })(),
    joinDate: customerData?.createdAt ? format(new Date(customerData.createdAt), 'MMM dd, yyyy') : 'N/A',
    status: (customerData?.isBlocked ? 'Blocked' : 'Active') || 'Active',
    avatar: customerData?.profilePicture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    stats: {
      totalOrders: dashboardResponse?.summary?.totalOrders || 0,
      totalSpent: `$${(dashboardResponse?.summary?.totalSpent || 0).toLocaleString()}`,
      avgOrderValue: `$${(dashboardResponse?.summary?.avgOrderValue || 0).toLocaleString()}`,
      savedMeals: customerData?.followers || 0
    }
  };

  console.log('Detail Page Debug:', { urlId: id, foundData: customerData });

  const orderHistory = useMemo(() => {
    return (dashboardResponse?.orders || []).map((order: any) => ({
      id: order.orderId,
      restaurant: order.restaurant,
      date: order.date ? format(new Date(order.date), 'MMM dd, yyyy') : 'N/A',
      amount: `$${(order.amount || 0).toLocaleString()}`,
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1)
    }));
  }, [dashboardResponse]);

  if (isCustomersLoading || isDashboardLoading) {
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

  if (!customerData && !isCustomersLoading) {
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

  return <AdminLayout>
    <div className="space-y-6">
      <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate(-1)}>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[{
          label: 'Total Orders',
          value: customer.stats.totalOrders
        }, {
          label: 'Total Spent',
          value: customer.stats.totalSpent
        }, {
          label: 'Avg. Order Value',
          value: customer.stats.avgOrderValue
        }, {
          label: 'Meals Saved',
          value: customer.stats.savedMeals
        }].map((stat, i) => <Card key={i} className="text-center p-6">
          <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
        </Card>)}
      </div>

      {/* Order History */}
      <Card title="Order History">
        <Table data={orderHistory} columns={[{
          header: 'Order ID',
          accessorKey: 'id',
          className: 'font-medium'
        }, {
          header: 'Restaurant',
          accessorKey: 'restaurant'
        }, {
          header: 'Date',
          accessorKey: 'date'
        }, {
          header: 'Amount',
          accessorKey: 'amount'
        }, {
          header: 'Status',
          cell: (item: any) => {
            const status = String(item.status).toLowerCase();
            const variant = status === 'completed' ? 'success' : status === 'pending' || status === 'preparing' ? 'warning' : 'error';
            return <Badge variant={variant as any}>
              {item.status}
            </Badge>
          }
        }, {
          header: 'Action',
          cell: (item: any) => <Button size="sm" variant="ghost" onClick={() => navigate(`/orders/${item.id}`)}>
            View
          </Button>
        }]} />
      </Card>
    </div>
  </AdminLayout>;
}