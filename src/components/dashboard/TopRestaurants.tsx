import { useNavigate } from 'react-router-dom';
import { useGetTopRestaurantsQuery } from '../../redux/features/dashboardApi';
import { useState } from 'react';

export function TopRestaurants() {
    const navigate = useNavigate();
    const [filter] = useState('month'); // Default to month as per user request
    const { data: topRestaurantData } = useGetTopRestaurantsQuery(filter);

    const restaurants = topRestaurantData?.data?.topRestaurants || [];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top Three Restaurants</h3>
            <div className="flex-1 space-y-4">
                {restaurants.length > 0 ? (
                    restaurants.slice(0, 3).map((restaurant: any, idx: number) => (
                        <div
                            key={idx}
                            onClick={() => navigate(`/restaurant/${restaurant.restaurantId}`)}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#E4983A] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
                                    {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 group-hover:text-[#E4983A] ">
                                        {restaurant.restaurantName}
                                    </p>
                                    <p className="text-xs text-gray-500">{restaurant.totalOrders} orders</p>
                                </div>
                            </div>

                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No top restaurants found.</p>
                )}
            </div>
        </div>
    );
}
