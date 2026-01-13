import React from 'react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Star } from 'lucide-react';
const reviews = [{
  id: 1,
  user: 'Sarah Jenkins',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  rating: 5,
  comment: 'Amazing service! The food was fresh and pickup was seamless.',
  date: '2 hours ago',
  restaurant: "Joe's Pizza"
}, {
  id: 2,
  user: 'Mike Ross',
  avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
  rating: 4,
  comment: 'Good value for money, but the location was a bit hard to find.',
  date: '5 hours ago',
  restaurant: 'Sushi World'
}, {
  id: 3,
  user: 'Emily Blunt',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  rating: 5,
  comment: 'Love the concept of saving food. Will definitely order again!',
  date: '1 day ago',
  restaurant: 'Taco Bell'
}];
export function CustomerReviews() {
  return <Card className="border-gray-100/50">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-gray-900">
        Recent Customer Reviews
      </h3>
      <button className="text-sm font-semibold text-[#FF6B35] hover:text-[#E85A2D] hover:underline decoration-2 underline-offset-4 transition-all">
        View All
      </button>
    </div>
    <div className="space-y-3">
      {reviews.map(review => <div key={review.id} className="border-b border-gray-50 last:border-0 pb-6 last:pb-0 hover:bg-gray-50/50 p-3 -mx-3 rounded-xl transition-colors">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <Avatar src={review.avatar} alt={review.user} fallback={review.user.substring(0, 2).toUpperCase()} size="sm" className="ring-2 ring-white shadow-sm" />
            <div>
              <p className="font-bold text-sm text-gray-900">
                {review.user}
              </p>
              <p className="text-xs text-gray-500 font-medium">
                Ordered from <span className="text-[#FF6B35]">{review.restaurant}</span>
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{review.date}</span>
        </div>
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} mr-0.5`} />)}
        </div>
        <p className="text-sm text-gray-600 italic leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100">"{review.comment}"</p>
      </div>)}
    </div>
  </Card>;
}