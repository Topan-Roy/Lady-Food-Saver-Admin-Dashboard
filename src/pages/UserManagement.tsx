import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Star, MapPin, ShieldAlert } from 'lucide-react';
import { FilterSelect } from '../components/ui/FilterSelect';
export function UserManagement() {
  const [activeTab, setActiveTab] = useState<'restaurants' | 'customers'>('restaurants');
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const navigate = useNavigate();

  const [restaurantData, setRestaurantData] = useState([
    {
      id: 1,
      name: "Joe's Pizza",
      owner: 'Joe Smith',
      state: 'NY',
      status: 'Approved',
      listings: 45,
      revenue: '$12,450',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Sunset Cafe',
      owner: 'Sarah Johnson',
      state: 'CA',
      status: 'Pending',
      listings: 12,
      revenue: '$3,200',
      rating: 4.2
    },
    {
      id: 3,
      name: 'Burger King',
      owner: 'Mike Wilson',
      state: 'TX',
      status: 'Blocked',
      listings: 0,
      revenue: '$0',
      rating: 3.5
    },
    {
      id: 4,
      name: 'Taco Bell',
      owner: 'Jane Doe',
      state: 'FL',
      status: 'Approved',
      listings: 156,
      revenue: '$45,100',
      rating: 4.9
    },
    {
      id: 5,
      name: 'Sushi World',
      owner: 'Kenji Tanaka',
      state: 'WA',
      status: 'Approved',
      listings: 34,
      revenue: '$8,900',
      rating: 4.6
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
    const matchesRating = ratingFilter === 'all' ||
      (ratingFilter === '4+' && r.rating >= 4) ||
      (ratingFilter === '3+' && r.rating >= 3 && r.rating < 4) ||
      (ratingFilter === 'below3' && r.rating < 3);
    return matchesSearch && matchesState && matchesStatus && matchesRating;
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


      <div className="flex flex-col gap-6">
        {/* Search and Filters Container */}
        <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
          {/* Search - Expanded */}
          <div className="w-full xl:max-w-md relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 rounded-lg group-focus-within:bg-[#FF6B35] transition-colors">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-white transition-colors" />
            </div>
            <Input
              placeholder="Search restaurants, owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="!pl-16 bg-gray-50 border-transparent rounded-2xl px-4 py-3.5 font-medium focus:bg-white focus:ring-4 focus:ring-[#FF6B35]/10 focus:border-[#FF6B35] outline-none transition-all hover:bg-white hover:border-gray-200 shadow-none"
            />
          </div>

          {/* Filters - Left Aligned (now next to search essentially, but visually grouped) */}
          <div className="flex flex-wrap gap-3 w-full xl:w-auto">
            {activeTab === 'restaurants' && (
              <>
                <FilterSelect
                  label="State"
                  icon={MapPin}
                  value={stateFilter}
                  onChange={setStateFilter}
                  options={[
                    { label: 'All States', value: 'all' },
                    { label: 'New York (NY)', value: 'ny' },
                    { label: 'California (CA)', value: 'ca' },
                    { label: 'Texas (TX)', value: 'tx' },
                    { label: 'Florida (FL)', value: 'fl' },
                    { label: 'Washington (WA)', value: 'wa' },
                  ]}
                />

                <FilterSelect
                  label="Rating"
                  icon={Star}
                  value={ratingFilter}
                  onChange={setRatingFilter}
                  options={[
                    { label: 'All Ratings', value: 'all' },
                    { label: '4+ Stars', value: '4+' },
                    { label: '3-4 Stars', value: '3+' },
                    { label: 'Below 3 Stars', value: 'below3' },
                  ]}
                />
              </>
            )}

            <FilterSelect
              label="Status"
              icon={ShieldAlert}
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Approved', value: 'approved' },
                { label: 'Pending Approval', value: 'pending' },
                { label: 'Blocked / Suspended', value: 'blocked' },
              ]}
            />
          </div>
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
          header: 'Rating',
          cell: item => (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-gray-900">{item.rating}</span>
            </div>
          )
        }, {
          header: 'Actions',
          cell: item => <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => navigate(`/restaurant/${item.id}`)}>
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
    </div>
  </AdminLayout>;
}