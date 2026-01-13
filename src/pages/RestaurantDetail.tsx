import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import {
  ArrowLeft, MapPin, Star, Check, X, BarChart3,
  LayoutGrid, List as ListIcon, Info, Package, History, ShoppingBag, Edit2, Flag, Trash2, MessageCircle,
  Clock, ShieldAlert, DollarSign, ExternalLink, AlertTriangle
} from 'lucide-react';

export function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'details' | 'items' | 'orders' | 'reviews'>('details');
  const [itemsViewMode, setItemsViewMode] = useState<'grid' | 'list'>('grid');

  const restaurant = {
    id,
    name: "Joe's Pizza",
    owner: 'Joe Smith',
    status: 'Approved',
    rating: 4.8,
    reviews: 124,
    address: '123 Main St, New York, NY 10001',
    phone: '+1 (212) 555-0199',
    website: 'www.joespizza.com',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400',
    cuisine: "Italian & American",
    joinedDate: "Mar 15, 2023",
    taxRule: "US-NY Standard (8.875%)",
    platformFee: "$0.50 per transaction",
    pickupWindows: [
      { day: "Mon - Thu", hours: "08:00 PM - 10:00 PM" },
      { day: "Fri - Sun", hours: "09:00 PM - 11:00 PM" }
    ],
    stats: {
      totalSales: '$45,200',
      totalOrders: 1250,
      platformRevenue: '$625.00', // 1250 * 0.50
      restaurantEarnings: '$44,575'
    }
  };

  const [listings, setListings] = useState([
    {
      id: 1,
      title: 'Pepperoni Slice Box',
      price: '$5.99',
      stock: 5,
      status: 'Approved',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
    },
    {
      id: 2,
      title: 'Cheese Pizza Whole',
      price: '$5.99',
      stock: 2,
      status: 'Pending',
      image: 'https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?w=400'
    },
    {
      id: 3,
      title: 'Garlic Knots',
      price: '$5.99',
      stock: 10,
      status: 'Rejected',
      image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400'
    }
  ]);

  const orders = [
    { id: 'ORD-001', customer: 'John Doe', time: 'Today, 2:30 PM', status: 'Completed', amount: 5.99 },
    { id: 'ORD-005', customer: 'Sarah Lane', time: 'Today, 11:45 AM', status: 'Pending', amount: 11.98 },
    { id: 'ORD-008', customer: 'Mike Ross', time: 'Yesterday, 6:20 PM', status: 'Completed', amount: 5.99 }
  ];

  const [reviews, setReviews] = useState([
    { id: 1, rating: 5, comment: 'Absolutely delicious! The food was fresh and the pickup was smooth. Will definitely order again.', customer: 'Sarah J.', date: '2 hours ago', flagged: false },
    { id: 2, rating: 1, comment: 'Terrible service. The food was cold and the staff was rude when I arrived for pickup.', customer: 'Mike T.', date: '5 hours ago', flagged: true },
    { id: 3, rating: 4, comment: 'Great value for money. Just wish the pickup window was a bit longer.', customer: 'Emily R.', date: '1 day ago', flagged: false }
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleEditClick = (item: any) => {
    setSelectedItem({ ...item });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    setListings(prev => prev.map(item => item.id === selectedItem.id ? selectedItem : item));
    setIsEditModalOpen(false);
  };

  const toggleItemStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Approved' ? 'Rejected' : 'Approved';
    setListings(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  const toggleFlagReview = (id: number) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, flagged: !r.flagged } : r));
  };

  const removeReview = (id: number) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return <AdminLayout>
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">{restaurant.name}</h2>
          <Badge variant="success" className="bg-green-500 text-white border-none py-0.5">
            {restaurant.status}
          </Badge>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative h-48 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
        <img src={restaurant.image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
          <div className="text-white">
            <h1 className="text-4xl font-black tracking-tight">{restaurant.name}</h1>
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full text-sm font-medium border border-white/10">
                <MapPin className="h-4 w-4 text-[#FF6B35]" /> {restaurant.address}
              </span>
              <div className="flex items-center gap-1.5 bg-yellow-400/20 backdrop-blur-xl px-4 py-1.5 rounded-full text-sm font-bold text-yellow-400 border border-yellow-400/20">
                <Star className="h-4 w-4 fill-yellow-400" /> {restaurant.rating}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white" size="sm">
              Message Restaurant
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit border border-gray-200 shadow-inner overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'details' ? 'bg-white text-[#FF6B35] shadow-lg shadow-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Info className="h-4 w-4" />
          General Info
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'items' ? 'bg-white text-[#FF6B35] shadow-lg shadow-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Package className="h-4 w-4" />
          Product Items
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'orders' ? 'bg-white text-[#FF6B35] shadow-lg shadow-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <History className="h-4 w-4" />
          Order History
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'reviews' ? 'bg-white text-[#FF6B35] shadow-lg shadow-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <MessageCircle className="h-4 w-4" />
          Reviews
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-8 transition-all duration-500">
        {activeTab === 'details' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Platform Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-[#FF6B35] border-none shadow-2xl shadow-orange-200 relative overflow-hidden group">
                <BarChart3 className="absolute -right-2 -bottom-2 h-24 w-24 text-white/10 transition-transform group-hover:scale-110" />
                <p className="text-white/70 text-xs font-black uppercase tracking-widest">Total Sales</p>
                <div className="flex items-baseline gap-2 mt-4">
                  <p className="text-4xl font-black text-white tracking-tighter">{restaurant.stats.totalSales}</p>
                </div>
              </Card>

              <Card className="border-none shadow-xl shadow-gray-100/50 flex flex-col justify-between relative overflow-hidden group">
                <ShoppingBag className="absolute -right-4 -bottom-4 h-20 w-20 text-gray-50 transition-transform group-hover:scale-110" />
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Orders</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{restaurant.stats.totalOrders}</p>
                </div>
                <p className="text-[10px] text-[#FF6B35] font-black mt-4 flex items-center gap-1 uppercase tracking-tighter">
                  Platform Fee: {restaurant.platformFee}
                </p>
              </Card>

              <Card className="border-none shadow-xl shadow-gray-100/50 flex flex-col justify-between relative overflow-hidden group">
                <DollarSign className="absolute -right-4 -bottom-4 h-20 w-20 text-gray-50 transition-transform group-hover:scale-110" />
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Platform Revenue</p>
                  <p className="text-3xl font-black text-emerald-600 mt-2">{restaurant.stats.platformRevenue}</p>
                </div>
                <p className="text-[10px] text-gray-500 font-bold mt-4">Based on $0.50/transaction</p>
              </Card>

              <Card className="border-none shadow-xl shadow-gray-100/50 flex flex-col justify-between relative overflow-hidden group">
                <Package className="absolute -right-4 -bottom-4 h-20 w-20 text-gray-50 transition-transform group-hover:scale-110" />
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Active Listings</p>
                  <p className="text-3xl font-black text-blue-600 mt-2">{listings.length}</p>
                </div>
                <p className="text-[10px] text-blue-400 font-bold mt-4">Surplus food management</p>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Column 1: Platform Compliance & Profile */}
              <div className="space-y-8">
                <Card noPadding className="border-none shadow-xl shadow-gray-100/50 overflow-hidden">
                  <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="font-black text-gray-900 flex items-center gap-2">
                      <Info className="h-4 w-4 text-[#FF6B35]" /> Platform Profile
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cuisine Specialty</p>
                      <p className="text-sm font-bold text-gray-800">{restaurant.cuisine}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Contact Details</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 font-medium">Primary Phone</span>
                          <span className="font-black text-gray-900">{restaurant.phone}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 font-medium">Official Website</span>
                          <a href="#" className="font-bold text-[#FF6B35] flex items-center gap-1 hover:underline">
                            Visit <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card noPadding className="border-none shadow-xl shadow-gray-100/50 overflow-hidden border-l-4 border-amber-400">
                  <div className="p-6 border-b border-gray-50 bg-amber-50/30">
                    <h3 className="font-black text-amber-900 flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-amber-600" /> Legal & Compliance
                    </h3>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Beer & Wine Notice
                      </p>
                      <p className="text-[11px] font-semibold text-amber-700 leading-relaxed">
                        Legal Notice: Ensure that a legal notice is displayed when alcoholic beverages are listed. Verification of age is required at pickup.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">State Tax Enforcement</p>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-xs font-bold text-gray-500">Tax Rule</span>
                        <code className="text-[11px] font-black text-gray-900">{restaurant.taxRule}</code>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Column 2: Pickup Timing */}
              <div className="space-y-8">
                <Card noPadding className="border-none shadow-xl shadow-gray-100/50 overflow-hidden h-full">
                  <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-black text-gray-900 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#FF6B35]" /> Pickup Windows
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-gray-500 font-bold mb-4 uppercase tracking-widest">Available Pickup Slots</p>
                    {restaurant.pickupWindows.map((slot, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                            <History className="h-4 w-4 text-[#FF6B35]" />
                          </div>
                          <span className="text-xs font-black text-gray-700 uppercase">{slot.day}</span>
                        </div>
                        <span className="text-xs font-bold text-gray-900 bg-white px-3 py-1 rounded-full border border-gray-100">{slot.hours}</span>
                      </div>
                    ))}
                    <p className="text-[10px] text-gray-400 font-bold mt-8 italic text-center px-4">
                      Restaurants must list surplus food at least 2 hours before the scheduled pickup window.
                    </p>
                  </div>
                </Card>
              </div>

              {/* Column 3: Platform Management */}
              <div className="space-y-8">
                <Card noPadding className="border-none shadow-xl shadow-gray-100/50 overflow-hidden">
                  <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="font-black text-gray-900 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-purple-500" /> Activity Summary
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-purple-50 rounded-2xl border border-purple-100 group hover:border-purple-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5 text-purple-600" />
                          <span className="text-xs font-black text-purple-900 uppercase tracking-widest">Listings</span>
                        </div>
                        <span className="text-xl font-black text-purple-900">{listings.length} Items</span>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 group hover:border-emerald-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <ShoppingBag className="h-5 w-5 text-emerald-600" />
                          <span className="text-xs font-black text-emerald-900 uppercase tracking-widest">Orders</span>
                        </div>
                        <span className="text-xl font-black text-emerald-900">{orders.length} Total</span>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-amber-50 rounded-2xl border border-amber-100 group hover:border-amber-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <Star className="h-5 w-5 text-amber-600" />
                          <span className="text-xs font-black text-amber-900 uppercase tracking-widest">Reviews</span>
                        </div>
                        <span className="text-xl font-black text-amber-900">{reviews.length} Feedbacks</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card noPadding className="border-none shadow-xl shadow-gray-100/50 overflow-hidden">
                  <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="font-black text-gray-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-500" /> Store Location
                    </h3>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-800 leading-snug">{restaurant.address}</p>
                        <button className="text-[10px] font-black text-blue-600 mt-1 uppercase tracking-widest hover:underline">View on Platform Map</button>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="pt-4 space-y-4">
                  <Button variant="danger" className="w-full shadow-2xl shadow-red-500/20 py-6 text-sm uppercase tracking-widest font-black rounded-3xl">
                    Block Restaurant Account
                  </Button>
                  <p className="text-center text-[10px] text-gray-400 font-bold px-4 uppercase leading-relaxed">
                    Admin Control: Blocking this account will suspend all active food listings and prevent further surplus food recovery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-gray-900">Manage Items</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">
                  {listings.length} Results
                </span>
              </div>
              <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
                <button
                  onClick={() => setItemsViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${itemsViewMode === 'grid' ? 'bg-white text-[#FF6B35] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setItemsViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${itemsViewMode === 'list' ? 'bg-white text-[#FF6B35] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <ListIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {itemsViewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(item => (
                  <Card key={item.id} noPadding className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                    <div className="relative h-56 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-4 right-4">
                        <Badge variant={item.status === 'Approved' ? 'success' : item.status === 'Pending' ? 'warning' : 'error'} className="shadow-lg backdrop-blur-md">
                          {item.status}
                        </Badge>
                      </div>
                      <button
                        onClick={() => handleEditClick(item)}
                        className="absolute bottom-4 right-4 p-3 bg-white text-[#FF6B35] rounded-2xl shadow-xl transform translate-y-12 group-hover:translate-y-0 transition-transform duration-500 hover:bg-[#FF6B35] hover:text-white"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-black text-gray-900 text-lg">{item.title}</h4>
                        <span className="font-black text-[#FF6B35] text-xl">{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inventory</span>
                          <span className="text-sm font-bold text-gray-700">{item.stock} in stock</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleItemStatus(item.id, item.status)}
                            className={`p-2 rounded-xl border transition-all ${item.status === 'Approved' ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white' : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}
                          >
                            {item.status === 'Approved' ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card noPadding className="overflow-hidden border-none shadow-xl shadow-gray-100/50">
                <Table data={listings} columns={[
                  {
                    header: 'Picture',
                    cell: (item) => (
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-50 shadow-sm">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transform transition-transform hover:scale-110" />
                      </div>
                    )
                  },
                  { header: 'Item Name', accessorKey: 'title', className: 'font-black text-gray-900 text-base' },
                  { header: 'Price', accessorKey: 'price', className: 'text-[#FF6B35] font-black text-lg' },
                  { header: 'Stock', accessorKey: 'stock', className: 'font-bold text-gray-700' },
                  {
                    header: 'Status',
                    cell: (item) => (
                      <div className="flex items-center gap-3">
                        <Badge variant={item.status === 'Approved' ? 'success' : item.status === 'Pending' ? 'warning' : 'error'}>
                          {item.status}
                        </Badge>
                        <button
                          onClick={() => toggleItemStatus(item.id, item.status)}
                          className={`p-2 rounded-xl transition-all ${item.status === 'Approved' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                        >
                          {item.status === 'Approved' ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </button>
                      </div>
                    )
                  },
                  {
                    header: 'Action',
                    cell: (item) => <Button size="sm" variant="secondary" onClick={() => handleEditClick(item)} className="px-6 rounded-xl font-bold">
                      Edit Item
                    </Button>
                  }
                ]} />
              </Card>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card noPadding className="overflow-hidden border-none shadow-xl shadow-gray-100/50">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-black text-gray-900">Recent Orders</h3>
                <Button variant="outline" size="sm" className="font-bold underline">Download Report</Button>
              </div>
              <Table data={orders} columns={[
                { header: 'Order ID', accessorKey: 'id', className: 'font-black text-blue-600' },
                { header: 'Customer', accessorKey: 'customer', className: 'font-bold' },
                { header: 'Time', accessorKey: 'time', className: 'text-gray-500' },
                {
                  header: 'Status',
                  cell: (item) => <Badge variant={item.status === 'Completed' ? 'success' : 'warning'}>{item.status}</Badge>
                },
                {
                  header: 'Amount',
                  cell: (item) => <span className="font-black text-gray-900">${item.amount.toFixed(2)}</span>
                },
                {
                  header: 'Action',
                  cell: (item) => <Button variant="ghost" size="sm" onClick={() => navigate(`/orders/${item.id}`)} className="font-bold text-[#FF6B35]">View Details</Button>
                }
              ]} />
            </Card>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-gray-900">Customer Feedback</h3>
              <Badge variant="default" className="bg-gray-100 text-gray-500 border-none font-bold">
                {reviews.length} Total Reviews
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {reviews.map(review => (
                <Card key={review.id} className={`transition-all duration-300 border-none shadow-lg hover:shadow-xl ${review.flagged ? 'ring-2 ring-red-500 bg-red-50/30' : 'bg-white'}`}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-xl font-black text-gray-400 border border-gray-100 shadow-sm">
                        {review.customer.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-black text-gray-900">{review.customer}</h4>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{review.date}</span>
                          {review.flagged && (
                            <Badge variant="error" className="bg-red-500 text-white border-none py-0.5 animate-pulse">
                              FLAGGED
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mb-4 bg-gray-50 w-fit px-3 py-1.5 rounded-full border border-gray-100">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                          ))}
                          <span className="text-xs font-black ml-2 text-gray-500">{review.rating}.0</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm font-medium italic">
                          "{review.comment}"
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => toggleFlagReview(review.id)}
                        className={`p-2.5 rounded-xl transition-all duration-200 ${review.flagged ? 'bg-red-500 text-white' : 'bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-[#FF6B35]'}`}
                        title={review.flagged ? 'Unflag Review' : 'Flag for Review'}
                      >
                        <Flag className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => removeReview(review.id)}
                        className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200"
                        title="Remove Review"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
              {reviews.length === 0 && (
                <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold">No reviews found for this restaurant.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Quick Item Edit"
      >
        <div className="space-y-6">
          <div className="flex justify-center -mt-2">
            <div className="relative w-40 h-40 rounded-[32px] overflow-hidden border-4 border-gray-50 shadow-2xl group">
              <img src={selectedItem?.image} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full border border-white/30">
                  Replace Hero Image
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Item Name"
              value={selectedItem?.title || ''}
              onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
              className="rounded-2xl border-gray-100 font-bold"
            />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Input
                  label="Price"
                  value={selectedItem?.price || '$5.99'}
                  disabled
                  className="bg-gray-50 text-gray-400 font-black rounded-2xl border-gray-100"
                />
                <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Platform Standard Price</p>
              </div>
              <Input
                label="Stock Level"
                type="number"
                value={selectedItem?.stock || 0}
                onChange={(e) => setSelectedItem({ ...selectedItem, stock: parseInt(e.target.value) || 0 })}
                className="rounded-2xl border-gray-100 font-bold"
              />
            </div>
          </div>

          <div className="pt-8 flex items-center justify-between gap-4">
            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 font-bold hover:text-gray-600 transition-colors">Discard Changes</button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="px-8 border-gray-200">Cancel</Button>
              <Button variant="primary" onClick={handleSaveEdit} className="px-8 shadow-2xl shadow-orange-500/30">Update Item</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  </AdminLayout>;
}