import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ==================== TYPES ====================
export interface CartItem {
  serviceId: number;
  serviceName: string;
  thumbnail: string;
  basePrice: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;

  addItem: (item: CartItem) => void;
  updateQuantity: (serviceId: number, quantity: number) => void;
  removeItem: (serviceId: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  getTotalItems: () => number;
  getTotalPrice: () => number;
  getCartItems: () => CartItem[];
}

// ==================== STORE ====================
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem: CartItem) => {
        const safeItem = {
          ...newItem,
          basePrice: newItem.basePrice ?? 0, // 🔥 chống undefined
        };

        set((state) => {
          const existing = state.items.find(
            (item) => item.serviceId === safeItem.serviceId,
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.serviceId === safeItem.serviceId
                  ? {
                      ...item,
                      quantity: item.quantity + safeItem.quantity,
                    }
                  : item,
              ),
            };
          }

          return {
            items: [...state.items, safeItem],
          };
        });
      },

      updateQuantity: (serviceId, quantity) => {
        if (quantity < 1) {
          get().removeItem(serviceId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.serviceId === serviceId ? { ...item, quantity } : item,
          ),
        }));
      },

      removeItem: (serviceId) => {
        set((state) => ({
          items: state.items.filter((item) => item.serviceId !== serviceId),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.quantity * (item.basePrice ?? 0),
          0,
        ),

      getCartItems: () => get().items,
    }),
    {
      name: "wisdom-cart-v2", // 🔥 đổi key để tránh data cũ
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
