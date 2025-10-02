import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { WishlistProvider, useWishlist } from '../context/WishlistContext';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = jest.fn();

describe('Context Providers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('CartContext', () => {
    test('initializes with empty cart', () => {
      const wrapper = ({ children }) => (
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      );
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.items).toEqual([]);
      expect(result.current.loading).toBe(false);
    });

    test('adds item to cart', () => {
      const wrapper = ({ children }) => (
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      );
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addItem('product1', 2, { name: 'Test Product', price: 100 });
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toEqual({
        product: 'product1',
        quantity: 2,
        productData: { name: 'Test Product', price: 100 }
      });
    });

    test('updates item quantity', () => {
      const wrapper = ({ children }) => (
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      );
      const { result } = renderHook(() => useCart(), { wrapper });

      // Add item first
      act(() => {
        result.current.addItem('product1', 1, { name: 'Test Product', price: 100 });
      });

      // Update quantity
      act(() => {
        result.current.updateQuantity('product1', 3);
      });

      expect(result.current.items[0].quantity).toBe(3);
    });

    test('removes item from cart', () => {
      const wrapper = ({ children }) => (
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      );
      const { result } = renderHook(() => useCart(), { wrapper });

      // Add item first
      act(() => {
        result.current.addItem('product1', 1, { name: 'Test Product', price: 100 });
      });

      // Remove item
      act(() => {
        result.current.removeItem('product1');
      });

      expect(result.current.items).toHaveLength(0);
    });

    test('clears cart', () => {
      const wrapper = ({ children }) => (
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      );
      const { result } = renderHook(() => useCart(), { wrapper });

      // Add items first
      act(() => {
        result.current.addItem('product1', 1, { name: 'Test Product 1', price: 100 });
        result.current.addItem('product2', 2, { name: 'Test Product 2', price: 50 });
      });

      // Clear cart
      act(() => {
        result.current.clear();
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('WishlistContext', () => {
    test('initializes with empty wishlist', () => {
      const wrapper = ({ children }) => <WishlistProvider>{children}</WishlistProvider>;
      const { result } = renderHook(() => useWishlist(), { wrapper });

      expect(result.current.ids).toEqual([]);
    });

    test('toggles item in wishlist', () => {
      const wrapper = ({ children }) => <WishlistProvider>{children}</WishlistProvider>;
      const { result } = renderHook(() => useWishlist(), { wrapper });

      // Add to wishlist
      act(() => {
        result.current.toggle('product1');
      });

      expect(result.current.ids).toContain('product1');

      // Remove from wishlist
      act(() => {
        result.current.toggle('product1');
      });

      expect(result.current.ids).not.toContain('product1');
    });
  });
});
