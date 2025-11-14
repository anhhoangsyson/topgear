import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  addToWishlist as addToWishlistApi,
  removeFromWishlist as removeFromWishlistApi,
  getWishlist as getWishlistApi,
  checkInWishlist as checkInWishlistApi,
  getWishlistCount as getWishlistCountApi,
} from '@/services/wishlist-api';
import { IWishlist } from '@/types/wishlist';
import { toast } from '@/hooks/use-toast';

export function useWishlist() {
  const { data: session, status } = useSession();
  const [wishlist, setWishlist] = useState<IWishlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [isChecking, setIsChecking] = useState<Record<string, boolean>>({});

  // Fetch wishlist
  const fetchWishlist = useCallback(async (page: number = 1, limit: number = 20) => {
    if (status !== 'authenticated') {
      return;
    }

    try {
      setLoading(true);
      const data = await getWishlistApi(page, limit);
      setWishlist(data.wishlists);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải wishlist';
      toast({
        title: 'Lỗi',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [status]);

  // Fetch wishlist count
  const fetchCount = useCallback(async () => {
    if (status !== 'authenticated') {
      setCount(0);
      return;
    }

    try {
      const count = await getWishlistCountApi();
      setCount(count);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useWishlist] Error fetching count:', error);
      }
      setCount(0);
    }
  }, [status]);

  // Add to wishlist
  const addToWishlist = useCallback(async (laptopId: string) => {
    if (status !== 'authenticated') {
      toast({
        title: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để thêm vào wishlist',
        variant: 'destructive',
      });
      return { success: false, message: 'Chưa đăng nhập' };
    }

    try {
      setIsChecking(prev => ({ ...prev, [laptopId]: true }));
      const newItem = await addToWishlistApi(laptopId);
      setWishlist(prev => [...prev, newItem]);
      setCount(prev => prev + 1);
      toast({
        title: 'Thành công',
        description: 'Đã thêm vào wishlist',
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      toast({
        title: 'Lỗi',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, message: errorMessage };
    } finally {
      setIsChecking(prev => ({ ...prev, [laptopId]: false }));
    }
  }, [status]);

  // Remove from wishlist
  const removeFromWishlist = useCallback(async (laptopId: string) => {
    if (status !== 'authenticated') {
      return { success: false, message: 'Chưa đăng nhập' };
    }

    try {
      setIsChecking(prev => ({ ...prev, [laptopId]: true }));
      await removeFromWishlistApi(laptopId);
      setWishlist(prev => prev.filter(item => {
        const itemLaptopId = typeof item.laptopId === 'string' ? item.laptopId : item.laptopId._id;
        return itemLaptopId !== laptopId;
      }));
      setCount(prev => Math.max(0, prev - 1));
      toast({
        title: 'Thành công',
        description: 'Đã xóa khỏi wishlist',
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      toast({
        title: 'Lỗi',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, message: errorMessage };
    } finally {
      setIsChecking(prev => ({ ...prev, [laptopId]: false }));
    }
  }, [status]);

  // Check if in wishlist
  const checkInWishlist = useCallback(async (laptopId: string): Promise<boolean> => {
    if (status !== 'authenticated') {
      return false;
    }

    try {
      return await checkInWishlistApi(laptopId);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useWishlist] Error checking wishlist:', error);
      }
      return false;
    }
  }, [status]);

  // Toggle wishlist (add if not in, remove if in)
  const toggleWishlist = useCallback(async (laptopId: string) => {
    if (status !== 'authenticated') {
      toast({
        title: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để thêm vào wishlist',
        variant: 'destructive',
      });
      return;
    }

    const isInWishlist = wishlist.some(item => {
      const itemLaptopId = typeof item.laptopId === 'string' ? item.laptopId : item.laptopId._id;
      return itemLaptopId === laptopId;
    });

    if (isInWishlist) {
      await removeFromWishlist(laptopId);
    } else {
      await addToWishlist(laptopId);
    }
  }, [status, wishlist, addToWishlist, removeFromWishlist]);

  // Initial fetch
  useEffect(() => {
    if (status === 'authenticated') {
      fetchWishlist();
      fetchCount();
    } else {
      setWishlist([]);
      setCount(0);
    }
  }, [status, fetchWishlist, fetchCount]);

  return {
    wishlist,
    loading,
    count,
    isChecking,
    addToWishlist,
    removeFromWishlist,
    checkInWishlist,
    toggleWishlist,
    fetchWishlist,
    fetchCount,
  };
}

