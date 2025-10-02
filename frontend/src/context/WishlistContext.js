"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState([]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("wishlist") : null;
    setIds(stored ? JSON.parse(stored) : []);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("wishlist", JSON.stringify(ids));
  }, [ids]);

  const add = (id) => setIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const remove = (id) => setIds((prev) => prev.filter((x) => x !== id));
  const toggle = (id) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const value = useMemo(() => ({ ids, add, remove, toggle }), [ids]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
