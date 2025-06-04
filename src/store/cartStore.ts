import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { IVoucher } from '@/types';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  discountPrice: number;
  image: string;
  quantity: number;
  isSelected: boolean;
}

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

const CART_COOKIE_NAME = 'cart';
const COOKIE_EXPIRES = 7;

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: (() => {
        if (typeof window === 'undefined') return [];
        try {
          const cookieData = Cookies.get(CART_COOKIE_NAME);
          return cookieData ? JSON.parse(cookieData) : [];
        } catch {
          return [];
        }
      })(),

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
          Cookies.set(CART_COOKIE_NAME, JSON.stringify(newCart), { expires: COOKIE_EXPIRES, path: '/' });
          return { cartItems: newCart };
        }),

      removeFromCart: (laptopId) =>
        set((state) => {
          const newCart = state.cartItems.filter((item) => item._id !== laptopId);
          Cookies.set(CART_COOKIE_NAME, JSON.stringify(newCart), { expires: COOKIE_EXPIRES, path: '/' });
          return { cartItems: newCart };
        }),

      updateQuantity: (laptopId, quantity) =>
        set((state) => {
          const newCart = state.cartItems.map((item) =>
            item._id === laptopId ? { ...item, quantity } : item
          );
          Cookies.set(CART_COOKIE_NAME, JSON.stringify(newCart), { expires: COOKIE_EXPIRES, path: '/' });
          return { cartItems: newCart };
        }),

      clearCart: () => {
        Cookies.remove(CART_COOKIE_NAME);
        return { cartItems: [] };
      },

      toggleSelectItem: (laptopId) =>
        set((state) => {
          const newCart = state.cartItems.map((item) =>
            item._id === laptopId ? { ...item, isSelected: !item.isSelected } : item
          );
          Cookies.set(CART_COOKIE_NAME, JSON.stringify(newCart), { expires: COOKIE_EXPIRES, path: '/' });
          return { cartItems: newCart };
        }),

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