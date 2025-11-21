import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { IVoucher } from '@/types';

// CartItem: mô tả dữ liệu cơ bản của một sản phẩm trong giỏ hàng
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  discountPrice: number;
  image: string;
  quantity: number;
  // isSelected: cho phép đánh dấu sản phẩm để thao tác tập thể (ví dụ apply voucher, checkout một phần)
  isSelected: boolean;
}

// CartState: định nghĩa state và action của store giỏ hàng
interface CartState {
  cartItems: CartItem[];
  addToCart: (laptop: Omit<CartItem, 'quantity' | 'isSelected'> & { quantity?: number }) => void;
  removeFromCart: (laptopId: string) => void;
  updateQuantity: (laptopId: string, quantity: number) => void;
  clearCart: () => void;
  toggleSelectItem: (laptopId: string) => void;
  toggleSelectAll: (isSelected: boolean) => void;
  selectedVoucher: IVoucher | null;
  setVoucher: (voucher: IVoucher | null) => void;
}

// Cookie constants: tên cookie và thời gian tồn tại (ngày)
const CART_COOKIE_NAME = 'cart';
const COOKIE_EXPIRES = 7;

/**
 * useCartStore (Zustand)
 * - Persist state vào localStorage (qua middleware) để giữ giỏ khi reload
 * - Đồng thời cập nhật cookie để backend / các tab khác có thể đọc (nếu cần)
 * - Tất cả hàm thao tác đều cập nhật cookie nhằm đồng bộ hoá
 */
const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      // Khởi tạo cartItems từ cookie (nếu có) — an toàn khi SSR (kiểm tra typeof window)
      cartItems: (() => {
        if (typeof window === 'undefined') return [];
        try {
          const cookieData = Cookies.get(CART_COOKIE_NAME);
          return cookieData ? JSON.parse(cookieData) : [];
        } catch {
          return [];
        }
      })(),

      // addToCart: thêm sản phẩm vào giỏ
      // - Nếu đã có item, cộng số lượng
      // - Nếu chưa có, thêm mới với `isSelected: true`
      addToCart: (laptop) =>
        set((state) => {
          const existing = state.cartItems.find((item) => item._id === laptop._id);
          let newCart: CartItem[];
          if (existing) {
            newCart = state.cartItems.map((item) =>
              item._id === laptop._id
                ? { ...item, quantity: item.quantity + (laptop.quantity || 1) }
                : item
            );
          } else {
            newCart = [
              ...state.cartItems,
              {
                ...laptop,
                quantity: laptop.quantity || 1,
                isSelected: true,
              },
            ];
          }
          // Cập nhật cookie để các phần khác (server hoặc các tab khác) có thể đọc
          Cookies.set(CART_COOKIE_NAME, JSON.stringify(newCart), { expires: COOKIE_EXPIRES, path: '/' });
          return { cartItems: newCart };
        }),

      // removeFromCart: loại bỏ sản phẩm khỏi giỏ
      removeFromCart: (laptopId) =>
        set((state) => {
          const newCart = state.cartItems.filter((item) => item._id !== laptopId);
          Cookies.set(CART_COOKIE_NAME, JSON.stringify(newCart), { expires: COOKIE_EXPIRES, path: '/' });
          return { cartItems: newCart };
        }),

      // updateQuantity: cập nhật số lượng của một item
      updateQuantity: (laptopId, quantity) =>
        set((state) => {
          const newCart = state.cartItems.map((item) =>
            item._id === laptopId ? { ...item, quantity } : item
          );
          Cookies.set(CART_COOKIE_NAME, JSON.stringify(newCart), { expires: COOKIE_EXPIRES, path: '/' });
          return { cartItems: newCart };
        }),

      // clearCart: xóa toàn bộ giỏ hàng và cookie liên quan
      clearCart: () => {
        Cookies.remove(CART_COOKIE_NAME);
        return { cartItems: [] };
      },

      // toggleSelectItem: đổi trạng thái isSelected của một item
      toggleSelectItem: (laptopId) =>
        set((state) => {
          const newCart = state.cartItems.map((item) =>
            item._id === laptopId ? { ...item, isSelected: !item.isSelected } : item
          );
          Cookies.set(CART_COOKIE_NAME, JSON.stringify(newCart), { expires: COOKIE_EXPIRES, path: '/' });
          return { cartItems: newCart };
        }),

      // toggleSelectAll: chọn hoặc bỏ chọn tất cả item
      toggleSelectAll: (isSelected) =>
        set((state) => {
          const newCart = state.cartItems.map((item) => ({ ...item, isSelected }));
          Cookies.set(CART_COOKIE_NAME, JSON.stringify(newCart), { expires: COOKIE_EXPIRES, path: '/' });
          return { cartItems: newCart };
        }),

      selectedVoucher: null,
      setVoucher: (voucher) => set({ selectedVoucher: voucher }),
    }),
    {
      name: 'cart-storage',
      // Không cần getStorage, để mặc định là localStorage
      partialize: (state) => ({
        selectedVoucher: state.selectedVoucher,
        cartItems: state.cartItems,
      }),
    }
  )
);

export default useCartStore;