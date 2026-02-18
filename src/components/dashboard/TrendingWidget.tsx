import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { useGetTrendingMenusQuery } from '../../redux/features/dashboardApi';
import { useState } from 'react';

export function TrendingWidget() {
  const navigate = useNavigate();
  const [filter] = useState('year');
  const { data: trendingData } = useGetTrendingMenusQuery(filter);

  const trendingItems = trendingData?.data?.trendingMenus || [];

  return <div className="space-y-6">
    <h3 className="text-lg font-bold text-gray-900">Trending Menus</h3>

    <div className="space-y-6">
      {trendingItems.length > 0 ? (
        trendingItems.map((item: any) => <Card key={item.menuId} className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer border-gray-100/50" noPadding onClick={() => navigate(`/users/restaurant/1?tab=items`)}>
          <div className="h-32 w-full relative overflow-hidden">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-5">
            <h4 className="font-bold text-[#E4983A] mb-1 group-hover:text-[#E4983A] transition-colors line-clamp-2">{item.title}</h4>
            <p className="text-xs text-gray-500 mb-4">{item.category || 'Standard Menu'}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center font-medium">
                  {item.totalOrders} orders
                </span>
                <span className="text-gray-400">â€¢</span>
                <span className="text-gray-500">{item.totalQuantity} items sold</span>
              </div>
              <span className="font-bold text-lg text-[#E4983A]">
                ${(item.totalRevenue / item.totalQuantity).toFixed(2)}
              </span>
            </div>
          </div>
        </Card>)
      ) : (
        <p className="text-sm text-gray-500">No trending menus found.</p>
      )}
    </div>
  </div>;
}
