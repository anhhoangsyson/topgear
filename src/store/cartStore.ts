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

// Dữ liệu lưu trong cookie (chỉ chứa các trường cần thiết)
interface CartCookieItem {
  _id: string;
  variantName: string;
  variantPrice: number;
  variantPriceSale: number;
  isSelected: boolean;
  quantity: number;
  image: string;
}

export interface CartItem extends Omit<ProductVariantDetail, 'status' | 'images' | 'variantAttributes' | 'variantStock'> {
  quantity: number;
  image: string;
  isSelected: boolean;
}

export interface CartState {
  cartItems: CartItem[];
  addToCart: (
    product: Omit<ProductVariantDetail, 'status' | 'images'> & { image: string; quantity: number }
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleSelectItem: (productId: string) => void;
  toggleSelectAll: (isSelected: boolean) => void;
}

const CART_COOKIE_NAME = 'cart';
const COOKIE_EXPIRES = 7;

const useCartStore = create<CartState>((set) => ({
  cartItems: (() => {
    if (typeof window === 'undefined') return [];
    try {
      const cookieData = Cookies.get(CART_COOKIE_NAME);
      const cookieItems: CartCookieItem[] = cookieData ? JSON.parse(cookieData) : [];
      return cookieItems.map((item) => ({
        _id: item._id,
        variantName: item.variantName,
        variantPrice: item.variantPrice,
        variantPriceSale: item.variantPriceSale,
        quantity: item.quantity,
        image: item.image,
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
        newCart = [
          ...state.cartItems,
          {
            _id: product._id,
            variantName: product.variantName,
            variantPrice: product.variantPrice,
            variantPriceSale: product.variantPriceSale,
            quantity: product.quantity || 1,
            image: product.image, // Lấy URL ảnh đầu tiên từ product.images[0].imageUrl nếu không có product.image
            isSelected: true,
          },
        ];
      }

      // Chỉ lưu các trường cần thiết vào cookie
      const cookieCart: CartCookieItem[] = newCart.map((item) => ({
        _id: item._id,
        variantName: item.variantName,
        variantPrice: item.variantPrice,
        variantPriceSale: item.variantPriceSale,
        isSelected: item.isSelected,
        quantity: item.quantity,
        image: item.image,
      }));
      const jsonCart = JSON.stringify(cookieCart);
      Cookies.set(CART_COOKIE_NAME, jsonCart, { expires: COOKIE_EXPIRES, path: '/' });
      return { cartItems: newCart };
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const newCart = state.cartItems.filter((item) => item._id !== productId);
      const cookieCart: CartCookieItem[] = newCart.map((item) => ({
        _id: item._id,
        variantName: item.variantName,
        variantPrice: item.variantPrice,
        variantPriceSale: item.variantPriceSale,
        isSelected: item.isSelected,
        quantity: item.quantity,
        image: item.image,
      }));
      Cookies.set(CART_COOKIE_NAME, JSON.stringify(cookieCart), { expires: COOKIE_EXPIRES, path: '/' });
      return { cartItems: newCart };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const newCart = state.cartItems.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      );
      const cookieCart: CartCookieItem[] = newCart.map((item) => ({
        _id: item._id,
        variantName: item.variantName,
        variantPrice: item.variantPrice,
        variantPriceSale: item.variantPriceSale,
        isSelected: item.isSelected,
        quantity: item.quantity,
        image: item.image,
      }));
      Cookies.set(CART_COOKIE_NAME, JSON.stringify(cookieCart), { expires: COOKIE_EXPIRES, path: '/' });
      return { cartItems: newCart };
    }),

  clearCart: () => {
    Cookies.remove(CART_COOKIE_NAME);
    return { cartItems: [] };
  },

  toggleSelectItem: (productId) =>
    set((state) => {
      const newCart = state.cartItems.map((item) =>
        item._id === productId ? { ...item, isSelected: !item.isSelected } : item
      );
      const cookieCart: CartCookieItem[] = newCart.map((item) => ({
        _id: item._id,
        variantName: item.variantName,
        variantPrice: item.variantPrice,
        variantPriceSale: item.variantPriceSale,
        isSelected: item.isSelected,
        quantity: item.quantity,
        image: item.image,
      }));
      Cookies.set(CART_COOKIE_NAME, JSON.stringify(cookieCart), { expires: COOKIE_EXPIRES, path: '/' });
      return { cartItems: newCart };
    }),

  toggleSelectAll: (isSelected) =>
    set((state) => {
      const newCart = state.cartItems.map((item) => ({ ...item, isSelected }));
      const cookieCart: CartCookieItem[] = newCart.map((item) => ({
        _id: item._id,
        variantName: item.variantName,
        variantPrice: item.variantPrice,
        variantPriceSale: item.variantPriceSale,
        isSelected: item.isSelected,
        quantity: item.quantity,
        image: item.image,
      }));
      Cookies.set(CART_COOKIE_NAME, JSON.stringify(cookieCart), { expires: COOKIE_EXPIRES, path: '/' });
      return { cartItems: newCart };
    }),
}));

export default useCartStore;