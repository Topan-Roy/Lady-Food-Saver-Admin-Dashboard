import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Search } from 'lucide-react';
export function UserManagement() {
  const [activeTab, setActiveTab] = useState<'restaurants' | 'customers'>('restaurants');
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const [restaurantData, setRestaurantData] = useState([
    {
      id: 1,
      name: "Joe's Pizza",
      owner: 'Joe Smith',
      state: 'NY',
      status: 'Approved',
      listings: 45,
      revenue: '$12,450'
    },
    {
      id: 2,
      name: 'Sunset Cafe',
      owner: 'Sarah Johnson',
      state: 'CA',
      status: 'Pending',
      listings: 12,
      revenue: '$3,200'
    },
    {
      id: 3,
      name: 'Burger King',
      owner: 'Mike Wilson',
      state: 'TX',
      status: 'Blocked',
      listings: 0,
      revenue: '$0'
    },
    {
      id: 4,
      name: 'Taco Bell',
      owner: 'Jane Doe',
      state: 'FL',
      status: 'Approved',
      listings: 156,
      revenue: '$45,100'
    },
    {
      id: 5,
      name: 'Sushi World',
      owner: 'Kenji Tanaka',
      state: 'WA',
      status: 'Approved',
      listings: 34,
      revenue: '$8,900'
    }
  ]);

  const [customerData, setCustomerData] = useState([
    {
      id: 1,
      name: 'Alice Brown',
      email: 'alice@example.com',
      orders: 12,
      reviews: 5,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Bob Wilson',
      email: 'bob@example.com',
      orders: 45,
      reviews: 12,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Charlie Davis',
      email: 'charlie@example.com',
      orders: 2,
      reviews: 0,
      status: 'Blocked'
    }
  ]);

  const toggleRestaurantStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Approved' ? 'Blocked' : 'Approved';
    setRestaurantData(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const toggleCustomerStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
    setCustomerData(prev =>
      prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const filteredRestaurants = restaurantData.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = stateFilter === 'all' || r.state.toLowerCase() === stateFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesState && matchesStatus;
  });

  const filteredCustomers = customerData.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'approved' && c.status === 'Active') ||
      (statusFilter === 'blocked' && c.status === 'Blocked');
    return matchesSearch && matchesStatus;
  });
  return <AdminLayout>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            User Management
          </h1>
          <p className="text-gray-500">Manage restaurants and customers</p>
        </div>
        <div className="flex gap-3">
          <Button variant={activeTab === 'restaurants' ? 'primary' : 'secondary'} onClick={() => setActiveTab('restaurants')}>
            Restaurants
          </Button>
          <Button variant={activeTab === 'customers' ? 'primary' : 'secondary'} onClick={() => setActiveTab('customers')}>
            Customers
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="w-64">
          <Input
            icon={<Search className="h-4 w-4" />}
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          className="w-40"
          options={[
            { label: 'All States', value: 'all' },
            { label: 'NY', value: 'ny' },
            { label: 'CA', value: 'ca' },
            { label: 'TX', value: 'tx' },
          ]}
          value={stateFilter}
          onChange={setStateFilter}
        />
        <Select
          className="w-40"
          options={[
            { label: 'All Status', value: 'all' },
            { label: 'Approved', value: 'approved' },
            { label: 'Pending', value: 'pending' },
            { label: 'Blocked', value: 'blocked' },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      {activeTab === 'restaurants' ? <Table data={filteredRestaurants} columns={[{
        header: 'Restaurant Name',
        accessorKey: 'name',
        className: 'font-medium text-gray-900'
      }, {
        header: 'Owner',
        accessorKey: 'owner'
      }, {
        header: 'State',
        accessorKey: 'state'
      }, {
        header: 'Status',
        cell: item => <Badge variant={item.status === 'Approved' ? 'success' : item.status === 'Pending' ? 'warning' : 'error'}>
          {item.status}
        </Badge>
      }, {
        header: 'Total Listings',
        accessorKey: 'listings'
      }, {
        header: 'Revenue',
        accessorKey: 'revenue'
      }, {
        header: 'Actions',
        cell: item => <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => navigate(`/users/restaurant/${item.id}`)}>
            View
          </Button>
          {item.status === 'Approved' ? (
            <Button size="sm" variant="danger" onClick={() => toggleRestaurantStatus(item.id, item.status)}>
              Block
            </Button>
          ) : (
            <Button size="sm" variant="primary" onClick={() => toggleRestaurantStatus(item.id, item.status)}>
              Approve
            </Button>
          )}
        </div>
      }]} /> : <Table data={filteredCustomers} columns={[{
        header: 'Customer Name',
        accessorKey: 'name',
        className: 'font-medium text-gray-900'
      }, {
        header: 'Email',
        accessorKey: 'email'
      }, {
        header: 'Total Orders',
        accessorKey: 'orders'
      }, {
        header: 'Reviews',
        accessorKey: 'reviews'
      }, {
        header: 'Status',
        cell: item => <Badge variant={item.status === 'Active' ? 'success' : 'error'}>
          {item.status}
        </Badge>
      }, {
        header: 'Actions',
        cell: item => <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => navigate(`/users/customer/${item.id}`)}>
            Profile
          </Button>
          <Button
            size="sm"
            variant={item.status === 'Active' ? 'danger' : 'primary'}
            onClick={() => toggleCustomerStatus(item.id, item.status)}
          >
            {item.status === 'Active' ? 'Block' : 'Unblock'}
          </Button>
        </div>
      }]} />}
    </div>
  </AdminLayout>;
}