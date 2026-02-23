import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { useGetTrendingMenusQuery } from '../../redux/features/dashboardApi';
import { useState } from 'react';
import { ShoppingBag, TrendingUp, DollarSign, Package } from 'lucide-react';

export function TrendingWidget() {
  const navigate = useNavigate();
  const [filter] = useState('year');
  const { data: trendingData } = useGetTrendingMenusQuery(filter);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const trendingItems = trendingData?.data?.trendingMenus || [];

  const handleCardClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Trending Menus</h3>

      <div className="space-y-6">
        {trendingItems.length > 0 ? (
          trendingItems.map((item: any) => (
            <Card
              key={item.menuId}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer border-gray-100/50"
              noPadding
              onClick={() => handleCardClick(item)}
            >
              <div className="h-32 w-full relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-5">
                <h4 className="font-bold text-[#E4983A] mb-1 group-hover:text-[#E4983A] transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 mb-4">{item.category || 'Standard Menu'}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center font-medium">{item.totalOrders} orders</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{item.totalQuantity} items sold</span>
                  </div>
                  <span className="font-bold text-lg text-[#E4983A]">
                    ${(item.totalRevenue / item.totalQuantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-sm text-gray-500">No trending menus found.</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Menu Details"
        size="md"
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full object-cover font-bold"
              />
            </div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h4>
                  <p className="text-sm text-gray-500">{selectedItem.category || 'Standard Menu'}</p>
                </div>
                <div className="bg-[#E4983A]/10 text-[#E4983A] px-3 py-1 rounded-full text-sm font-bold">
                  ${(selectedItem.totalRevenue / selectedItem.totalQuantity).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-hover hover:scale-[1.02] duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Total Orders</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{selectedItem.totalOrders}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-hover hover:scale-[1.02] duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Package className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Quantity Sold</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{selectedItem.totalQuantity}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-hover hover:scale-[1.02] duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Total Revenue</span>
                </div>
                <p className="text-xl font-bold text-gray-900">${selectedItem.totalRevenue.toLocaleString()}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-hover hover:scale-[1.02] duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Performance</span>
                </div>
                <p className="text-xl font-bold text-gray-900">High</p>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                className="flex-1 py-3 px-4 bg-[#E4983A] text-white rounded-xl font-bold hover:bg-[#d0892f] transition-colors shadow-lg shadow-orange-200"
                onClick={() => setIsModalOpen(false)}
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
