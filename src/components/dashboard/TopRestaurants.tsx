
import { useNavigate } from 'react-router-dom';

interface Restaurant {
    id: string;
    name: string;
    orders: number;
    revenue: number;
}

interface TopRestaurantsProps {
    data: Restaurant[];
}

export function TopRestaurants({ data }: TopRestaurantsProps) {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top Three Restaurants</h3>
            <div className="flex-1 space-y-4">
                {data.slice(0, 3).map((restaurant, idx) => (
                    <div
                        key={idx}
                        onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#FF6B35] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
                                {idx + 1}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 group-hover:text-[#FF6B35] transition-colors">{restaurant.name}</p>
                                <p className="text-xs text-gray-500">{restaurant.orders} orders</p>
                            </div>
                        </div>
                        <span className="font-bold text-[#FF6B35]">${(restaurant.revenue / 1000).toFixed(1)}k</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
