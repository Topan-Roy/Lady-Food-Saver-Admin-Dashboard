import { Card } from '../ui/Card';
import { Star, ChevronDown } from 'lucide-react';
const trendingItems = [{
  id: 1,
  name: 'Grilled Chicken Delight',
  category: 'Chicken',
  rating: 4.9,
  orders: 350,
  price: 5.99,
  image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
}, {
  id: 2,
  name: 'Sunny Citrus Cake',
  category: 'Dessert',
  rating: 4.8,
  orders: 400,
  price: 5.99,
  image: 'https://images.unsplash.com/photo-1563729768640-d36d4999a33e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
}, {
  id: 3,
  name: 'Fiery Shrimp Salad',
  category: 'Seafood',
  rating: 4.7,
  orders: 270,
  price: 5.99,
  image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
}];
export function TrendingWidget() {
  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold text-gray-900">Trending Menus</h3>
      <button className="flex items-center text-sm font-medium text-gray-500 hover:text-[#FF6B35] transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-[#FF6B35]/20">
        This Week <ChevronDown className="h-4 w-4 ml-1" />
      </button>
    </div>

    <div className="space-y-6">
      {trendingItems.map(item => <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer border-gray-100/50" noPadding>
        <div className="h-32 w-full relative overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-5">
          <h4 className="font-bold text-gray-900 mb-1 group-hover:text-[#FF6B35] transition-colors">{item.name}</h4>
          <p className="text-xs text-gray-500 mb-4">{item.category}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center font-medium">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                {item.rating}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{item.orders} orders</span>
            </div>
            <span className="font-bold text-lg text-[#FF6B35]">
              ${item.price.toFixed(2)}
            </span>
          </div>
        </div>
      </Card>)}
    </div>
  </div>;
}