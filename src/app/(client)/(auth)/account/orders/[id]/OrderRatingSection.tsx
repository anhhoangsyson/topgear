'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/ui/dialog';
import RatingForm from '@/components/molecules/rating/RatingForm';
import RatingList from '@/components/molecules/rating/RatingList';
import { getRatingsByOrder } from '@/services/rating-api';
import { IRating } from '@/types/rating';
import { Star, MessageSquare } from 'lucide-react';

interface OrderRatingSectionProps {
  orderId: string;
  orderStatus: string;
  orderDetails: Array<{ 
    laptopId: string; 
    name?: string; 
    images?: Array<{ imageUrl: string }> 
  }>;
}

export default function OrderRatingSection({ orderId, orderStatus, orderDetails }: OrderRatingSectionProps) {
  const [ratings, setRatings] = useState<IRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [selectedLaptopId, setSelectedLaptopId] = useState<string | null>(null);

  const canRate = orderStatus === 'completed';

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await getRatingsByOrder(orderId);
        setRatings(data);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching ratings:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchRatings();
    }
  }, [orderId]);

  const handleRatingSuccess = () => {
    setShowRatingForm(false);
    setSelectedLaptopId(null);
    // Refresh ratings
    const fetchRatings = async () => {
      try {
        const data = await getRatingsByOrder(orderId);
        setRatings(data);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching ratings:', error);
        }
      }
    };
    fetchRatings();
  };

  const hasRatedForLaptop = (laptopId: string | null) => {
    if (!laptopId) {
      // Check if user has rated the entire order
      return ratings.some(r => !r.laptopId || (typeof r.laptopId === 'string' && !r.laptopId));
    }
    return ratings.some(r => {
      const ratingLaptopId = typeof r.laptopId === 'string' ? r.laptopId : r.laptopId?._id;
      return ratingLaptopId === laptopId;
    });
  };

  if (!canRate) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <h2 className="text-xl font-semibold text-gray-900">Đánh giá đơn hàng</h2>
        </div>
        <Dialog open={showRatingForm} onOpenChange={setShowRatingForm}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="sm"
              onClick={() => setSelectedLaptopId(null)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Đánh giá đơn hàng
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Đánh giá đơn hàng</DialogTitle>
            </DialogHeader>
            <RatingForm
              orderId={orderId}
              laptopId={null}
              onSuccess={handleRatingSuccess}
              onCancel={() => setShowRatingForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Rating for each product */}
      {orderDetails.length > 0 && (
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Đánh giá từng sản phẩm:</h3>
          {orderDetails.map((item) => {
            const hasRated = hasRatedForLaptop(item.laptopId);
            
            return (
              <div
                key={item.laptopId}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                  <div className="flex items-center gap-3 flex-1">
                  {item.images?.[0] && (
                    <img
                      src={item.images[0].imageUrl}
                      alt={item.name || 'Sản phẩm'}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.name || 'Sản phẩm'}</p>
                    {hasRated && (
                      <p className="text-sm text-green-600 mt-1">✓ Đã đánh giá</p>
                    )}
                  </div>
                </div>
                {!hasRated && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedLaptopId(item.laptopId)}
                      >
                        Đánh giá
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Đánh giá sản phẩm</DialogTitle>
                      </DialogHeader>
                      <RatingForm
                        orderId={orderId}
                        laptopId={item.laptopId}
                        onSuccess={handleRatingSuccess}
                        onCancel={() => setSelectedLaptopId(null)}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Ratings List */}
      {!loading && ratings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Đánh giá ({ratings.length})
          </h3>
          <RatingList ratings={ratings} showLaptopInfo={true} />
        </div>
      )}

      {!loading && ratings.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p>Chưa có đánh giá nào</p>
        </div>
      )}
    </div>
  );
}

