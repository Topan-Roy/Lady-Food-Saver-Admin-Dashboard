import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Star, MessageCircle, Send, CornerDownRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useGetGlobalReviewsQuery, useGetRestaurantReviewsQuery } from '../../redux/features/dashboardApi';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string | number;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  restaurant?: string;
  restaurantId?: string | number;
  images: string[];
  reply?: {
    text: string;
    date: string;
  } | null;
}

interface CustomerReviewsProps {
  restaurantId?: string;
}

export function CustomerReviews({ restaurantId }: CustomerReviewsProps) {
  const navigate = useNavigate();
  const [replyingTo, setReplyingTo] = useState<string | number | null>(null);
  const [replyText, setReplyText] = useState('');

  // Fetch reviews based on whether restaurantId is provided
  const { data: globalReviewsData, isLoading: isGlobalLoading } = useGetGlobalReviewsQuery({}, { skip: !!restaurantId });
  const { data: restaurantReviewsData, isLoading: isRestaurantLoading } = useGetRestaurantReviewsQuery({ id: restaurantId, rating: 'all' }, { skip: !restaurantId });

  const rawReviews = restaurantId ? restaurantReviewsData?.data : globalReviewsData?.data;
  const isLoading = restaurantId ? isRestaurantLoading : isGlobalLoading;

  const reviews: Review[] = (rawReviews || []).map((review: any, index: number) => ({
    id: index,
    user: review.customerName || 'Anonymous',
    avatar: review.profilePic || '',
    rating: review.rating || 5,
    comment: review.reviewDetails || '',
    date: review.createdAt ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }) : 'Recent',
    restaurant: review.restaurantName || (restaurantId ? '' : 'Global'), // Fallback if missing
    restaurantId: review.restaurantId || '',
    images: [],
    reply: null
  }));

  const handleReviewClick = (id: string | number) => {
    if (id) navigate(`/users/restaurant/${id}?tab=reviews`);
  };

  const handleViewAll = () => {
    navigate('/users?tab=restaurants');
  };

  const handleSendReply = (reviewId: string | number) => {
    console.log("Replying to", reviewId, replyText);
    setReplyingTo(null);
    setReplyText('');
  };

  if (isLoading) {
    return <Card className="animate-pulse h-64 flex items-center justify-center text-gray-400">Loading reviews...</Card>;
  }

  return <Card className="border-gray-100/50">
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-lg font-bold text-gray-900">
        Recent Customer Reviews
      </h3>
      <button
        onClick={handleViewAll}
        className="text-sm font-semibold text-[#FF6B35] hover:text-[#E85A2D] hover:underline decoration-2 underline-offset-4 transition-all"
      >
        View All
      </button>
    </div>
    <div className="space-y-8">
      {reviews.map(review => <div key={review.id} className="group">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <Avatar src={review.avatar} alt={review.user} fallback={review.user.substring(0, 2).toUpperCase()} size="md" className="ring-4 ring-gray-50" />
            <div>
              <p className="font-bold text-gray-900 leading-snug">
                {review.user}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Ordered from <span
                  className="text-[#FF6B35] cursor-pointer hover:underline"
                  onClick={() => review.restaurantId && handleReviewClick(review.restaurantId)}
                >{review.restaurant}</span>
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-gray-400">{review.date}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4 pl-[52px]">
          {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} mr-0.5`} />)}
        </div>

        {/* Comment Bubble */}
        <div className="ml-[52px] mb-4">
          <div className="bg-gray-50 rounded-2xl rounded-tl-none p-5 text-gray-700 italic border border-gray-100/50 shadow-sm relative">
            "{review.comment}"
          </div>
        </div>

        {/* Images */}
        {review.images.length > 0 && (
          <div className="ml-[52px] mb-4 flex gap-3 overflow-x-auto pb-1">
            {review.images.map((img, idx) => (
              <div key={idx} className="relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-100 cursor-zoom-in hover:border-[#FF6B35]/30 transition-colors shadow-sm">
                <img src={img} alt={`Review ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Admin Reply Section */}
        <div className="ml-[52px]">
          {review.reply ? (
            <div className="flex gap-3 mt-4 bg-orange-50/50 p-4 rounded-xl border border-orange-100/50">
              <CornerDownRight className="h-5 w-5 text-[#FF6B35] flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs font-bold text-[#FF6B35] uppercase tracking-wide mb-1">Admin Response</p>
                <p className="text-sm text-gray-700">{review.reply.text}</p>
                <p className="text-xs text-gray-400 mt-2">{review.reply.date}</p>
              </div>
            </div>
          ) : (
            replyingTo === review.id ? (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                <textarea
                  className="w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35]/10 focus:border-[#FF6B35] outline-none transition-all placeholder:text-gray-400"
                  rows={3}
                  placeholder="Type your reply to the customer..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                  <Button size="sm" onClick={() => handleSendReply(review.id)} disabled={!replyText.trim()}>
                    <Send className="h-3 w-3 mr-1.5" />
                    Send Reply
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setReplyingTo(review.id)}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#FF6B35] transition-colors py-1 px-2 -ml-2 rounded-lg hover:bg-orange-50"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Reply
              </button>
            )
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 my-8 ml-[52px]" />
      </div>)}
    </div>
  </Card>;
}
