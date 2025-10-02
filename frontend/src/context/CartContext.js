"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";
import { useAuth } from "./AuthContext";
import { trackAddToCart, trackRemoveFromCart } from "../components/GoogleAnalytics";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        const stored = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
        setItems(stored ? JSON.parse(stored) : []);
        return;
      }
      setLoading(true);
      try {
        const cart = await apiFetch("/api/cart", { token });
        const normalized = (cart.items || []).map((i) => ({ product: i.product._id || i.product, quantity: i.quantity, productData: i.product }));
        setItems(normalized);
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, [token]);

  useEffect(() => {
    if (!token && typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, token]);

  const addItem = async (productId, quantity = 1, productData = null) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product === productId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next.filter(i => i.quantity > 0);
      }
      return [...prev, { product: productId, quantity, productData }];
    });
    
    // Track analytics
    if (productData) {
      trackAddToCart(
        productId,
        productData.name,
        productData.category?.name || 'Uncategorized',
        productData.price * quantity,
        quantity
      );
    }
    
    if (token) {
      try { await apiFetch("/api/cart/add", { method: "POST", body: { product: productId, quantity }, token }); } catch (_) {}
    }
  };

  const updateQuantity = async (productId, nextQty) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product === productId);
      if (idx < 0) return prev;
      const next = [...prev];
      if (nextQty <= 0) {
        return next.filter(i => i.product !== productId);
      }
      next[idx] = { ...next[idx], quantity: nextQty };
      return next;
    });
    if (token) {
      try {
        const current = items.find(i => i.product === productId)?.quantity || 0;
        const delta = nextQty - current;
        if (nextQty <= 0) {
          await apiFetch("/api/cart/remove", { method: "POST", body: { product: productId }, token });
        } else if (delta !== 0) {
          await apiFetch("/api/cart/add", { method: "POST", body: { product: productId, quantity: delta }, token });
        }
      } catch (_) {}
    }
  };

  const removeItem = async (productId) => {
    const item = items.find(i => i.product === productId);
    
    // Track analytics
    if (item && item.productData) {
      trackRemoveFromCart(
        productId,
        item.productData.name,
        item.productData.category?.name || 'Uncategorized',
        item.productData.price * item.quantity,
        item.quantity
      );
    }
    
    setItems((prev) => prev.filter((i) => i.product !== productId));
    if (token) {
      try { await apiFetch("/api/cart/remove", { method: "POST", body: { product: productId }, token }); } catch (_) {}
    }
  };

  const clear = async () => {
    setItems([]);
    if (token) {
      try { await apiFetch("/api/cart/clear", { method: "POST", token }); } catch (_) {}
    }
  };

  const value = useMemo(() => ({ items, loading, addItem, updateQuantity, removeItem, clear }), [items, loading]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
