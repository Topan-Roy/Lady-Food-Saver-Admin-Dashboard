import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Star, MapPin, ShieldAlert } from 'lucide-react';
import { FilterSelect } from '../components/ui/FilterSelect';
import { useGetAllRestaurantsQuery, useApproveRestaurantMutation, useRejectRestaurantMutation, useBlockRestaurantMutation, useUnblockRestaurantMutation, useGetCustomersQuery, useBlockCustomerMutation, useUnblockCustomerMutation } from '../redux/features/dashboardApi';

export function UserManagement() {
  const [activeTab, setActiveTab] = useState<'restaurants' | 'customers'>('restaurants');
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all_states');
  const [statusFilter, setStatusFilter] = useState('all_status');
  const [ratingFilter, setRatingFilter] = useState('all_ratings');
  const navigate = useNavigate();

  // Reset filters when changing tabs
  useEffect(() => {
    setStatusFilter('all_status');
    setStateFilter('all_states');
    setRatingFilter('all_ratings');
  }, [activeTab]);

  // API Hooks for Restaurants
  const { data: restaurantsData, isLoading: isRestaurantsLoading } = useGetAllRestaurantsQuery({
    state: stateFilter,
    status: statusFilter,
    rating: ratingFilter,
    page: 1,
    limit: 50
  }, { skip: activeTab !== 'restaurants' });

  // API Hooks for Customers
  const { data: customersDataAPI, isLoading: isCustomersLoading } = useGetCustomersQuery({
    page: 1,
    limit: 50
  }, { skip: activeTab !== 'customers' });

  const [approveRestaurant] = useApproveRestaurantMutation();
  const [rejectRestaurant] = useRejectRestaurantMutation();
  const [blockRestaurant] = useBlockRestaurantMutation();
  const [unblockRestaurant] = useUnblockRestaurantMutation();

  const [blockCustomer] = useBlockCustomerMutation();
  const [unblockCustomer] = useUnblockCustomerMutation();

  const handleApprove = async (id: string) => {
    try {
      await approveRestaurant(id).unwrap();
    } catch (err) {
      console.error('Failed to approve:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectRestaurant(id).unwrap();
    } catch (err) {
      console.error('Failed to reject:', err);
    }
  };

  const handleBlock = async (id: string) => {
    try {
      await blockRestaurant(id).unwrap();
    } catch (err) {
      console.error('Failed to block:', err);
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      await unblockRestaurant(id).unwrap();
    } catch (err) {
      console.error('Failed to unblock:', err);
    }
  };

  const handleCustomerBlockToggle = async (id: string, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await unblockCustomer(id).unwrap();
      } else {
        await blockCustomer(id).unwrap();
      }
    } catch (err) {
      console.error('Failed to toggle customer status:', err);
    }
  };

  const restaurantData = useMemo(() => {
    if (!restaurantsData?.restaurants) return [];
    return restaurantsData.restaurants.map((r: any) => ({
      id: r.restaurantId || r._id || r.id,
      _id: r._id,
      name: r.restaurantName || r.name,
      owner: r.owner,
      state: r.state || 'N/A',
      status: r.status, // approved, pending_approval, blocked
      listings: r.totalListings,
      revenue: `$${(r.revenue || 0).toLocaleString()}`,
      rating: (r.ratings || 0).toFixed(1)
    }));
  }, [restaurantsData]);

  const customerData = useMemo(() => {
    if (!customersDataAPI?.data) return [];
    return customersDataAPI.data.map((c: any) => ({
      id: c.restaurantId || c._id || c.id,
      _id: c._id,
      userId: c.userId,
      originalId: c.id,
      name: c.owner?.name || c.fullName || 'N/A',
      email: c.owner?.email || c.phoneNumber || 'N/A',
      orders: c.totalListings || c.totalUpload?.totalService || 0,
      reviews: c.ratings || c.reviews?.totalReviews || 0,
      status: c.status === 'approved' ? 'Active' : c.status === 'blocked' ? 'Blocked' : (c.status || 'Active'),
      isBlocked: c.status === 'blocked'
    }));
  }, [customersDataAPI]);

  const filteredRestaurants = useMemo(() => {
    return restaurantData.filter((r: any) => {
      const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.owner.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [restaurantData, searchTerm]);

  const filteredCustomers = useMemo(() => {
    return customerData.filter((c: any) => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all_status' ||
        (statusFilter === 'approved' && c.status === 'Active') ||
        (statusFilter === 'blocked' && c.status === 'Blocked') ||
        (statusFilter === 'pending_approval' && c.status === 'pending_approval');

      return matchesSearch && matchesStatus;
    });
  }, [customerData, searchTerm, statusFilter]);

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
        <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-full xl:max-w-md relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 rounded-lg group-focus-within:bg-[#E4983A] transition-colors">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-white transition-colors" />
            </div>
            <Input
              placeholder="Search restaurants, owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="!pl-16 bg-gray-50 border-transparent rounded-2xl px-4 py-3.5 font-medium focus:bg-white focus:ring-4 focus:ring-[#E4983A]/10 focus:border-[#E4983A] outline-none transition-all hover:bg-white hover:border-gray-200 shadow-none"
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full xl:w-auto">
            {activeTab === 'restaurants' && (
              <>
                <FilterSelect
                  label="State"
                  icon={MapPin}
                  value={stateFilter}
                  onChange={setStateFilter}
                  options={[
                    { label: 'All States', value: 'all_states' },
                    { label: 'Pending', value: 'Pending' },
                  ]}
                />

                <FilterSelect
                  label="Rating"
                  icon={Star}
                  value={ratingFilter}
                  onChange={setRatingFilter}
                  options={[
                    { label: 'All Ratings', value: 'all_ratings' },
                    { label: '5 Stars', value: '5' },
                    { label: '4 Stars', value: '4' },
                    { label: '3 Stars', value: '3' },
                    { label: '2 Stars', value: '2' },
                    { label: '1 Star', value: '1' },
                  ]}
                />
              </>
            )}

            <FilterSelect
              label="Status"
              icon={ShieldAlert}
              value={statusFilter}
              onChange={setStatusFilter}
              options={activeTab === 'restaurants' ? [
                { label: 'All Status', value: 'all_status' },
                { label: 'Approved', value: 'approved' },
                { label: 'Pending Approval', value: 'pending_approval' },
                { label: 'Blocked', value: 'blocked' },
              ] : [
                { label: 'All Status', value: 'all_status' },
                { label: 'Active', value: 'approved' },
                { label: 'Pending Approval', value: 'pending_approval' },
                { label: 'Blocked', value: 'blocked' },
              ]}
            />
          </div>
        </div>

        {activeTab === 'restaurants' ? (
          isRestaurantsLoading ? (
            <div className="flex items-center justify-center h-64 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse text-gray-400 font-medium">
              Loading restaurants...
            </div>
          ) : (
            <Table data={filteredRestaurants} columns={[
              { header: 'Restaurant Name', accessorKey: 'name', className: 'font-medium text-gray-900' },
              { header: 'Owner', accessorKey: 'owner' },
              { header: 'State', accessorKey: 'state' },
              {
                header: 'Status',
                cell: (item: any) => {
                  const status = item.status.toLowerCase();
                  return (
                    <Badge variant={status === 'approved' ? 'success' : status === 'pending_approval' ? 'warning' : 'error'}>
                      {status.replace('_', ' ')}
                    </Badge>
                  );
                }
              },
              { header: 'Total Listings', accessorKey: 'listings' },
              { header: 'Revenue', accessorKey: 'revenue' },
              {
                header: 'Rating',
                cell: (item: any) => (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-gray-900">{item.rating}</span>
                  </div>
                )
              },
              {
                header: 'Actions',
                cell: (item: any) => <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => navigate(`/restaurant/${item.id}`)}>
                    View
                  </Button>
                  {item.status.toLowerCase() === 'approved' ? (
                    <Button size="sm" variant="danger" onClick={() => handleBlock(item.id)}>
                      Block
                    </Button>
                  ) : item.status.toLowerCase() === 'blocked' ? (
                    <Button size="sm" variant="primary" onClick={() => handleUnblock(item.id)}>
                      Unblock
                    </Button>
                  ) : (
                    <>
                      <Button size="sm" variant="primary" onClick={() => handleApprove(item.id)}>
                        Approve
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleReject(item.id)}>
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              }
            ]} />
          )
        ) : isCustomersLoading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse text-gray-400 font-medium">
            Loading customers...
          </div>
        ) : (
          <Table data={filteredCustomers} columns={[
            { header: 'Customer Name', accessorKey: 'name', className: 'font-medium text-gray-900' },
            { header: 'Email/Phone', accessorKey: 'email' },
            { header: 'Total Orders', accessorKey: 'orders' },
            { header: 'Reviews', accessorKey: 'reviews' },
            {
              header: 'Status',
              cell: (item: any) => {
                const status = item.status.toLowerCase();
                const variant = status === 'active' ? 'success' : status === 'blocked' ? 'error' : 'warning';
                const label = status === 'pending_approval' ? 'Pending Approval' : item.status;
                return <Badge variant={variant as any}>
                  {label}
                </Badge>
              }
            },
            {
              header: 'Actions',
              cell: (item: any) => <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => navigate(`/users/customer/${item.id}`)}>
                  Profile
                </Button>
                <Button
                  size="sm"
                  variant={item.status === 'Active' ? 'danger' : 'primary'}
                  onClick={() => handleCustomerBlockToggle(item.id, item.isBlocked)}
                >
                  {item.status === 'Active' ? 'Block' : 'Unblock'}
                </Button>
              </div>
            }
          ]} />
        )}
      </div>
    </div>
  </AdminLayout>;
}
