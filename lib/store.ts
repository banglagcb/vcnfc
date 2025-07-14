import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  description: string;
  features: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;

  // Products
  products: Product[];
  setProducts: (products: Product[]) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];

  // Wishlist
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Product[];
  setSearchResults: (results: Product[]) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (product) => {
        const cart = get().cart;
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item,
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
      getCartItemsCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      // Products
      products: [
        {
          id: "1",
          name: "SHAREINFO Premium - Full Customized Card",
          price: 1699.15,
          originalPrice: 1999.0,
          discount: 15,
          image: "/placeholder.svg?height=300&width=300",
          category: "premium",
          description:
            "Premium NFC business card with full customization options, premium materials, and advanced features.",
          features: [
            "Full Custom Design",
            "Premium Materials",
            "Advanced NFC Technology",
            "Unlimited Contact Fields",
            "Analytics Dashboard",
            "Priority Support",
          ],
          inStock: true,
          rating: 4.8,
          reviews: 124,
        },
        {
          id: "2",
          name: "SHAREINFO Standard - Semi Customized Card",
          price: 1274.15,
          originalPrice: 1499.0,
          discount: 15,
          image: "/placeholder.svg?height=300&width=300",
          category: "standard",
          description:
            "Standard NFC business card with semi-customization options and essential features.",
          features: [
            "Semi-Custom Design",
            "Standard Materials",
            "NFC Technology",
            "Contact Fields",
            "Basic Analytics",
            "Email Support",
          ],
          inStock: true,
          rating: 4.5,
          reviews: 89,
        },
        {
          id: "3",
          name: "SHAREINFO Classic Card",
          price: 849.15,
          originalPrice: 999.0,
          discount: 15,
          image: "/placeholder.svg?height=300&width=300",
          category: "classic",
          description:
            "Classic NFC business card with basic features and affordable pricing.",
          features: [
            "Basic Design Templates",
            "Standard Materials",
            "Basic NFC Technology",
            "Essential Contact Fields",
            "Basic Profile",
            "Community Support",
          ],
          inStock: true,
          rating: 4.2,
          reviews: 156,
        },
        {
          id: "4",
          name: "SHAREINFO Women Professional Card",
          price: 1399.15,
          originalPrice: 1649.0,
          discount: 15,
          image: "/placeholder.svg?height=300&width=300",
          category: "women",
          description:
            "Specially designed NFC business card for professional women with elegant designs.",
          features: [
            "Elegant Women-Focused Designs",
            "Premium Materials",
            "Advanced NFC Technology",
            "Social Media Integration",
            "Portfolio Showcase",
            "Priority Support",
          ],
          inStock: true,
          rating: 4.7,
          reviews: 67,
        },
      ],
      setProducts: (products) => set({ products }),
      getProductById: (id) => get().products.find((p) => p.id === id),
      getProductsByCategory: (category) =>
        get().products.filter((p) => p.category === category),

      // Wishlist
      wishlist: [],
      addToWishlist: (productId) => {
        const wishlist = get().wishlist;
        if (!wishlist.includes(productId)) {
          set({ wishlist: [...wishlist, productId] });
        }
      },
      removeFromWishlist: (productId) => {
        set({ wishlist: get().wishlist.filter((id) => id !== productId) });
      },
      isInWishlist: (productId) => get().wishlist.includes(productId),

      // Search
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchResults: [],
      setSearchResults: (results) => set({ searchResults: results }),
    }),
    {
      name: "shareinfo-store",
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
      }),
    },
  ),
);
