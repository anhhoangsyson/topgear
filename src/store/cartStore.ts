import { create } from 'zustand';
import Cookies from 'js-cookie';

interface IProductImage {
  _id: string;
  productVariantId: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type StatusProductVariant = 'active' | 'inactive';

interface IProductAttribute {
  name: string;
  value: string;
}

export interface ProductVariantDetail {
  images: IProductImage[];
  status?: StatusProductVariant;
  variantAttributes?: IProductAttribute[];
  variantName: string;
  variantPrice: number;
  variantPriceSale: number;
  variantStock: number;
  _id: string;
}

export interface CartItem extends Omit<ProductVariantDetail, 'status' | 'images'| 'variantAttributes'|'variantStock'> {
  quantity: number;
  image: string;
  isSelected: boolean; // chosse product to check out
}

export interface CartState {
  cartItems: CartItem[];
  addToCart: (
    product: Omit<ProductVariantDetail, 'status' | 'images'> & { image: string; quantity: number }
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleSelectItem: (productId: string) => void; // Hàm mới để chọn/bỏ chọn
  toggleSelectAll: (isSelected: boolean) => void; // Hàm mới để chọn/bỏ chọn tất cả
}

const CART_COOKIE_NAME = 'cart';
const COOKIE_EXPIRES = 7;

const useCartStore = create<CartState>((set) => ({
  cartItems: (() => {
    if (typeof window === 'undefined') return [];
    try {
      const cookieData = Cookies.get(CART_COOKIE_NAME);
      const items = cookieData ? JSON.parse(cookieData) : [];
      // Đảm bảo tất cả sản phẩm có isSelected, mặc định là true
      return items.map((item: CartItem) => ({
        ...item,
        isSelected: item.isSelected !== undefined ? item.isSelected : true,
      }));
    } catch (error) {
      console.error('Error parsing cart cookie:', error);
      return [];
    }
  })(),

  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cartItems.find((item) => item._id === product._id);
      let newCart: CartItem[];

      if (existingItem) {
        newCart = state.cartItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...state.cartItems, { ...product, quantity: product.quantity || 1, isSelected: true }];
      }

      Cookies.set(CART_COOKIE_NAME, JSON.stringify(newCart), { expires: COOKIE_EXPIRES });
      return { cartItems: newCart };
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const newCart = state.cartItems.filter((item) => item._id !== productId);
      Cookies.set(CART_COOKIE_NAME, JSON.stringify(newCart), { expires: COOKIE_EXPIRES });
      return { cartItems: newCart };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const newCart = state.cartItems.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      );
      Cookies.set(CART_COOKIE_NAME, JSON.stringify(newCart), { expires: COOKIE_EXPIRES });
      return { cartItems: newCart };
    }),

  clearCart: () => {
    Cookies.remove(CART_COOKIE_NAME);
    return { cartItems: [] };
  },

  toggleSelectItem: (productId: string) =>
    set((state) => {
      const newCart = state.cartItems.map((item) =>
        item._id === productId ? { ...item, isSelected: !item.isSelected } : item
      );
      Cookies.set(CART_COOKIE_NAME, JSON.stringify(newCart), { expires: COOKIE_EXPIRES });
      return { cartItems: newCart };
    }),

  toggleSelectAll: (isSelected: boolean) =>
    set((state) => {
      const newCart = state.cartItems.map((item) => ({ ...item, isSelected }));
      Cookies.set(CART_COOKIE_NAME, JSON.stringify(newCart), { expires: COOKIE_EXPIRES });
      return { cartItems: newCart };
    }),
}));

export default useCartStore;