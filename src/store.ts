import { create } from 'zustand';
import { Product } from '@prisma/client';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Store {
  order: OrderItem[];
  addToOrder: (product: Product) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeItem: (id: string) => void;
  clearOrder: () => void;
  total: () => number;
}

const LOCAL_STORAGE_KEY = 'cart';

export const useStore = create<Store>((set, get) => ({
  order: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]'),

  addToOrder: (product) => {
    const productIdStr = product.id.toString();
    const existing = get().order.find(item => item.id === productIdStr);

    const order = existing
      ? get().order.map(item =>
          item.id === productIdStr ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...get().order, { id: productIdStr, name: product.name, price: product.price, quantity: 1 }];

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(order));
    set({ order });
  },

  increaseQuantity: (id: string) => {
    const order = get().order.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(order));
    set({ order });
  },

  decreaseQuantity: (id: string) => {
    const order = get().order
      .map(item => (item.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item))
      .filter(item => item.quantity > 0);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(order));
    set({ order });
  },

  removeItem: (id: string) => {
    const order = get().order.filter(item => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(order));
    set({ order });
  },

  clearOrder: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    set({ order: [] });
  },

  total: () => get().order.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));
