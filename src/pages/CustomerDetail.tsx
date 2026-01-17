import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Ban } from 'lucide-react';
export function CustomerDetail() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  // Mock data - in real app fetch based on ID
  const customer = {
    id,
    name: 'Alice Brown',
    email: 'alice@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinDate: 'Jan 15, 2023',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    stats: {
      totalOrders: 45,
      totalSpent: '$1,240.50',
      avgOrderValue: '$27.56',
      savedMeals: 32
    }
  };
  const orderHistory = [{
    id: 'ORD-101',
    restaurant: "Joe's Pizza",
    date: 'Oct 24, 2023',
    amount: '$15.50',
    status: 'Completed'
  }, {
    id: 'ORD-098',
    restaurant: 'Sushi World',
    date: 'Oct 20, 2023',
    amount: '$32.00',
    status: 'Completed'
  }, {
    id: 'ORD-085',
    restaurant: 'Taco Bell',
    date: 'Oct 15, 2023',
    amount: '$12.00',
    status: 'Cancelled'
  }];
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
            fallback={customer.name.split(' ').map(n => n[0]).join('')}
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
                  <Badge variant="success">{customer.status}</Badge>
                  <span className="text-sm text-gray-500">
                    Customer ID: #{id}
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
          cell: item => <Badge variant={item.status === 'Completed' ? 'success' : 'error'}>
            {item.status}
          </Badge>
        }, {
          header: 'Action',
          cell: (item) => <Button size="sm" variant="ghost" onClick={() => navigate(`/orders/${item.id}`)}>
            View
          </Button>
        }]} />
      </Card>
    </div>
  </AdminLayout>;
}